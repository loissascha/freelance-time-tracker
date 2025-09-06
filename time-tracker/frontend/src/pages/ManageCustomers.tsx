import { Link } from "react-router";
import { MainButton } from "../components/Button";
import { TextInput } from "../components/Input";
import { useState } from "react";
import { useCustomer } from "../context/CustomerContext";
import BackspaceIcon from "../components/icons/BackspaceIcon";
import ExportIcon from "../components/icons/ExportIcon";

export default function () {
    const { customers, addCustomer, deleteCustomer } = useCustomer()
    const [newCustomerName, setNewCustomerName] = useState("")

    async function addCustomerFormSubmit(e: any) {
        e.preventDefault()
        await addCustomer(newCustomerName)
    }

    async function deleteCustomerButton(id: number) {
        if (confirm("Would you really like to delete this customer?")) {
            await deleteCustomer(id)
        }
    }

    return (
        <>
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-100">Manage Customers</h1>
                    <p className="text-gray-400">Manage customers.</p>
                </div>
                <Link to="/" className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded">
                    Time Tracker
                </Link>
            </header>

            <main>
                <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">New Customer</h2>
                    <form onSubmit={addCustomerFormSubmit} className="flex flex-col gap-1">
                        <label htmlFor="name" className="cursor-pointer text-sm font-semibold">Name</label>
                        <div className="flex gap-4 w-full">
                            <TextInput className="grow" id="name" placeholder="Jon Doe" value={newCustomerName} onChange={setNewCustomerName} />
                            <div className="flex justify-end">
                                <MainButton>Add</MainButton>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="bg-neutral-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Customers</h2>
                    <div className="border border-gray-600 rounded-lg">
                        {customers.map((customer) => (
                            <div className="flex py-2 px-3 border-b border-gray-600 last-of-type:border-b-0 hover:bg-neutral-700">
                                <div className="grow">{customer.label}</div>
                                <div className="flex gap-1">
                                    <ExportIcon />
                                    <button className="cursor-pointer" onClick={() => deleteCustomerButton(customer.value)}>
                                        <BackspaceIcon className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
