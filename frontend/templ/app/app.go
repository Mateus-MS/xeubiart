package app

import (
	"sync"

	"github.com/gin-gonic/gin"
)

var (
	instance *application
	once     sync.Once
)

type application struct {
	Router *gin.Engine
}

func new() *application {
	router := gin.Default()

	router.Static("/static", "./static")

	return &application{
		Router: router,
	}
}

func GetInstance() *application {
	once.Do(func() {
		instance = new()
	})
	return instance
}
