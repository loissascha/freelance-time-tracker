package db

import (
	"database/sql"
	"embed"
	"fmt"
	"github.com/pressly/goose/v3"

	_ "github.com/mattn/go-sqlite3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

type Db struct {
	Db *sql.DB
}

func InitDb() *Db {
	dbFileName := "tracker.db"

	db, err := sql.Open("sqlite3", dbFileName)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// ping database
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to the database.")

	d := &Db{
		Db: db,
	}
	err = d.runMigrations()
	if err != nil {
		panic(err)
	}
	return d
}

func (db *Db) runMigrations() error {
	goose.SetBaseFS(embedMigrations)

	err := goose.SetDialect("sqlite3")
	if err != nil {
		return err
	}

	fmt.Println("Running database migrations...")
	err = goose.Up(db.Db, "migrations")
	if err != nil {
		return err
	}
	fmt.Println("Migrations applied successfully.")
	return nil
}
