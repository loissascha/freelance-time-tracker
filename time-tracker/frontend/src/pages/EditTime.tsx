import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useTimeTracker } from "../context/TimeTrackerContext"

export default function () {
    let { id } = useParams()
    const { timeEntries, changeComment, saveComment, reloadTimeEntries, changeStartTime, changeEndTime, saveStartTime, saveEndTime } = useTimeTracker()
    const [endTime, setEndTime] = useState<string | null>(null)
    const [startTime, setStartTime] = useState<string | null>(null)
    const [startTimeChanged, setStartTimeChanged] = useState(false)
    const [endTimeChanged, setEndTimeChanged] = useState(false)

    useEffect(() => {
        console.log("getting entry for", id)
        for (var entry of timeEntries) {
            if ("" + entry.id == id) {
                console.log("found entry", entry)
                console.log("Start time:", entry.startTime)
                setStartTime(entry.startTime.toString())
                if (entry.endTime != null) {
                    setEndTime(entry.endTime?.toString())
                }
            }
        }
    }, [id, timeEntries])

    return (
        <>
            <Link to="/" className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded">
                Time Tracker
            </Link>
            <h1>Edit Time {id}</h1>
            <div className="flex flex-col gap-2 my-4">
                {startTime != null ? (
                    <div className="flex flex-col">
                        <label>Start Time</label>
                        <div className="flex gap-1">
                            <input className="grow" type="text" value={startTime} onChange={(event) => {
                                setStartTime(event.target.value)
                                if (id) {
                                    // changeStartTime(+id, startTime)
                                    setStartTimeChanged(true)
                                }
                            }} />
                            {startTimeChanged ? (
                                <button onClick={() => {
                                    if (id) {
                                        saveStartTime(+id, startTime).then(() => {
                                            setStartTimeChanged(false)
                                            reloadTimeEntries()
                                        })
                                    }
                                }}>Save</button>
                            ) : null}
                        </div>
                    </div>
                ) : null}
                {endTime != null ? (
                    <div className="flex flex-col">
                        <label>End Time</label>
                        <div className="flex gap-1">
                            <input className="grow" type="text" value={endTime} onChange={(event) => {
                                setEndTime(event.target.value)
                                if (id) {
                                    // changeEndTime(+id, endTime)
                                    setEndTimeChanged(true)
                                }
                            }} />
                            {endTimeChanged ? (
                                <button onClick={() => {
                                    if (id) {
                                        saveEndTime(+id, endTime).then(() => {
                                            setEndTimeChanged(false)
                                            reloadTimeEntries()
                                        })
                                    }
                                }}>Save</button>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    )
}
