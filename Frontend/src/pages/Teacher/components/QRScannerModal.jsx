import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const [scanError, setScanError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        const scanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        const onScan = (decodedText) => {
            scanner.clear();
            onScanSuccess(decodedText);
        };

        const onError = (err) => {
            // we ignore regular scanning errors since it scans continuously
        };

        scanner.render(onScan, onError);

        return () => {
            scanner.clear().catch(e => console.error("Failed to clear scanner", e));
        };
    }, [isOpen, onScanSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Camera size={20} className="text-blue-600" /> 
                        Scan Attendance QR
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
                    <div id="reader" className="w-full border-none rounded-xl overflow-hidden shadow-inner"></div>
                    <p className="text-sm text-slate-500 mt-4 text-center">
                        Align the Principal's daily QR code within the frame to mark your attendance.
                    </p>
                    {scanError && <p className="text-rose-500 text-sm mt-2 font-medium">{scanError}</p>}
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
