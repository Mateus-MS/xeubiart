package routes_pages

import (
	"net/http"

	projectzero_app "placeholder/dev/features/app"
	projectzero_middlewares "placeholder/dev/features/middlewares"
)

type RoutesPages struct {
	App *projectzero_app.Application
}

func RegisterRoutes(app *projectzero_app.Application) {
	pagesRoutes := &RoutesPages{App: app}

	app.Router.Handle("/", projectzero_middlewares.Chain(
		http.HandlerFunc(pagesRoutes.LandingPageRoute),

		projectzero_middlewares.CorsMiddleware("GET"),
	))

	app.Router.Handle("/shop", projectzero_middlewares.Chain(
		http.HandlerFunc(pagesRoutes.ShopPageRoute),

		projectzero_middlewares.CorsMiddleware("GET"),
	))
}
