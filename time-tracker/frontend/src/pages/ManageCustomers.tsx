import { Link } from "react-router";
import { MainButton } from "../components/Button";
import { TextInput } from "../components/Input";
import { useState } from "react";

export default function () {
    const [newCustomerName, setNewCustomerName] = useState("")

    async function addCustomerForm(e: any) {
        e.preventDefault()
    }

    return (
        <>
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-100">Manage Customers</h1>
                    <p className="text-gray-400">Manage customers.</p>
                </div>
                <Link to="/" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    Time Tracker
                </Link>
            </header>

            <main>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">New Customer</h2>
                    <form onSubmit={addCustomerForm} className="flex flex-col gap-2">
                        <label htmlFor="name" className="cursor-pointer text-sm font-semibold">Name</label>
                        <TextInput id="name" placeholder="Jon Doe" value={newCustomerName} onChange={setNewCustomerName} />
                        <div className="flex justify-end">
                            <MainButton>Add</MainButton>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Customers</h2>
                </div>
            </main>
        </>
    )
}
