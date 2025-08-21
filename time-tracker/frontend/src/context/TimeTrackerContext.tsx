import { createContext, useContext, useState } from "react"
import { Outlet } from "react-router"
import { useCustomer } from "./CustomerContext"

interface TimeTrackerContextType {
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
    const { customers } = useCustomer()
    const [loading, setLoading] = useState(true)

    return (
        <TimeTrackerContext.Provider value={{}}>
            {loading ? <></> : <Outlet />}
        </TimeTrackerContext.Provider>
    )
}
