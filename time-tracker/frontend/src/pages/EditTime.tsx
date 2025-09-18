import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useTimeTracker } from "../context/TimeTrackerContext"

export default function () {
    let { id } = useParams()
    const { timeEntries, changeComment, saveComment, reloadTimeEntries } = useTimeTracker()
    const [endTime, setEndTime] = useState<string | null>(null)
    const [startTime, setStartTime] = useState<string | null>(null)

    useEffect(() => {
        console.log("getting entry for", id)
        for (var entry of timeEntries) {
            if ("" + entry.id == id) {
                console.log("found entry", entry)
                setStartTime(entry.startTime.toString())
                if (entry.endTime != null) {
                    setEndTime(entry.endTime?.toString())
                }
            }
        }
    }, [id, timeEntries])

    return (
        <>
            <h1>Edit Time {id}</h1>
            <div className="flex flex-col gap-2 my-4">
                {startTime != null ? (
                    <div className="flex flex-col">
                        <label>Start Time</label>
                        <input type="text" value={startTime} />
                    </div>
                ) : null}
                {endTime != null ? (
                    <div className="flex flex-col">
                        <label>End Time</label>
                        <input type="text" value={endTime} />
                    </div>
                ) : null}
            </div>
        </>
    )
}
