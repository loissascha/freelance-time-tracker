package customerhandler

import (
	"context"
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

func (h *CustomerHandler) GetCustomerTimes(customerId int64) []entities.TrackedTime {
	times, err := h.timeRepo.GetTimesForCustomer(customerId)
	if err != nil {
		panic(err)
	}
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
