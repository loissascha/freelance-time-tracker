import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { GetCustomers, AddCustomer, DeleteCustomer } from "../../wailsjs/go/customerhandler/CustomerHandler"

interface Customer {
    label: string
    value: number
}

interface AuthContextType {
    customers: Customer[]
    reloadCustomers: () => Promise<void>
    addCustomer: (name: string) => Promise<void>
    deleteCustomer: (id: number) => Promise<void>
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
    const [loading, setLoading] = useState(true)

    async function fetchData() {
        setLoading(true)
        const newCustomers: Customer[] = []
        const res = await GetCustomers()
        for (var c of res) {
            newCustomers.push({ label: c.name, value: c.id })
        }
        setCustomers(newCustomers)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    async function reloadCustomers() {
        await fetchData()
    }

    async function addCustomer(name: string) {
        const success = await AddCustomer(name)
        if (!success) {
            alert("Adding customer failed! Please check logs.")
        }
        await reloadCustomers()
    }

    async function deleteCustomer(id: number) {
        const success = await DeleteCustomer(id)
        if (!success) {
            alert("Deleting customer failed! Please check logs.")
        }
        await reloadCustomers()
    }

    return (
        <CustomerContext.Provider value={{ customers: customers, reloadCustomers: reloadCustomers, addCustomer: addCustomer, deleteCustomer: deleteCustomer }}>
            {loading ? <></> : <Outlet />}
        </CustomerContext.Provider>
    )
}
