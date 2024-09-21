package main

import (
	"context"
	"sync"
	"time"

	"github.com/carlmjohnson/requests"
	"github.com/charmbracelet/log"
	"github.com/panjf2000/ants/v2"
)

type Provider string
type WorkerFunc func()

const (
	ProviderMoralis Provider = "moralis"
	ProviderInfura  Provider = "infura"
	ProviderAlchemy Provider = "alchemy"
)

type GetJobRequest struct {
	Limit int `json:"limit"`
}

type Job struct {
	Id         int      `json:"id"`
	Frequency  uint     `json:"frequency"`
	Expiration string   `json:"expiration"`
	Provider   Provider `json:"provider"`
	Rpc        Rpc      `json:"rpc"`
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

// TODO MORALIS
func (p Provider) Fetch(rpc Rpc, ctx context.Context) *UntypedJson {
	switch p {
	case "moralis":
		req, err := Moralis{
			Key: "https://site1.moralis-nodes.com/eth/",
			Url: "b709baba444840c6a608baf627c5572c",
			Ctx: ctx,
		}.Fetch(rpc)
		if err != nil {
			log.Error("Failed to make request! |", "Error", err.Error())
		}
		return req
	case "infura":
		// TODO
		return nil
	case "alchemy":
		// TODO
		return nil
	default:
		log.Error("Provider not supported!", "Provider", p)
		return nil
	}
}

func (p Provider) Insert(res UntypedJson) {
	log.Info("Inserting!")
}

func (j Job) ParseExpirationDate() (*time.Time, error) {
	parsedDate, err := time.Parse("2006-01-02 15:04:05.000", j.Expiration)
	if err != nil {
		return nil, err
	}

	return &parsedDate, nil
}

// TODO error handling
func (j Job) Fetch() {
	log.Info("Loading provider! |", "Provider", j.Provider)
	res := j.Provider.Fetch(j.Rpc, context.Background())
	if res == nil {
		return
	}

	j.Provider.Insert(*res)
}

func (jh *JobHandler) PopulateJobList() error {
	err := requests.
		URL("http://localhost:8000/jobs").
		ToJSON(&jh.Jobs).
		Bearer("helloworld").
		Accept("application/json").
		BodyJSON(GetJobRequest{
			Limit: jh.Limit,
		}).
		Fetch(jh.Ctx)

	return err
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
			log.Error("Failed to add job to worker pool! |", "error", err)
		}
	}

	// Wait for all jobs to finish
	wg.Wait()
}
