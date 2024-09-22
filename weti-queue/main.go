package main

import (
	"context"

	"github.com/charmbracelet/log"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

func main() {
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

	j := JobHandler{
		Ctx:    context.Background(),
		Limit:  50,
		RTime:  1000,
		Logger: *log.Default(),
		Db:     db,
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
