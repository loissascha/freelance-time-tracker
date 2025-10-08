import { createContext, useContext, useEffect, useState } from "react"
import { Outlet } from "react-router"
import { useCustomer } from "./CustomerContext"
import { GetCustomerTimes, AddCustomerTime, UpdateCustomerTimeComment, UpdateCustomerTimeStartTime, UpdateCustomerTimeEndTime } from "../../wailsjs/go/customerhandler/CustomerHandler"
import { a0 } from "react-router/dist/development/index-react-server-client-BQ6FxdA_";

interface TimeEntry {
    id: number;
    customerId: number;
    startTime: Date;
    endTime: Date | null;
    elapsedTimeSeconds: number | null;
    comment: string;
    hasCommentUpdate: boolean
    hasStartTimeUpdate: boolean
    hasEndTimeUpdate: boolean
}

interface TimeTrackerContextType {
    timeEntries: TimeEntry[]
    elapsedTime: number
    overallTimeInSeconds: number
    weeklyTimeInSeconds: number
    monthlyTimeInSeconds: number
    isTracking: boolean
    startTracking: () => void
    stopTracking: () => Promise<void>
    changeComment: (id: number, comment: string) => void
    changeStartTime: (id: number, startTime: string) => void
    changeEndTime: (id: number, endTime: string) => void
    saveComment: (id: number) => Promise<void>
    saveStartTime: (id: number, newTime: string) => Promise<void>
    saveEndTime: (id: number, newTime: string) => Promise<void>
    reloadTimeEntries: () => Promise<void>
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
    const [overallTimeInSeconds, setOverallTimeInSeconds] = useState(0)
    const [overallTimeThisWeek, setOverallTimeThisWeek] = useState(0)
    const [overallTimeThisMonth, setOverallTimeThisMonth] = useState(0)

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
            elapsedTimeSeconds: null,
            hasCommentUpdate: false,
            hasStartTimeUpdate: false,
            hasEndTimeUpdate: false
        };
        setActiveEntry(newEntry);
        setIsTracking(true);
    };

    async function handleStopTracking() {
        if (activeEntry) {
            const now = new Date();
            const updatedEntry = { ...activeEntry, endTime: now };
            // TODO: create entry in database!
            await AddCustomerTime(updatedEntry.id, updatedEntry.customerId, updatedEntry.startTime, updatedEntry.endTime)
            setTimeEntries(prevEntries => [updatedEntry, ...prevEntries]);
            setIsTracking(false);
            setActiveEntry(null);
            setElapsedTime(0);
        }
    };

    function handleCommentChange(id: number, comment: string) {
        setTimeEntries(prevEntries =>
            prevEntries.map(entry => (entry.id === id ? { ...entry, comment, hasCommentUpdate: true } : entry))
        )
    }

    function handleStartTimeChange(id: number, startTime: string) {
        setTimeEntries(prevEntries =>
            prevEntries.map(entry => (entry.id === id ? { ...entry, startTime: new Date(startTime), hasStartTimeUpdate: true } : entry))
        )
    }

    function handleEndTimeChange(id: number, endTime: string) {
        setTimeEntries(prevEntries =>
            prevEntries.map(entry => (entry.id === id ? { ...entry, endTime: new Date(endTime), hasEndTimeUpdate: true } : entry))
        )
    }

    async function saveStartTime(id: number, newTime: string) {
        for (const entry of timeEntries) {
            if (entry.id != id) {
                continue
            }
            await UpdateCustomerTimeStartTime(entry.id, newTime)
        }
        // setTimeEntries(prevEntries =>
        //     prevEntries.map(entry => (entry.id === id ? { ...entry, hasStartTimeUpdate: false } : entry))
        // )
    }

    async function saveEndTime(id: number, newTime: string) {
        for (const entry of timeEntries) {
            if (entry.id != id) {
                continue
            }
            await UpdateCustomerTimeEndTime(entry.id, newTime)
        }
        // setTimeEntries(prevEntries =>
        //     prevEntries.map(entry => (entry.id === id ? { ...entry, hasEndTimeUpdate: false } : entry))
        // )
    }

    async function saveComment(id: number) {
        for (const entry of timeEntries) {
            if (entry.id != id) {
                continue
            }
            await UpdateCustomerTimeComment(entry.id, entry.comment)
        }
        setTimeEntries(prevEntries =>
            prevEntries.map(entry => (entry.id === id ? { ...entry, hasCommentUpdate: false } : entry))
        )
    }

    function getStartOfMonth(date: Date = new Date()): Date {
        const startOfMonth = new Date(date)
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        return startOfMonth
    }

    function getStartOfWeek(date: Date = new Date()): Date {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

        // Calculate the difference to get to the previous Monday
        // If today is Sunday (0), we subtract 6 days. If Monday (1), 0 days, etc.
        const diff = startOfWeek.getDate() - ((day + 6) % 7);

        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek;
    }

    async function fetchData() {
        setLoading(true)
        if (selectedCustomer == null) {
            setTimeEntries([])
            setLoading(false)
            return
        }
        const entries = await GetCustomerTimes(selectedCustomer)
        const newEntries: TimeEntry[] = []
        let newOverallTimeInSeconds = 0
        let newOverallThisWeek = 0
        let newOverallThisMonth = 0
        const startOfMonth = getStartOfMonth()
        const startOfWeek = getStartOfWeek()
        if (entries) {
            for (const entry of entries) {
                const startTime = new Date(entry.startTime)
                const endTime = new Date(entry.endTime)
                const elapsedInMs = endTime.getTime() - startTime.getTime()
                const elapsedInS = elapsedInMs / 1000
                newOverallTimeInSeconds += elapsedInS
                if (startTime >= startOfMonth) {
                    newOverallThisMonth += elapsedInS
                }
                if (startTime >= startOfWeek) {
                    newOverallThisWeek += elapsedInS
                }
                newEntries.push({
                    id: entry.id,
                    customerId: entry.customer_id,
                    comment: entry.comment,
                    startTime: new Date(entry.startTime),
                    endTime: new Date(entry.endTime),
                    elapsedTimeSeconds: elapsedInS,
                    hasCommentUpdate: false,
                    hasStartTimeUpdate: false,
                    hasEndTimeUpdate: false
                })
            }
        }
        setTimeEntries(newEntries)
        setOverallTimeInSeconds(Math.floor(newOverallTimeInSeconds))
        setOverallTimeThisWeek(Math.floor(newOverallThisWeek))
        setOverallTimeThisMonth(Math.floor(newOverallThisMonth))
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [selectedCustomer])

    return (
        <TimeTrackerContext.Provider value={{ weeklyTimeInSeconds: overallTimeThisWeek, monthlyTimeInSeconds: overallTimeThisMonth, overallTimeInSeconds, reloadTimeEntries: fetchData, timeEntries: timeEntries, elapsedTime, isTracking, startTracking: handleStartTracking, stopTracking: handleStopTracking, changeComment: handleCommentChange, saveComment, saveStartTime, saveEndTime, changeStartTime: handleStartTimeChange, changeEndTime: handleEndTimeChange }}>
            {loading ? <></> : <Outlet />}
        </TimeTrackerContext.Provider>
    )
}
