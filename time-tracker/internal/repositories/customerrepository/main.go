package customerrepository

import "time-tracker/internal/db"

type CustomerRepository struct {
	db *db.Db
}

func New(db *db.Db) *CustomerRepository {
	return &CustomerRepository{
		db: db,
	}
}

func (r *CustomerRepository) AddCustomer(name string) (int64, error) {
	insertSql := `INSERT INTO customers (name) VALUES (?)`

	tx, err := r.db.Db.Begin()
	if err != nil {
		return 0, err
	}

	stmt, err := tx.Prepare(insertSql)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(name)
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	return id, tx.Commit()
}
