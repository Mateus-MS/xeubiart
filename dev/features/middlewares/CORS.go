package projectzero_middlewares

import (
	"net/http"
	"slices"
)

func CorsMiddleware(allowedMethods ...string) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check if the method is allowed
			// While create the string with the allowed methods
			methodString := ""
			for index, method := range allowedMethods {
				if slices.Contains(allowedMethods, r.Method) {
					methodString += method
					if index < len(allowedMethods)-1 {
						methodString += ", "
					}
				} else {
					http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
				}
			}

			// Set CORS headers
			w.Header().Set("Access-Control-Allow-Origin", "https://cubonauta.com")
			w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, "+methodString)
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, X-CSRF-Token")
			w.Header().Set("Access-Control-Expose-Headers", "X-CSRF-Token")

			// Handle preflight requests
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r.WithContext(r.Context()))
		})
	}
}
