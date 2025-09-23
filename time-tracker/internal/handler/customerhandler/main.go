package customerhandler

import (
	"context"
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"time"
	"time-tracker/internal/entities"
	"time-tracker/internal/repositories/customerrepository"
	"time-tracker/internal/repositories/trackedtimesrepository"
)

type CustomerHandler struct {
	Ctx          context.Context
	customerRepo *customerrepository.CustomerRepository
	timeRepo     *trackedtimesrepository.TrackedTimesRepository
}

func NewCustomerHandler(customerRepo *customerrepository.CustomerRepository, timeRepo *trackedtimesrepository.TrackedTimesRepository) *CustomerHandler {
	return &CustomerHandler{
		customerRepo: customerRepo,
		timeRepo:     timeRepo,
	}
}

func (h *CustomerHandler) GetCustomers() []entities.Customer {
	customers, err := h.customerRepo.ListCustomers()
	if err != nil {
		panic(err)
	}
	return customers
}

func (h *CustomerHandler) AddCustomerTime(id int64, customerId int64, startTime time.Time, endTime time.Time) bool {
	_, err := h.timeRepo.AddTime(id, customerId, startTime, endTime)
	if err != nil {
		panic(err)
	}
	return true
}

func (h *CustomerHandler) DeleteTime(id int64) {
	err := h.timeRepo.DeleteTime(id)
	if err != nil {
		panic(err)
	}
}

func (h *CustomerHandler) UpdateCustomerTimeComment(id int64, comment string) {
	err := h.timeRepo.UpdateTimeComment(id, comment)
	if err != nil {
		panic(err)
	}
}

func (h *CustomerHandler) UpdateCustomerTimeStartTime(id int64, startTime string) {
	re := regexp.MustCompile(`\s\(.*\)$`)
	startTime = re.ReplaceAllString(startTime, "")
	t, err := time.Parse("Mon Jan 2 2006 15:04:05 GMT-0700", startTime)
	if err != nil {
		panic(err)
	}
	err = h.timeRepo.UpdateTimeStartTime(id, t.UTC())
	if err != nil {
		panic(err)
	}
}

func (h *CustomerHandler) UpdateCustomerTimeEndTime(id int64, endTime string) {
	re := regexp.MustCompile(`\s\(.*\)$`)
	endTime = re.ReplaceAllString(endTime, "")
	t, err := time.Parse("Mon Jan 2 2006 15:04:05 GMT-0700", endTime)
	if err != nil {
		panic(err)
	}
	err = h.timeRepo.UpdateTimeEndTime(id, t.UTC())
	if err != nil {
		panic(err)
	}
}

func (h *CustomerHandler) GetCustomerTimes(customerId int64) []entities.TrackedTime {
	times, err := h.timeRepo.GetTimesForCustomer(customerId)
	if err != nil {
		panic(err)
	}
	fmt.Println("Customer times:", times)
	return times
}

func (h *CustomerHandler) AddCustomer(name string) bool {
	_, err := h.customerRepo.AddCustomer(name)
	if err != nil {
		return false
	}
	return true
}

func (h *CustomerHandler) DeleteCustomer(id int64) bool {
	err := h.customerRepo.DeleteCustomer(id)
	if err != nil {
		return false
	}
	return true
}

func (h *CustomerHandler) ExportCustomer(customerId int64) {
	name, err := h.customerRepo.GetCustomerName(customerId)
	if err != nil {
		panic(err)
	}
	times, err := h.timeRepo.GetTimesForCustomer(customerId)
	if err != nil {
		panic(err)
	}
	fmt.Println("Found", len(times), "customers for export")
	filename := fmt.Sprintf("export_customer_%v.csv", name)
	appName := "timeTracker"
	configDir, err := os.UserConfigDir()
	if err != nil {
		panic(err)
	}
	filePath := filepath.Join(configDir, appName, filename)
	fmt.Println("Filepath to install to:", filePath)
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println(err)
		panic("failed to create file")
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	fmt.Println("created writer")

	type TimeEntry struct {
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
		Duration  string `json:"duration"`
		Comment   string `json:"comment"`
	}

	header := []string{"Start Zeit", "End Zeit", "Dauer", "Comment"}
	if err := writer.Write(header); err != nil {
		panic(err)
	}

	fmt.Println("header written")
	const myTimeLayout = "02.01.2006 15:04"

	for _, t := range times {
		startTime, err := time.Parse(time.RFC3339Nano, t.StartTime)
		if err != nil {
			panic(err)
		}
		endTime, err := time.Parse(time.RFC3339Nano, t.EndTime)
		if err != nil {
			panic(err)
		}
		duration := endTime.Sub(startTime)
		if duration.Minutes() < 1 {
			continue
		}
		minutes := int(duration.Minutes())
		hours := 0
		if minutes > 60 {
			hours = minutes / 60
			minutes = minutes % 60
		}
		entry := []string{
			startTime.Local().Format(myTimeLayout),
			endTime.Local().Format(myTimeLayout),
			fmt.Sprintf("%02d:%02d", hours, minutes),
			t.Comment,
		}
		fmt.Println("writing entry", entry)
		if err := writer.Write(entry); err != nil {
			panic(err)
		}
	}
}
