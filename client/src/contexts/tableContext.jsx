import React, { createContext, useContext, useState, useEffect } from 'react';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const [tableNumber, setTableNumber] = useState(null);

    useEffect(() => {
        // Grabs ?table=X from the URL
        const params = new URLSearchParams(window.location.search);
        const table = params.get('table');

        if (table) {
            setTableNumber(table);
            localStorage.setItem('tableId', table); // Saves it even if page refreshes
        } else {
            const savedTable = localStorage.getItem('tableId');
            if (savedTable) setTableNumber(savedTable);
        }
    }, []);

    return (
        <TableContext.Provider value={{ tableNumber }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => useContext(TableContext);