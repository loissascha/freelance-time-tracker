package entities

type TrackedTime struct {
	ID         int64  `json:"id"`
	CustomerId int64  `json:"customer_id"`
	StartTime  string `json:"startTime"`
	EndTime    string `json:"endTime"`
	Comment    string `json:"comment"`
	Deleted    bool   `json:"deleted"`
}
