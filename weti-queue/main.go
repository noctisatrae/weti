package main

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"noctisatrae/weti-queue/config"

	"github.com/charmbracelet/log"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

func main() {
	log.Info("Current UTC time! |", "Time", time.Now().UTC())

	config := config.Parse("config.toml")
	dl := log.Default()
	if config.Logger.Debug == true {
		dl.SetLevel(log.DebugLevel)
		log.Debug("Debug mode activated!")
	}

	db := pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "postgres",
		Password: "jesuisunecarotte",
	})
	defer db.Close()

	err := createSchema(db)
	if err != nil {
		log.Fatal("Failed to create schema! |", "Error", err.Error())
	}

	var wg sync.WaitGroup

	j := JobHandler{
		Ctx:          context.Background(),
		Limit:        config.JobHandler.Limit,
		RTime:        config.JobHandler.Rtime,
		Logger:       *dl,
		Db:           db,
		Wg:           &wg,
		ExecutedJobs: &sync.Map{},
	}

	err = j.CreateWorkerPool()
	if err != nil {
		log.Fatal("Failed to create worker pool! |", "Error", err.Error())
	}
	log.Info("Created worker pool!", "Workers", j.Pool.Cap())

	// Create a context to handle graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ticker := time.NewTicker(30 * time.Second)
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer ticker.Stop()

		doWork := func() {
			err := j.PopulateJobList()
			go j.ExecuteAll()
			if err != nil {
				log.Error("Failed to populate job list! |", "Err", err.Error())
				return
			}
			log.Info("Populated joblist! |", "Jobs", len(j.Jobs))
		}

		// Execute the work immediately
		// TODO: find a name for this
		doWork()

		// Loop for subsequent executions based on the ticker
		for {
			select {
			case <-ctx.Done(): // Graceful shutdown
				log.Info("Shutting down the job list populating loop.")
				return
			case <-ticker.C: // Perform work on each tick
				doWork()
			}
		}
	}()

	wg.Wait()
}

func createSchema(db *pg.DB) error {
	models := []interface{}{
		(*RpcResponse)(nil),
	}

	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			Temp: false,
		})
		if err != nil {
			if strings.Contains(err.Error(), "42P07") || strings.Contains(err.Error(), "already exists") {
				log.Warn("Relation already exist! Skipping... |", "Relation", fmt.Sprintf("%T", model))
				continue
			} else {
				return err
			}
		}
	}
	return nil
}
