package main

import (
	"net/http"
	routes_pages "placeholder/dev/backend/routes/pages"
	projectzero_app "placeholder/dev/projectZero/app"
)

func main() {
	app := projectzero_app.NewApplication()

	routes_pages.RegisterRoutes(app)

	startServer(app.Router, "dev")
}

func startServer(router *http.ServeMux, env string) {
	if env == "dev" {
		println("Starting SERVER in DEV mode")
		go func() {
			if err := http.ListenAndServe("localhost:3000", router); err != nil {
				println("HTTP server error:", err)
			}
		}()
		select {}
	}
}
