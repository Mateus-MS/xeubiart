package app

import (
	"net/http"
	"os"
	"sync"

	"com.xeubiart/app/domains/gallery/service"
	"com.xeubiart/app/router"
	"github.com/gin-gonic/gin"
)

var (
	instance *application
	once     sync.Once
)

type application struct {
	Router     *gin.Engine
	HTTPClient *router.HTTPClient
	Services   services
}

type services struct {
	GalleryService service.GalleryService
}

func new() *application {
	httpClient := router.New(&http.Client{})

	return &application{
		Router:     gin.Default(),
		HTTPClient: httpClient,
		Services: services{
			GalleryService: *service.New(
				getBaseURL(),
				httpClient,
			),
		},
	}
}

func getBaseURL() string {
	if env := os.Getenv("APP_ENV"); env == "prod" {
		return "http://infra"
	}

	return "http://localhost"
}

func GetInstance() *application {
	once.Do(func() {
		instance = new()
	})
	return instance
}
