package main

import (
	"context"
	"sync"
	"time"

	"github.com/carlmjohnson/requests"
	"github.com/charmbracelet/log"
	"github.com/panjf2000/ants/v2"
)

type GetJobRequest struct {
	Limit int `json:"limit"`
}

type Job struct {
	Id         int    `json:"id"`
	Frequency  uint   `json:"frequency"`
	Expiration string `json:"expiration"`
	RPC        struct {
		ID      int    `json:"id"`
		Jsonrpc string `json:"jsonrpc"`
	} `json:"rpc"`
}

func (j Job) Fetch() {
	log.Info("Worker running job ID", "id", j.Id)
	time.Sleep(5 * time.Second) // Simulate job running for 5 seconds
	log.Info("Worker finished job ID", "id", j.Id)
}

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
	// Logger of the job handler
	Logger log.Logger
}

func (jh *JobHandler) PopulateJobList() error {
	err := requests.
		URL("http://localhost:3000/jobs").
		ToJSON(&jh.Jobs).
		Bearer("helloworld").
		Accept("application/json").BodyJSON(GetJobRequest{
		Limit: jh.Limit,
	}).Fetch(jh.Ctx)

	return err
}

func (jh *JobHandler) CreateWorkerPool() error {
	var err error

	jh.Pool, err = ants.NewMultiPool(jh.Limit, jh.RTime, ants.LeastTasks)
	return err
}

type WorkerFunc func()

func (jh JobHandler) AddToWorkerPool(t WorkerFunc) error {
	err := jh.Pool.Submit(t)
	return err
}

func (jh JobHandler) ExecuteAll() {
	var wg sync.WaitGroup
	wg.Add(len(jh.Jobs)) // Add the total number of jobs to the WaitGroup

	for i := 0; i < len(jh.Jobs); i++ {
		log.Info("Executing a job in the worker pool! |", "Job", jh.Jobs[i])

		// Capture job in closure
		job := jh.Jobs[i]
		err := jh.AddToWorkerPool(func() {
			defer wg.Done() // Mark job as done when it finishes
			job.Fetch()
		})

		if err != nil {
			log.Error("Failed to add job to worker pool", "error", err)
		}
	}

	// Wait for all jobs to finish
	wg.Wait()
}

func main() {
	j := JobHandler{
		Ctx:    context.Background(),
		Limit:  50,
		RTime:  1000,
		Logger: *log.Default(),
	}

	err := j.PopulateJobList()
	if err != nil {
		log.Fatal("Failed to populate job list! |", "Err", err.Error())
	}

	log.Info("Populated joblist! |", "Jobs", len(j.Jobs))

	j.CreateWorkerPool()
	log.Info("Created worker pool!", "Workers", j.Pool.Cap())
	j.ExecuteAll()
}
