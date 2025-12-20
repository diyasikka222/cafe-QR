import React from 'react';
import { Link } from 'react-router-dom';

const Confirmation = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
                ✓
            </div>
            <h1 className="text-3xl font-black mb-2">Order Received!</h1>
            <p className="text-gray-500 mb-8">
                Your food is being prepared. Please relax while we bring it to your table.
            </p>
            <Link
                to="/menu"
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200"
            >
                Order More Items
            </Link>
        </div>
    );
};

export default Confirmation;