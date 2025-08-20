import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { GetCustomers } from "../../wailsjs/go/customerhandler/CustomerHandler"

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
    const [customers, setCustomers] = useState<Customer[]>([])
    // const customers = [
    //     { label: 'Client A', value: 1 },
    //     { label: 'Client B', value: 2 },
    //     { label: 'Client C', value: 3 },
    // ]

    useEffect(() => {
        async function fetchData() {
            const newCustomers: Customer[] = []
            const res = await GetCustomers()
            for (var c of res) {
                newCustomers.push({ label: c.name, value: c.id })
            }
            setCustomers(newCustomers)
        }
        fetchData()
    }, [])

    async function reloadCustomers() {

    }

    return (
        <CustomerContext.Provider value={{ customers: customers, reloadCustomers: reloadCustomers }}>
            <Outlet />
        </CustomerContext.Provider>
    )
}
