import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';

const BarcodeScannerComponent = ({ onScan, onClose, title = "Scan Barcode" }) => {
    const scannerRef = useRef(null);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        // Create scanner instance
        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 100 },
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                rememberLastUsedCamera: true
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                // Success callback
                scanner.clear();
                onScan(decodedText);
            },
            (error) => {
                // We ignore scan errors because it errors on every frame it doesn't detect a barcode
            }
        );

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                        <Camera size={18} className="text-indigo-600" />
                        <h3 className="font-bold text-slate-800 text-sm m-0">{title}</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-4 bg-slate-900">
                    <div id="reader" className="w-full overflow-hidden rounded-lg bg-black scanner-container"></div>
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs font-medium text-slate-500 m-0">Align the barcode within the frame to scan.</p>
                </div>
            </div>
            <style>{`
                /* Hide HTML5-QRCode extraneous elements to make it look native */
                #reader__dashboard_section_csr span { color: white !important; font-size: 12px; }
                #reader__dashboard_section_swaplink { color: #818cf8 !important; }
                #reader button { 
                    background: #4f46e5; color: white; border: none; 
                    padding: 6px 12px; border-radius: 6px; font-weight: bold; 
                    font-size: 12px; cursor: pointer; margin-top: 8px;
                }
                #reader a { display: none; }
            `}</style>
        </div>
    );
};

export default BarcodeScannerComponent;
