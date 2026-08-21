package main

import (
	"com.xeubiart/app"
	_ "com.xeubiart/pages/landing"
)

func main() {
	app.GetInstance().Router.Run(":8081")
}
