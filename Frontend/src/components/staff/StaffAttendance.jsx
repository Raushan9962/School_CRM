import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Calendar as CalendarIcon, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import apiFetch from '../../services/api';

const StaffAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState(null);
    const [qrValue, setQrValue] = useState('');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    // Get user details from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchAttendance();

        const generateQR = () => {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
            setQrValue(JSON.stringify({ 
                userId: currentUser.id, 
                role: currentUser.role || 'Staff', 
                type: 'STAFF_ID',
                expiresAt 
            }));
            setTimeLeft(15 * 60);
        };

        generateQR();
        
        // Timer for countdown
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    generateQR(); // Regenerate when it reaches 0
                    return 15 * 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/staff/attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAttendance(data.data);
            }
        } catch (err) {
            console.error('Error fetching attendance', err);
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async () => {
        try {
            setStatusMsg(null);
            const token = localStorage.getItem('token');
            const res = await apiFetch('/staff/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStatusMsg({ type: 'success', text: data.message });
                fetchAttendance(); // Refresh list
            } else {
                setStatusMsg({ type: 'error', text: data.message || 'Failed to mark attendance' });
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Server error while marking attendance' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">My Attendance & ID Card</h2>
                        <p className="text-sm text-slate-500 m-0">Mark daily attendance and view your staff ID</p>
                    </div>
                </div>
            </div>

            {statusMsg && (
                <div className={`p-4 rounded-lg text-sm font-bold flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <CheckCircle2 size={18} /> {statusMsg.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ID Card & QR Code */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden sticky top-6">
                        <div className="h-20 bg-slate-800"></div>
                        <div className="px-6 pb-6 pt-0 flex flex-col items-center">
                            <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md -mt-10 mb-3 flex items-center justify-center">
                                <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-2xl">
                                    {user.name ? user.name.charAt(0) : 'L'}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 m-0">{user.name || 'Staff Member'}</h3>
                            <p className="text-sm text-slate-500 font-medium">{user.role || 'Staff'} • {user.email}</p>
                            
                            <div className="mt-6 p-4 bg-white border border-slate-200 rounded-md relative">
                                {qrValue && <QRCode value={qrValue} size={150} />}
                            </div>
                            <div className="mt-3 text-center">
                                <p className="text-xs text-slate-500 m-0">Scan at the entry gate to mark attendance</p>
                                <p className="text-[11px] font-bold text-slate-400 mt-1">
                                    QR valid for: <span className="text-slate-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                </p>
                            </div>

                            <button onClick={markAttendance} className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-bold flex items-center justify-center gap-2 transition-colors text-sm">
                                <UserCheck size={16} /> Mark Attendance Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance History */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-md shadow-sm border border-slate-200">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-800 m-0">Recent Attendance Records (Up to 5 Years)</h3>
                            <div className="text-xs text-slate-500 font-medium">Total: {attendance.length} days</div>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase">Time/Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="3" className="p-6 text-center text-slate-400">Loading...</td></tr>
                                    ) : attendance.length === 0 ? (
                                        <tr><td colSpan="3" className="p-6 text-center text-slate-400">No attendance records found.</td></tr>
                                    ) : (
                                        attendance.map((record, index) => (
                                            <tr key={index} className="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                                <td className="px-5 py-3.5 font-semibold text-slate-700 text-sm">
                                                    {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded border ${record.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-slate-500 flex items-center gap-1.5">
                                                    <Clock size={14} className="text-slate-400"/>
                                                    {record.remarks || 'Standard Time'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAttendance;
