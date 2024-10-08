package main

import (
	"context"
	"fmt"
	"os"
	"reflect"
	"strings"
	"sync"
	"time"

	"github.com/carlmjohnson/requests"
	"github.com/charmbracelet/log"
	"github.com/go-pg/pg/v10"
	"github.com/panjf2000/ants/v2"
)

type Provider string
type WorkerFunc func()

const (
	PG_LAYOUT = "2006-01-02 15:04:05.999999999"
)

const (
	ProviderMoralis Provider = "moralis"
	ProviderInfura  Provider = "infura"
	ProviderAlchemy Provider = "alchemy"
)

type JobHandler struct {
	// Jobs stack to be executed
	Jobs []Job
	// Context of the job handler
	Ctx context.Context
	// Job limit
	Limit int
	// Run time
	RTime int
	// Pool of workers
	Pool *ants.MultiPool
	// Waitgroup
	Wg *sync.WaitGroup
	// Logger of the job handler
	Logger log.Logger
	// DB
	Db *pg.DB
	// Jobs being executed
	// ! anecdote: int for BIGSERIAL only works in 64-bit system I think...
	// ? we need a mutex because map write are not concurrent in Go could this be a bottleneck
	// ? let's use: sync.Map[int]struct{} | see: https://pkg.go.dev/sync#Map
	ExecutedJobs *sync.Map
	// The address of the API that provides the jobs
	JobProvider string
}

func (j Job) Insert(db *pg.DB, data UntypedJson) {
	// Start a transaction
	tx, err := db.Begin()
	if err != nil {
		log.Error("Failed to start transaction | Reason:", err.Error())
		return
	}
	defer tx.Rollback() // Ensures rollback in case of failure

	var rawData map[string]interface{}
	// Query for existing data
	_, err = tx.Query(&rawData, "SELECT result FROM rpc_data WHERE id = ?", j.Id)
	if err != nil {
		log.Error("Failed to query existing data |", "Reason", err.Error())
		return
	}

	// Check if rawData is empty (no existing data)
	if rawData == nil {
		// No existing data, perform INSERT
		err = insertResponse(tx, j.Id, data)
		if err != nil {
			log.Error("Failed to insert! |", "Reason", err.Error())
			return
		}
		log.Debug("Inserted successfully |", "Id", j.Id)
	} else {
		// Perform UPDATE if data differs
		// TODO This always returns false. So we always update => waste of resources
		if !reflect.DeepEqual(UntypedJson(rawData), data) {
			err = updateResponse(tx, j.Id, data)
			if err != nil {
				log.Error("Failed to update! |", "Reason", err.Error())
				return
			}
			log.Debug("Updated successfully |", "Id", j.Id)
		} else {
			log.Debug("Data is the same, no changes needed |", "Id", j.Id)
		}
	}

	// Commit transaction if no errors occurred
	err = tx.Commit()
	if err != nil {
		log.Error("Failed to commit transaction |", "Reason", err.Error())
		return
	}
}

func insertResponse(tx *pg.Tx, id int, data UntypedJson) error {
	_, err := tx.Model(&RpcData{
		Id:     id,
		Result: data,
	}).Insert()
	return err
}

func updateResponse(tx *pg.Tx, id int, data UntypedJson) error {
	_, err := tx.Exec("UPDATE rpc_data SET result = ? WHERE id = ?", data, id)
	return err
}

func (j Job) ParseExpirationDate() (*time.Time, error) {
	parsedDate, err := time.Parse(PG_LAYOUT, j.Expiration)
	if err != nil {
		return nil, err
	}

	return &parsedDate, nil
}

func (j Job) MakeEndpoint() string {
	n := strings.ToUpper(fmt.Sprintf("%s_%d", j.Provider, j.ChainId))
	log.Debug("Created key from env? |", "Key", n)
	return os.Getenv(n)
}

type NoEndpointFromEnv struct {
	Provider Provider
	ChainId  uint
}

func (e *NoEndpointFromEnv) Error() string {
	return fmt.Sprintf("can't find env variable for %s_%d", e.Provider, e.ChainId)
}

