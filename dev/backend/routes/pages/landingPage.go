package routes_pages

import (
	"net/http"
	landingpage "placeholder/dev/frontend/mobile/pages/landing"
	"strings"
)

func (app *RoutesPages) LandingPageRoute(w http.ResponseWriter, r *http.Request) {
	// Send the page only if the user agent is mobile
	if strings.Contains(r.UserAgent(), "Mobile") {
		landingpage.LandingPage().Render(r.Context(), w)
		return
	}

	// If the user agent is not mobile, return a 404 error
	http.Error(w, "Page not found", http.StatusNotFound)
}
