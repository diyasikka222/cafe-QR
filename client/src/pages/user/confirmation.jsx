import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const Confirmation = () => {
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("table") || "05";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#0f1115] text-white">

            {/* Animation Wrapper */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 bg-[#1a1d23] border border-green-500/50 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle2 size={48} className="text-green-500" />
                </div>
            </div>

            <h1 className="text-4xl font-black mb-4 tracking-tight">Order Received!</h1>

            <p className="text-slate-400 mb-12 max-w-xs mx-auto leading-relaxed">
                Your payment was successful. The kitchen has started preparing your food for <span className="text-orange-500 font-bold">Table {tableNumber}</span>.
            </p>

            <Link
                to={`/menu?table=${tableNumber}`}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-xl"
            >
                Order More Items
            </Link>
        </div>
    );
};

export default Confirmation;