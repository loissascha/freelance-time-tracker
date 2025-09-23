import { Link, useParams } from "react-router";
import { ExportCustomer } from "../../wailsjs/go/customerhandler/CustomerHandler";
import { MainButton } from "../components/Button";
import { useState } from "react";

export default function () {
    let { id } = useParams()
    const [fromTime, setFromTime] = useState("")
    const [untilTime, setUntilTime] = useState("")

    async function exportButton() {
        if (!id) return
        await ExportCustomer(+id, fromTime, untilTime)
        alert("Export erfolgreich!")
    }

    return (
        <>
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-100">Export Customer {id}</h1>
                    <p className="text-gray-400">Export the customer data.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/manage-customers" className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded">
                        Manage Customers
                    </Link>
                    <Link to="/" className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded">
                        Time Tracker
                    </Link>
                </div>
            </header>
            <main>
                <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                    <label>From: </label>
                    <input type="datetime-local" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
                </div>
                <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                    <label>Until: </label>
                    <input type="datetime-local" value={untilTime} onChange={(e) => setUntilTime(e.target.value)} />
                </div>
                <MainButton onClick={() => exportButton()}>Export</MainButton>
            </main>
        </>
    )
}
