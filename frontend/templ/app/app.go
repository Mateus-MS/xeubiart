package app

import (
	"net/http"
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
			GalleryService: *service.New(httpClient),
		},
	}
}

func GetInstance() *application {
	once.Do(func() {
		instance = new()
	})
	return instance
}
