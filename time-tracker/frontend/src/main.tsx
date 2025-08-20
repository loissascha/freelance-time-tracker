import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './pages/App'
import { HashRouter, Route, Routes } from 'react-router'
import Layout from './layouts/Layout'
import ManageCustomers from './pages/ManageCustomers'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index path='/' element={<App />} />
                    <Route path='/manage-customers' element={<ManageCustomers />} />
                </Route>
            </Routes>
        </HashRouter>
    </React.StrictMode>
)
