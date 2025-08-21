import { createContext, useContext, useEffect, useState } from "react"
import { Outlet } from "react-router"
import { useCustomer } from "./CustomerContext"
import { GetCustomerTimes } from "../../wailsjs/go/customerhandler/CustomerHandler"

interface TimeEntry {
    id: number;
    customerId: number;
    startTime: Date;
    endTime: Date | null;
    comment: string;
}

interface TimeTrackerContextType {
    timeEntries: TimeEntry[]
    elapsedTime: number
    isTracking: boolean
    startTracking: () => void
    stopTracking: () => void
    changeComment: (id: number, comment: string) => void
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
    const [isTracking, setIsTracking] = useState(false);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer: number;
        if (isTracking && activeEntry) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((new Date().getTime() - activeEntry.startTime.getTime()) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTracking, activeEntry]);

    function handleStartTracking() {
        if (!selectedCustomer) {
            alert('Please select a customer first.');
            return;
        }
        const newEntry: TimeEntry = {
            id: Date.now(),
            customerId: selectedCustomer,
            startTime: new Date(),
            endTime: null,
            comment: '',
        };
        setActiveEntry(newEntry);
        setIsTracking(true);
    };

    function handleStopTracking() {
        if (activeEntry) {
            const now = new Date();
            const updatedEntry = { ...activeEntry, endTime: now };
            // TODO: create entry in database!
            setTimeEntries(prevEntries => [updatedEntry, ...prevEntries]);
            setIsTracking(false);
            setActiveEntry(null);
            setElapsedTime(0);
        }
    };

    const handleCommentChange = (id: number, comment: string) => {
        setTimeEntries(prevEntries =>
            prevEntries.map(entry => (entry.id === id ? { ...entry, comment } : entry))
        );
    };

    async function fetchData() {
        setLoading(true)
        if (selectedCustomer == null) {
            setTimeEntries([])
            setLoading(false)
            return
        }
        const entries = await GetCustomerTimes(selectedCustomer)
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
        <TimeTrackerContext.Provider value={{ timeEntries: timeEntries, elapsedTime, isTracking, startTracking: handleStartTracking, stopTracking: handleStopTracking, changeComment: handleCommentChange }}>
            {loading ? <></> : <Outlet />}
        </TimeTrackerContext.Provider>
    )
}
