package routes_pages

import (
	"net/http"
	shoppage "placeholder/dev/frontend/mobile/pages/shop"
	"strings"
)

func (app *RoutesPages) ShopPageRoute(w http.ResponseWriter, r *http.Request) {
	// Send the page only if the user agent is mobile
	if strings.Contains(r.UserAgent(), "Mobile") {
		shoppage.ShopPage().Render(r.Context(), w)
		return
	}

	// If the user agent is not mobile, return a 404 error
	http.Error(w, "Page not found", http.StatusNotFound)
}
