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
                    Back
                </Link>
            </header>
        </>
    )
}
