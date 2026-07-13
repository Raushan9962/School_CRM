import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { X, ScanLine, UserCheck, BookOpen, AlertTriangle, ArrowRight, BookCheck, CheckCircle2 } from 'lucide-react';
import apiFetch from '../../../services/api';

const QuickIssueModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Scan ID, 2: Member Profile, 3: Scan Book
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Scan ID Logic
    useEffect(() => {
        if (!isOpen) return;

        let scanner = null;
        if (step === 1 || step === 3) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    // Stop scanning on success
                    if (scanner) {
                        scanner.clear();
                    }
                    if (step === 1) {
                        handleIdScanned(decodedText);
                    } else if (step === 3) {
                        handleBookScanned(decodedText);
                    }
                },
                (errorMessage) => {
                    // Ignore continuous scan errors
                }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [isOpen, step]);

    const handleIdScanned = async (text) => {
        setLoading(true);
        setError(null);
        try {
            // Parse QR value if JSON (from Staff ID) or use direct string (barcode/Admission no)
            let query = text;
            try {
                const parsed = JSON.parse(text);
                if (parsed.userId) query = parsed.userId.toString();
            } catch (e) {
                // Not JSON, use raw text
            }

            const token = localStorage.getItem('token');
            const res = await apiFetch(`/librarian/search-member?query=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setMember(data.data);
                setStep(2); // Go to Profile
            } else {
                setError(data.message || 'Member not found');
                setStep(1); // Stay on step 1 to try again
            }
        } catch (err) {
            setError('Failed to process ID. Please try again.');
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    const handleBookScanned = async (barcode) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/librarian/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: member.user_id, barcode })
            });
            const data = await res.json();

            if (data.success) {
                setSuccessMsg(`Book Issued: ${data.data?.title || 'Successfully'}. Due on ${data.dueDate}`);
                
                // Refresh member details to update active issues list
                handleIdScanned(member.user_id.toString());
                
                // Go back to profile view after 2.5 seconds
                setTimeout(() => {
                    setSuccessMsg(null);
                    setStep(2);
                }, 2500);
            } else {
                setError(data.message || 'Failed to issue book');
                setStep(2); // Go back to profile on error
            }
        } catch (err) {
            setError('Network error. Failed to issue book.');
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setMember(null);
        setError(null);
        setSuccessMsg(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
            <div className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">
                        {step === 1 && <><ScanLine size={20} className="text-slate-600"/> Scan Member ID</>}
                        {step === 2 && <><UserCheck size={20} className="text-slate-600"/> Member Profile</>}
                        {step === 3 && <><BookOpen size={20} className="text-slate-600"/> Scan Book Barcode</>}
                    </h2>
                    <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Step 1: Scan Member ID */}
                    {step === 1 && (
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-slate-500 mb-4 text-center">Place the Student or Staff ID Card (QR code) in front of the camera.</p>
                            
                            {error && (
                                <div className="w-full mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded flex items-center gap-2 text-sm font-semibold">
                                    <AlertTriangle size={16} /> {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="p-10 text-slate-500 font-medium text-sm">Processing ID...</div>
                            ) : (
                                <div className="w-full max-w-sm rounded overflow-hidden border border-slate-200 shadow-sm" id="reader"></div>
                            )}
                            
                            <div className="mt-6 w-full max-w-sm">
                                <p className="text-xs font-bold text-slate-400 uppercase text-center mb-2">Or enter ID manually</p>
                                <input 
                                    type="text" 
                                    placeholder="Enter Admission No / Employee ID"
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-slate-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleIdScanned(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Member Profile */}
                    {step === 2 && member && (
                        <div className="animate-in fade-in duration-300">
                            {successMsg && (
                                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-2 text-sm font-bold shadow-sm">
                                    <CheckCircle2 size={18} /> {successMsg}
                                </div>
                            )}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded flex items-center gap-2 text-sm font-bold shadow-sm">
                                    <AlertTriangle size={18} /> {error}
                                </div>
                            )}

                            <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-md mb-6">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xl border border-slate-300">
                                    {member.name ? member.name.charAt(0) : 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 m-0">{member.name}</h3>
                                    <p className="text-sm font-medium text-slate-500 m-0">
                                        {member.role === 'Student' ? `Class: ${member.class_name} ${member.section || ''}` : `${member.role} • ${member.department || 'Staff'}`}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">ID: {member.admission_no || member.employee_id || member.user_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide m-0">Pending Fines</p>
                                    <p className={`text-lg font-bold m-0 ${member.pendingFine > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        ₹ {member.pendingFine || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-slate-800 m-0">Active Issued Books ({member.activeIssues?.length || 0})</h4>
                                <button 
                                    onClick={() => setStep(3)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
                                >
                                    <ScanLine size={16} /> Scan Book to Issue
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 py-2.5 font-bold text-slate-500 uppercase text-xs">Book Title</th>
                                            <th className="px-4 py-2.5 font-bold text-slate-500 uppercase text-xs">Barcode</th>
                                            <th className="px-4 py-2.5 font-bold text-slate-500 uppercase text-xs">Issued On</th>
                                            <th className="px-4 py-2.5 font-bold text-slate-500 uppercase text-xs">Due On</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {member.activeIssues && member.activeIssues.length > 0 ? (
                                            member.activeIssues.map((issue) => {
                                                const isOverdue = new Date(issue.due_on) < new Date();
                                                return (
                                                    <tr key={issue.id} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 font-semibold text-slate-700">{issue.title}</td>
                                                        <td className="px-4 py-3 text-slate-500">{issue.barcode}</td>
                                                        <td className="px-4 py-3 text-slate-500">{new Date(issue.issued_on).toLocaleDateString('en-IN')}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${isOverdue ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                                {new Date(issue.due_on).toLocaleDateString('en-IN')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-slate-400 font-medium">No active issued books.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Scan Book */}
                    {step === 3 && (
                        <div className="flex flex-col items-center">
                            <button onClick={() => setStep(2)} className="self-start mb-4 text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                                <ArrowRight className="rotate-180" size={16}/> Back to Profile
                            </button>

                            <p className="text-sm text-slate-500 mb-4 text-center">Place the Book Barcode in front of the camera to issue it to <b>{member?.name}</b>.</p>
                            
                            {loading ? (
                                <div className="p-10 text-slate-500 font-medium text-sm">Processing Book...</div>
                            ) : (
                                <div className="w-full max-w-sm rounded overflow-hidden border border-slate-200 shadow-sm" id="reader"></div>
                            )}

                            <div className="mt-6 w-full max-w-sm">
                                <p className="text-xs font-bold text-slate-400 uppercase text-center mb-2">Or enter Book Barcode</p>
                                <input 
                                    type="text" 
                                    placeholder="Enter Book Barcode"
                                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-slate-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleBookScanned(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickIssueModal;
