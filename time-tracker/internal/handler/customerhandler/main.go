package customerhandler

import (
	"context"
	"time-tracker/internal/entities"
	"time-tracker/internal/repositories/customerrepository"
)

// CustomerHandler struct
type CustomerHandler struct {
	Ctx          context.Context
	customerRepo *customerrepository.CustomerRepository
}

// NewApp creates a new App application struct
func NewCustomerHandler(customerRepo *customerrepository.CustomerRepository) *CustomerHandler {
	return &CustomerHandler{
		customerRepo: customerRepo,
	}
}

func (h *CustomerHandler) GetCustomers() []entities.Customer {
	customers, err := h.customerRepo.ListCustomers()
	if err != nil {
		panic(err)
	}
	return customers
}

func (h *CustomerHandler) AddCustomer(name string) bool {
	_, err := h.customerRepo.AddCustomer(name)
	if err != nil {
		return false
	}
	return true
}
