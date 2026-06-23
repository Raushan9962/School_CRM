import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
                scannerRef.current = null;
            }
            return;
        }

        const onScan = (decodedText, decodedResult) => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
                scannerRef.current = null;
            }
            onScanSuccess(decodedText);
        };

        const onScanFailure = (error) => {
            // handle scan failure, usually better to ignore and keep scanning
        };

        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        scannerRef.current.render(onScan, onScanFailure);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, [isOpen, onScanSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-lg text-slate-800 m-0">Scan Attendance QR</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors cursor-pointer border-none bg-transparent">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-6">
                    <div id="reader" className="w-full"></div>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Align the QR code within the frame to scan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
