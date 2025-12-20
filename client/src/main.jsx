import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './contexts/CartContext'
import { TableProvider } from './contexts/TableContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TableProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </TableProvider>
    </React.StrictMode>,
)