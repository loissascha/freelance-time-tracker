import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './pages/App'
import { HashRouter } from 'react-router'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>
)
