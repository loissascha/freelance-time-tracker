import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useTimeTracker } from "../context/TimeTrackerContext"
import { MainButton } from "../components/Button"

export default function () {
    let { id } = useParams()
    const { timeEntries, changeComment, saveComment, reloadTimeEntries, saveStartTime, saveEndTime } = useTimeTracker()
    const [endTime, setEndTime] = useState<string | null>(null)
    const [startTime, setStartTime] = useState<string | null>(null)
    const [comment, setComment] = useState<string>("")
    const [startTimeChanged, setStartTimeChanged] = useState(false)
    const [endTimeChanged, setEndTimeChanged] = useState(false)
    const [commentChanged, setCommentChanged] = useState(false)

    useEffect(() => {
        for (var entry of timeEntries) {
            if ("" + entry.id == id) {
                setStartTime(entry.startTime.toString())
                if (entry.endTime != null) {
                    setEndTime(entry.endTime?.toString())
                }
                setComment(entry.comment)
            }
        }
    }, [id, timeEntries])

    return (
        <>
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-100">Edit Element</h1>
                    <p className="text-gray-400">Edit the time entry.</p>
                </div>
                <Link to="/" className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded">
                    Time Tracker
                </Link>
            </header>

            <main>
                <div className="flex flex-col gap-2 my-4">
                    <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-xl">Start Time</label>
                            <textarea className="mt-2 h-28 p-2 rounded-lg bg-neutral-700" value={comment} onChange={(event) => {
                                setComment(event.target.value)
                                setCommentChanged(true)
                            }} />
                            {commentChanged ? (
                                <div className="mt-2">
                                    <MainButton onClick={() => {
                                        if (id) {
                                            changeComment(+id, comment)
                                            saveComment(+id)
                                            setCommentChanged(false)
                                        }
                                    }}>Save</MainButton>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                        {startTime != null ? (
                            <div className="flex flex-col">
                                <label className="font-bold text-xl">Start Time</label>
                                <div className="flex gap-2">
                                    <input className="grow py-3 px-4 rounded-md bg-neutral-700" type="text" value={startTime} onChange={(event) => {
                                        setStartTime(event.target.value)
                                        if (id) {
                                            // changeStartTime(+id, startTime)
                                            setStartTimeChanged(true)
                                        }
                                    }} />
                                    {startTimeChanged ? (
                                        <MainButton onClick={() => {
                                            if (id) {
                                                saveStartTime(+id, startTime).then(() => {
                                                    setStartTimeChanged(false)
                                                    reloadTimeEntries()
                                                })
                                            }
                                        }}>Save</MainButton>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                        {endTime != null ? (
                            <div className="flex flex-col">
                                <label className="font-bold text-xl">End Time</label>
                                <div className="flex gap-2">
                                    <input className="grow p-2 rounded-md bg-neutral-700" type="text" value={endTime} onChange={(event) => {
                                        setEndTime(event.target.value)
                                        if (id) {
                                            // changeEndTime(+id, endTime)
                                            setEndTimeChanged(true)
                                        }
                                    }} />
                                    {endTimeChanged ? (
                                        <MainButton onClick={() => {
                                            if (id) {
                                                saveEndTime(+id, endTime).then(() => {
                                                    setEndTimeChanged(false)
                                                    reloadTimeEntries()
                                                })
                                            }
                                        }}>Save</MainButton>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </>
    )
}
