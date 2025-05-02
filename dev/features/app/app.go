package projectzero_app

import (
	"database/sql"
	"net/http"
)

type Application struct {
	DB     *sql.DB
	Router *http.ServeMux
}

func NewApplication() *Application {
	// Create the router
	router := http.NewServeMux()

	// Serve static files from the "frontend" directory
	router.Handle("/frontend/", http.StripPrefix("/frontend/", http.FileServer(http.Dir("dev/frontend"))))

	// Return the application instance
	return &Application{
		// DB:     GetInstance(),
		Router: router,
	}
}
