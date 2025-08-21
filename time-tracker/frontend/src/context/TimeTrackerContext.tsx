import { createContext, useContext, useEffect, useState } from "react"
import { Outlet } from "react-router"
import { useCustomer } from "./CustomerContext"
import { GetCustomerTimes } from "../../wailsjs/go/customerhandler/CustomerHandler"

interface TimeEntry {
    id: number;
    customerName: string;
    startTime: Date;
    endTime: Date | null;
    comment: string;
}

interface TimeTrackerContextType {
    timeEntries: TimeEntry[]
}

const TimeTrackerContext = createContext<TimeTrackerContextType | null>(null)

export function useTimeTracker() {
    const context = useContext(TimeTrackerContext)
    if (!context) {
        throw new Error('useTimeTracker must be used within a TimeTrackerContextProvider')
    }
    return context;
}

export function TimeTrackerProvider() {
    const { selectedCustomer } = useCustomer()
    const [loading, setLoading] = useState(true)
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

    async function fetchData() {
        setLoading(true)
        if (selectedCustomer == null) {
            setTimeEntries([])
            setLoading(false)
            return
        }
        const entries = await GetCustomerTimes(selectedCustomer)
        console.log("entries:", entries)
        const newEntries: TimeEntry[] = []
        if (entries) {
            for (const entry of entries) {
                console.log(entry)
            }
        }
        setTimeEntries(newEntries)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [selectedCustomer])

    return (
        <TimeTrackerContext.Provider value={{ timeEntries: timeEntries }}>
            {loading ? <></> : <Outlet />}
        </TimeTrackerContext.Provider>
    )
}
