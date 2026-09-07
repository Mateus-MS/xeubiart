package main

import (
	"com.xeubiart/app"
	_ "com.xeubiart/pages/landing"
	_ "com.xeubiart/pages/test"
)

func main() {
	app.GetInstance().Router.Run(":8081")
}