func (j Job) Fetch(ctx context.Context) (*UntypedJson, error) {
	k := j.MakeEndpoint()
	if len(k) == 0 {
		return nil, &NoEndpointFromEnv{
			Provider: j.Provider,
			ChainId:  j.ChainId,
		}
	}

	var res UntypedJson
	err := requests.
		URL(k).
		Accept("application/json").
		BodyJSON(j.Rpc).
		ToJSON(&res).
		Fetch(ctx)

	return &res, err
}

func (jh *JobHandler) PopulateJobList() error {
	var newJobs []Job

	err := requests.
		URL(jh.JobProvider).
		ToJSON(&newJobs). // Fetch new jobs into a temporary slice
		Bearer("helloworld").
		Accept("application/json").
		BodyJSON(GetJobRequest{
			Limit: jh.Limit,
		}).
		Fetch(jh.Ctx)

	if err != nil {
		return err
	}

	log.Debug(newJobs)

	// Filter out jobs that have already been executed
	for _, job := range newJobs {
		if _, executed := jh.ExecutedJobs.Load(job.Id); !executed {
			jh.ExecutedJobs.Store(job.Id, struct{}{}) // Mark as executed
			log.Debug("New job?", "Id", job.Id)
			jh.Jobs = append(jh.Jobs, job)
		}
	}

	return nil
}

func (jh *JobHandler) CreateWorkerPool() error {
	var err error

	jh.Pool, err = ants.NewMultiPool(jh.Limit, jh.RTime, ants.LeastTasks)
	return err
}

func (jh JobHandler) AddToWorkerPool(t WorkerFunc) error {
	err := jh.Pool.Submit(t)
	return err
}

func CheckIfExpired(toCheck time.Time, job Job) bool {
	return time.Now().UTC().After(toCheck)
}

func (jh *JobHandler) ExecuteAll() {
	jh.Wg.Add(len(jh.Jobs)) // Add the total number of jobs to the WaitGroup

	for _, job := range jh.Jobs {
		log.Info("Executing a job in the worker pool! |", "Id", job.Id, "Provider", job.Provider)

		// Capture job in closure
		job := job // Shadow the loop variable
		jh.Wg.Add(1)

		// Add the job execution to the worker pool
		err := jh.AddToWorkerPool(func() {
			defer jh.Wg.Done() // Mark job as done when it finishes

			expirationTime, err := job.ParseExpirationDate()
			if err != nil {
				log.Error("Failed to parse expiration date!", "Id", job.Id, "Error", err.Error())
				return
			}

			// Skip expired jobs
			if CheckIfExpired(*expirationTime, job) {
				log.Info("Job expired before execution! |", "Id", job.Id, "Date", job.Expiration)
				return
			}

			// Mark the job as executed
			jh.ExecutedJobs.Store(job.Id, struct{}{})

			// Create a channel to signal expiration
			expired := make(chan struct{})

			// Start a goroutine to check for expiration
			go func() {
				for {
					if CheckIfExpired(*expirationTime, job) {
						close(expired) // Signal that the job has expired
						return
					}
					time.Sleep(time.Second) // Check every second
				}
			}()

			ticker := time.NewTicker(time.Duration(job.Frequency) * time.Minute)
			defer ticker.Stop()

			// Initial fetch and insert
			// I don't return in case of error because the issue could just be mundane and simple to fix.
			// No need to kill a job for that...
			res, err := job.Fetch(jh.Ctx)
			if err != nil {
				log.Error("Failed to get response from server!", "Id", job.Id, "Provider", job.Provider, "Error", err.Error())
			} else {
				job.Insert(jh.Db, *res)
			}

			for {
				select {
				case <-expired:
					log.Debug("Job expired during execution! |", "Id", job.Id)
					return
				case <-ticker.C:
					res, err := job.Fetch(jh.Ctx)
					if err != nil {
						log.Error("Failed to get response from server!", "Id", job.Id, "Provider", job.Provider, "Error", err.Error())
					} else {
						job.Insert(jh.Db, *res)
					}
				}
			}
		})

		if err != nil {
			log.Error("Failed to add job to worker pool! |", "error", err)
		}
	}

	// Clear the job list after execution
	jh.Jobs = []Job{}

	// Wait for all jobs to finish
	jh.Wg.Wait()
}
