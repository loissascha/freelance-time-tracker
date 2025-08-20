package customerhandler

import (
	"context"
	"fmt"
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

// Greet returns a greeting for the given name
func (a *CustomerHandler) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
