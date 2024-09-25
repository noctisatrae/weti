package config

import (
	"os"

	"github.com/charmbracelet/log"
	"github.com/pelletier/go-toml/v2"
)

type JobHandler struct {
	Limit int `toml:"limit"`
	Rtime int `toml:"rtime"`
}

type Logger struct {
	Debug bool `toml:"debug"`
}

type Config struct {
	JobHandler JobHandler `toml:"job_handler"`
	Logger     Logger     `toml:"logger"`
}

var DEFAULT_CONFIG Config = Config{
	JobHandler: JobHandler{
		Limit: 50,
		Rtime: 1000,
	},
	Logger: Logger{
		Debug: true,
	},
}

func Parse(path string) Config {
	fileByte, err := os.ReadFile(path)
	if err != nil {
		log.Error("Failed to read config! Using defaults! |", "Error", err.Error())
		return DEFAULT_CONFIG
	}

	var config Config
	err = toml.Unmarshal(fileByte, config)
	if err != nil {
		log.Error("Failed to parse config! Using defaults! |", "Error", err.Error())
		return DEFAULT_CONFIG
	}

	return config
}
