package db

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type Db struct {
	Db *sql.DB
}

func InitDb() *Db {
	dbFileName := "tracker.db"

	// _, err := os.Stat(dbFileName)
	// needsSetup := os.IsNotExist(err)

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

	// Schema migration
	// if needsSetup {
	// 	// createSchema(db)
	// }

	return &Db{
		Db: db,
	}
}

// func createSchema(db *sql.DB) error {
// 	// The SQL statement to create the customers table.
// 	// `INTEGER PRIMARY KEY AUTOINCREMENT` creates a unique ID for each new row.
// 	// `TEXT NOT NULL` means the field must have a value.
// 	// `UNIQUE` ensures we don't have duplicate customer names.
// 	createCustomersTableSQL := `
// 	CREATE TABLE customers (
// 		"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
// 		"name" TEXT NOT NULL UNIQUE,
// 		"created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
// 	);`
//
// 	// `Exec` is used for statements that don't return rows (like CREATE, INSERT, UPDATE, DELETE).
// 	_, err := db.Exec(createCustomersTableSQL)
// 	if err != nil {
// 		return err
// 	}
//
// 	// The SQL statement to create the time_entries table.
// 	// `FOREIGN KEY(customer_id) REFERENCES customers(id)` creates a link between
// 	// this table and the customers table. It ensures that a time entry can only
// 	// be created for a customer that actually exists.
// 	createTimeEntriesTableSQL := `
// 	CREATE TABLE time_entries (
// 		"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
// 		"customer_id" INTEGER NOT NULL,
// 		"hours" REAL NOT NULL,
// 		"description" TEXT,
// 		"entry_date" DATETIME DEFAULT CURRENT_TIMESTAMP,
// 		FOREIGN KEY(customer_id) REFERENCES customers(id)
// 	);`
//
// 	_, err = db.Exec(createTimeEntriesTableSQL)
// 	return err
// }
