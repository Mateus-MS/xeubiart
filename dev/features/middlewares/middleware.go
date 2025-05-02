package projectzero_middlewares

import "net/http"

type Middleware func(http.Handler) http.Handler

// The chain is runned backwards, so the last middleware is executed first.

// So the first middleware applied is the last to run
// Let's say we have the following middlewares:
//  - AuthMiddleware
//	- CorsMiddleware
//	- LoggerMiddleware

// And we want they to run in the order that we added it to the chain so...

//  - AuthMiddleware    -> First to be added, last to run
//	- CorsMiddleware
//	- LoggerMiddleware  -> Last to be added, first to run

func Chain(handler http.Handler, middlewares ...Middleware) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		handler = middlewares[i](handler)
	}
	return handler
}
