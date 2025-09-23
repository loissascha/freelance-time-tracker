import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './pages/App'
import { HashRouter, Route, Routes } from 'react-router'
import Layout from './layouts/Layout'
import ManageCustomers from './pages/ManageCustomers'
import { CustomerProvider } from './context/CustomerContext'
import { TimeTrackerProvider } from './context/TimeTrackerContext'
import EditTime from './pages/EditTime'
import ExportCustomer from './pages/ExportCustomer'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route element={<CustomerProvider />}>
                    <Route element={<TimeTrackerProvider />}>
                        <Route element={<Layout />}>
                            <Route index path='/' element={<App />} />
                            <Route path='/manage-customers' element={<ManageCustomers />} />
                            <Route path='/edit/time/:id' element={<EditTime />} />
                            <Route path='/export/:id' element={<ExportCustomer />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    </React.StrictMode>
)
