package trackedtimesrepository

import (
	"fmt"
	"time"
	"time-tracker/internal/db"
	"time-tracker/internal/entities"
)

type TrackedTimesRepository struct {
	db *db.Db
}

func New(db *db.Db) *TrackedTimesRepository {
	return &TrackedTimesRepository{
		db: db,
	}
}

func (r *TrackedTimesRepository) AddTime(id int64, customerId int64, startTime time.Time, endTime time.Time) (int64, error) {
	insertSql := `INSERT INTO tracked_times (id, customer_id, startTime, endTime, comment) VALUES (?, ?, ?, ?, ?)`

	tx, err := r.db.Db.Begin()
	if err != nil {
		return 0, err
	}

	stmt, err := tx.Prepare(insertSql)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(id, customerId, startTime, endTime, "")
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	insertId, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		return 0, err
	}

	return insertId, tx.Commit()
}

func (r *TrackedTimesRepository) DeleteTime(id int64) error {
	updateSql := `UPDATE tracked_times SET deleted=true WHERE id=?`
	_, err := r.db.Db.Exec(updateSql, id)
	if err != nil {
		return err
	}
	return nil
}

func (r *TrackedTimesRepository) UpdateTimeComment(id int64, comment string) error {
	updateSql := `UPDATE tracked_times SET comment=? WHERE id=?`
	res, err := r.db.Db.Exec(updateSql, comment, id)
	if err != nil {
		return err
	}
	affectedRows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affectedRows == 0 {
		return fmt.Errorf("No rows affected!")
	}
	return nil
}

func (r *TrackedTimesRepository) UpdateTimeStartTime(id int64, startTime time.Time) error {
	updateSql := `UPDATE tracked_times SET startTime=? WHERE id=?`
	res, err := r.db.Db.Exec(updateSql, startTime, id)
	if err != nil {
		return err
	}
	affectedRows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affectedRows == 0 {
		return fmt.Errorf("No rows affected!")
	}
	return nil
}

func (r *TrackedTimesRepository) UpdateTimeEndTime(id int64, endTime time.Time) error {
	updateSql := `UPDATE tracked_times SET endTime=? WHERE id=?`
	res, err := r.db.Db.Exec(updateSql, endTime, id)
	if err != nil {
		return err
	}
	affectedRows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affectedRows == 0 {
		return fmt.Errorf("No rows affected!")
	}
	return nil
}

func (r *TrackedTimesRepository) GetTimesForCustomer(customerId int64) ([]entities.TrackedTime, error) {
	selectSql := `SELECT id, startTime, endTime, comment FROM tracked_times WHERE customer_id=? AND deleted=false ORDER BY id DESC`
	rows, err := r.db.Db.Query(selectSql, customerId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trackedTimes []entities.TrackedTime
	for rows.Next() {
		var trackedTime entities.TrackedTime
		trackedTime.CustomerId = customerId
		if err := rows.Scan(&trackedTime.ID, &trackedTime.StartTime, &trackedTime.EndTime, &trackedTime.Comment); err != nil {
			return nil, err
		}
		trackedTimes = append(trackedTimes, trackedTime)
	}

	return trackedTimes, nil
}
