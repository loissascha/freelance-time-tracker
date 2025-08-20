package main

import (
	"context"
	"embed"
	"time-tracker/internal/db"
	"time-tracker/internal/handler/apphandler"
	"time-tracker/internal/handler/customerhandler"
	"time-tracker/internal/repositories/customerrepository"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

var apph *apphandler.App
var customerh *customerhandler.CustomerHandler

func main() {
	// database
	database := db.InitDb()
	defer database.Db.Close()

	// repositories
	customerRepo := customerrepository.New(database)

	// handlers
	apph = apphandler.NewApp()
	customerh = customerhandler.NewCustomerHandler(customerRepo)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "time-tracker",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 255},
		OnStartup:        startup,
		Bind: []interface{}{
			apph,
			customerh,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

func startup(ctx context.Context) {
	apph.Ctx = ctx
	customerh.Ctx = ctx
}
