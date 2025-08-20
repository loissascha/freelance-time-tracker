import { Link } from "react-router";

export default function () {
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
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold mb-4">New Customer</h2>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold mb-4">Customers</h2>
                </div>
            </main>
        </>
    )
}
