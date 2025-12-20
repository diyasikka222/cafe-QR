import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import AdminNavbar from '../../components/admin/adminNavbar';
import { Download, Printer, Copy, CheckCircle2, Info } from 'lucide-react';

const QRGenerator = () => {
    const [tableNumber, setTableNumber] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    // This matches your URL structure: yourcafe.com/menu?table=X
    const baseUrl = window.location.origin; // Dynamically gets your current domain
    const qrValue = `${baseUrl}/menu?table=${tableNumber || '0'}`;

    const downloadQR = () => {
        const svg = document.getElementById("TableQRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white"; // White background for printing
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `Table-${tableNumber}-QR.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrValue);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
            <AdminNavbar />

            <main className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight">QR <span className="text-orange-500">GENERATOR</span></h1>
                    <p className="text-slate-500 font-medium mt-2 italic border-l-2 border-orange-500/30 px-3">Generate unique access codes for your tables</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* INPUT SECTION */}
                    <div className="bg-[#1a1d23] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Enter Table Number</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 05"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="w-full bg-[#0f1115] border border-slate-800 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:border-orange-500 outline-none transition-all placeholder:text-slate-700"
                                />
                            </div>

                            <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                                <div className="flex gap-3 items-start text-orange-400">
                                    <Info size={18} className="shrink-0 mt-1" />
                                    <p className="text-xs font-medium leading-relaxed">
                                        Each QR code is table-specific. When scanned, the customer's orders will automatically be tagged as <span className="font-bold underline text-orange-300 italic">Table {tableNumber || 'X'}</span> in your dashboard.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={downloadQR}
                                    disabled={!tableNumber}
                                    className="w-full bg-white text-black hover:bg-orange-500 hover:text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <Download size={18} /> Download PNG
                                </button>

                                <button
                                    onClick={copyToClipboard}
                                    className="w-full bg-slate-800/50 text-slate-300 hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                                >
                                    {isCopied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                    {isCopied ? "Link Copied" : "Copy Menu Link"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PREVIEW SECTION */}
                    <div className="flex flex-col items-center justify-center bg-[#1a1d23] rounded-[2.5rem] border border-dashed border-slate-800 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-300 opacity-50"></div>

                        <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-orange-500/10 mb-6 group-hover:scale-105 transition-transform duration-500">
                            <QRCodeSVG
                                id="TableQRCode"
                                value={qrValue}
                                size={220}
                                level="H" // High error correction
                                includeMargin={false}
                            />
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">TABLE {tableNumber || "--"}</h3>
                            <p className="text-[10px] font-mono text-slate-500 truncate max-w-[280px]">
                                {qrValue}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                            <Printer size={14} /> Ready for Print
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QRGenerator;