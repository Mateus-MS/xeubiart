# 🚀 Project Zero

Welcome to **Project Zero** — cool name, right?

This project is a lightweight boilerplate that i created to kickstart new Go-Based web applications without having to rewrite the same code every time. <br>
Think of it as my __starter pack__ for spinning up HTTP servers with templating and styling baked in.

Whether you're prototyping fast or building something small and clean, this base setup will save you time and typing. ⌨️✨

---

## 🧱 Tech Stack Overview

### Backend
- Built with pure **[Go](https://go.dev/doc/effective_go) (Golang)** 🦫 - no frameworks, just standard libraries for full controll and simplicity.
- Uses **[Templ](https://templ.guide/)** for HTML templating, enabling efficient and clean server-side rendering.

### Frontend
- Styled with **[SASS](https://sass-lang.com/documentation/)** for flexible and maintanable CSS.

---

## 📦 What's Inside?

This repo includes everything you need to get up and running:

- ✅ **Boilerplate HTTP server** — fully set up and ready to serve routes
- 📁 **Organized folder structure** — a clear project layout to keep things tidy
- 🔁 **Hot reload support** — auto-compile your Go and SASS files during development
- 🏗️ **Build command** — easily compile your app for production

---

## ✨ Features
Project Zero comes with a small but powerfull set of features to help you build web applications faster:

> [!NOTE]
> ```bash
> dev\
> ├── backend\  
> ├── features\ 
> └── frontend\  
> ```
> All features of **ProjectZero** are contained within this folder. You can easily update to the latest version by simply replacing this folder with the updated one.

- ⚙️ **[Router](#router)** <br>
    A clean and scalable way to group and register your routes using Go.
- 🧩 **[Middlewares](#middlewares)** <br>
    Easily plug in reusable logic before hitting your route handlers — fully composable using middleware chains.

---

# 📚 Documentation

This section provides more detailed information on how to use Project Zero.  

Whether you're extending the boilerplate or just trying to understand how things are wired together, this is your go-to reference. 🔧

## Router

In your `app`, the `router` is the component where you define and attach your routes so the application can listen and respond to incoming requests.

To keep things well-organized 🗂️, it's recomended to group related routes into logical folders. One way to do this is by creating a route group using the following structure:

```bash
routes\       # Main folder for all your routes.
│      
├── user\     # Custom folder for routes related to users.  
│   │   
│   │         # These are your defined routes.
│   │   
│   ├── registerRoute.go   
│   ├── loginRoute.go
│   │   
│   │   # This file is where you gonna define
│   │   # the type and the function to register
│   │   # the routes you defined above.
│   └── handle_routes.go
```

Inside the `user` folder, you'll define a Go file (e.g., `handle_routes.go`) that contains both a type and a function to manage the user-related routes.

### Defining a route group

First, define a struct that represents your route group. This struct should include a reference to the application, so you can register routes with it:

```go
type UserRoutes struct {
    App *app.Application
}
```

Next, define a function to register the routes for this group:

```go
func RegisterRoutes(app *app.Application){
    userRoutes := &UserRoutes{App: app}
    
    app.Router.HandleFunc("/register", userRoutes.RegisterRoute)
}
```

We'll discuss the parameters for `HandleFunc` in more detail shortly.

> [!NOTE]
> Grouping routes is optional. If you have a route that don't make sense to group with others, there's no need to create an entire group just for that.

### Creating routes

Inside the `user` folder, you can define your endpoints. For example, a route to handle user registration.

```go
func (user *UserRoutes) RegisterRoute(w http.ResponseWriter, r *http.Request) {
    // Implementation for the user registration route
}
```

> [!TIP]
> For consistency suffix all route handler function names with "Route" (e.g., `RegisterRoute`, `LoginRoute`).

As you can see the function is "tied" to the `UserRoutes` type, in another worlds, is on our routes group for user.

## Middlewares

> [!WARNING]
> Currently, middlewares can **only** be used in chains — even if you're applying just one.

> [!IMPORTANT]
> ❌ **No global middlewares support (Yet)** <br>
> Unlike some frameworks, you **cannot** apply middlewares globally in Project Zero... for now 😅

### 🔍 What Are Middlewares?

Middlewares are small functions that run **before** your actual route logic. They're useful for handling common tasks like:


- Authentication ✅  
- CORS headers 🌍  
- Logging 📝  
- Input validation 📋 

Let’s say you have several endpoints that require checking for an authentication cookie. Sure, you *could* call an auth function manually at the top of each handler — but that clutters your endpoint logic. Instead, you can use a middleware and attach it directly to the route. Clean and simple.

### 🛠️ Using Middlewares in Project Zero

Let’s revisit the standard route registration (as shown in [Router](#router)):

```go
func RegisterRoutes(app *app.Application){
    userRoutes := &UserRoutes{App: app}
    
    app.Router.HandleFunc("/register", userRoutes.RegisterRoute)
}
```

Now let’s say we want to use a middleware, like CorsMiddleware.
> [!WARNING] 
> Currently, middlewares can **only** be used in chains — even if you're applying just one.

```go
func RegisterRoutes(app *app.Application) {
    userRoutes := &UserRoutes{App: app}

    app.Router.HandleFunc(
        "/register",
        middlewares.Chain(
            // Endpoint
            http.HandlerFunc(userRoutes.RegisterRoute),
            
            // Middlewares
            middlewares.CorsMiddleware("GET"),
        ),
    )
}
```

### 🧱 Middleware breakdown

`middlewares.Chain()`

This function wraps your handler in one or more middleware layers. It accepts:

- http.Handler — your actual endpoint
- One or more middleware functions that conform to the Middleware type.

Middleware Example: `CorsMiddleware`
```go
middlewares.CorsMiddleware("GET")
```
> [!NOTE]
> Some middlewares might require parameters (like allowed methods), so be sure to check their function signatures.

### 🧪 Creating Your Own Middleware

You can define custom middleware in the middlewares/ folder. Just follow this structure:

```go
func CustomMiddleware(allowedMethods ...string) Middleware {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Your custom logic here

            next.ServeHTTP(w, r.WithContext(r.Context()))
        })
    }
}
```
And that’s it — you've got a clean, reusable middleware 💪

# 👥 Who's Using Project Zero?
Project Zero is already helping developers kickstart their Go-based web applications with ease! Here are a few examples of how **Project Zero** is being used:

🧊 [Cubonauta](https://cubonauta.com): Cubonauta is a platform dedicated to teaching newcomers and helping veterans master the art of solving the Rubik's Cube.

✍️ [Xeubiart](https://xeubiart.com): Xeubiart is a talented tattoo artist based in Portugal, who uses **Project Zero** as the foundation for their personal website.

----

If you're using Project Zero in your project, feel free to share it with us! Drop a message in the issues or a pull request, and we'll be happy to showcase it here. Let’s grow the Project Zero community together! 🚀

<br>
<br>

![Works on My Machine](https://img.shields.io/badge/works-on%20my%20machine-green?style=flat&logo=probot)
