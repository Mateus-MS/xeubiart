package routes_pages

import (
	"net/http"

	projectzero_app "placeholder/dev/projectZero/app"
	projectzero_middlewares "placeholder/dev/projectZero/middlewares"
)

type RoutesPages struct {
	App *projectzero_app.Application
}

func RegisterRoutes(app *projectzero_app.Application) {
	pagesRoutes := &RoutesPages{App: app}

	// Register a clean route
	app.Router.HandleFunc("/test", pagesRoutes.TestPageRoute)

	// Register a route with a middleware
	app.Router.Handle("/test2", projectzero_middlewares.Chain(
		http.HandlerFunc(pagesRoutes.TestPageRoute),

		projectzero_middlewares.CorsMiddleware("GET"),
	))
}
