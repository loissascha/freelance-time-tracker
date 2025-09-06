import { Outlet } from "react-router";

export default function () {
    return (
        <div className="bg-neutral-900 text-white min-h-screen font-sans p-8">
            <div className="max-w-4xl mx-auto">
                <Outlet />
            </div>
        </div>
    )
}
