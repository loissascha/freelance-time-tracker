package trackedtimesrepository

import (
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

func (r *TrackedTimesRepository) GetTimesForCustomer(customerId int64) ([]entities.TrackedTime, error) {
	selectSql := `SELECT id, startTime, endTime, comment FROM tracked_times WHERE customer_id=? ORDER BY id DESC`
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
