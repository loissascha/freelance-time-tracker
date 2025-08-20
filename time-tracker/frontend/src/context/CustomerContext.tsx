import { createContext, useContext } from "react";
import { Outlet } from "react-router";

interface Customer {
    label: string
    value: number
}

interface AuthContextType {
    customers: Customer[]
    reloadCustomers: () => Promise<void>
}

const CustomerContext = createContext<AuthContextType | null>(null)

export function useCustomer() {
    const context = useContext(CustomerContext)
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerContextProvider')
    }
    return context;
}

export function CustomerProvider() {
    const customers = [
        { label: 'Client A', value: 1 },
        { label: 'Client B', value: 2 },
        { label: 'Client C', value: 3 },
    ]

    async function reloadCustomers() {

    }

    return (
        <CustomerContext.Provider value={{ customers: customers, reloadCustomers: reloadCustomers }}>
            <Outlet />
        </CustomerContext.Provider>
    )
}
