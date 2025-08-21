package customerrepository

import (
	"fmt"
	"time-tracker/internal/db"
	"time-tracker/internal/entities"
)

type CustomerRepository struct {
	db *db.Db
}

func New(db *db.Db) *CustomerRepository {
	return &CustomerRepository{
		db: db,
	}
}

func (r *CustomerRepository) ListCustomers() ([]entities.Customer, error) {
	selectSql := `SELECT id, name FROM customers WHERE deleted=false ORDER BY id`
	rows, err := r.db.Db.Query(selectSql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var customers []entities.Customer
	for rows.Next() {
		var customer entities.Customer
		if err := rows.Scan(&customer.ID, &customer.Name); err != nil {
			return nil, err
		}
		customers = append(customers, customer)
	}

	return customers, nil
}

func (r *CustomerRepository) DeleteCustomer(id int64) error {
	deleteSql := `UPDATE customers SET deleted=true WHERE id=?`

	res, err := r.db.Db.Exec(deleteSql, id)
	if err != nil {
		return err
	}
	affectedRows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affectedRows == 0 {
		return fmt.Errorf("Could not find a customer with the given id.")
	}

	return nil
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
