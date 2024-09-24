package main

import (
	"context"
	"sync"
	"time"

	"github.com/charmbracelet/log"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

func main() {
	log.Info("Current UTC time! |", "Time", time.Now().UTC())

	db := pg.Connect(&pg.Options{
		Addr:     "localhost:5432",
		User:     "postgres",
		Password: "jesuisunecarotte",
	})
	defer db.Close()

	// err := createSchema(db)
	// if err != nil {
	// 	log.Fatal("Failed to create schema! |", "Error", err.Error())
	// }

	dl := log.Default()
	dl.SetLevel(log.DebugLevel)

	var wg sync.WaitGroup

	j := JobHandler{
		Ctx:    context.Background(),
		Limit:  50,
		RTime:  1000,
		Logger: *dl,
		Db:     db,
		Wg:     &wg,
	}

	err := j.CreateWorkerPool()
	if err != nil {
		log.Fatal("Failed to create worker pool! |", "Error", err.Error())
	}
	log.Info("Created worker pool!", "Workers", j.Pool.Cap())

	// TODO implement graceful shutdown
	// ! REMEMBER TO STOP THIS TICKER
	ticker := time.NewTicker(30 * time.Second)
	wg.Add(1)
	go func() {
		defer wg.Done()
		for ; true; <-ticker.C {
			err := j.PopulateJobList()
			log.Info("Populated joblist! |", "Jobs", len(j.Jobs))
			if err != nil {
				log.Fatal("Failed to populate job list! |", "Err", err.Error())
			}
		}
	}()

	j.ExecuteAll()

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
			return err
		}
	}
	return nil
}
