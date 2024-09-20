package main

import (
	"context"
	"github.com/charmbracelet/log"
)

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
