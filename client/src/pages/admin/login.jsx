import React from 'react';

const AdminLogin = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
            <input type="password" placeholder="Enter Admin Pin" className="w-full p-4 border rounded-xl mb-4" />
            <button onClick={() => window.location.href='/admin/dashboard'} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold">
                Login
            </button>
        </div>
    </div>
);

export default AdminLogin;