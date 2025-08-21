package entities

import "time"

type TrackedTime struct {
	ID         int64     `json:"id"`
	CustomerId int64     `json:"customer_id"`
	StartTime  time.Time `json:"startTime"`
	EndTime    time.Time `json:"endTime"`
	Comment    string    `json:"comment"`
}
