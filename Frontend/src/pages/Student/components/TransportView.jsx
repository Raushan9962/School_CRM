import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, Bus } from 'lucide-react';
import apiFetch from '../../../services/api';

const TransportView = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const res = await apiFetch(`/buses`);
            if (res.ok) {
                const data = await res.json();
                setBuses(data);
            }
        } catch (error) {
            console.error("Error fetching buses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    const myBus = buses.length > 0 ? buses[0] : null;

    const routeSchedule = [
        { id: 1, time: '07:00 AM', stop: 'School Campus', status: 'Start', isCurrent: false },
        { id: 2, time: '07:15 AM', stop: 'Station Road', status: 'Passed', isCurrent: false },
        { id: 3, time: '07:30 AM', stop: 'Central Park Gate', status: 'Your Stop', isCurrent: true },
        { id: 4, time: '07:45 AM', stop: 'City Mall Junction', status: 'Upcoming', isCurrent: false },
        { id: 5, time: '08:00 AM', stop: 'School Campus', status: 'End', isCurrent: false }
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4 bg-white">
                <div>
                    <h2 className="m-0 text-sm font-bold text-slate-800">Transport & Route Details</h2>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-1.5 bg-blue-600 text-white border-none rounded text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <MapPin size={14} /> Track Bus Live
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading transport data...</div>
            ) : !myBus ? (
                <div className="p-10 text-center text-slate-500 font-medium text-sm">No transport opted or found.</div>
            ) : (
                <div className="flex flex-wrap gap-0">
                    
                    {/* Left Side: Summary & Driver */}
                    <div className="flex-1 basis-[300px] p-6 border-r border-slate-200 flex flex-col gap-6 bg-slate-50/50">
                        
                        {/* Bus Info */}
                        <div>
                            <h3 className="m-0 mb-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold">Assignment</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Bus size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">Bus Number</div>
                                        <div className="text-sm text-slate-800 font-bold">Bus {myBus.id} ({myBus.vehicle_number})</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <Navigation size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">Route Name</div>
                                        <div className="text-sm text-slate-800 font-bold">{myBus.route || 'Main Route'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">Capacity</div>
                                        <div className="text-sm text-slate-800 font-bold">{myBus.capacity} Seats</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 w-full"></div>

                        {/* Driver Info */}
                        <div>
                            <h3 className="m-0 mb-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold">Driver Details</h3>
                            <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col gap-3">
                                <div className="text-sm text-slate-800 font-bold">Assigned Driver ID: <span className="text-blue-600">{myBus.driver_id || 'Pending'}</span></div>
                                <div className="text-xs font-medium text-slate-500">Managed By School Admin</div>
                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                                    <span className="text-xs text-slate-700 font-bold">Contact Office</span>
                                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded cursor-pointer flex items-center gap-1.5 text-xs font-bold hover:bg-blue-100 transition-colors">
                                        <Phone size={14} /> Call
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Side: Route Table */}
                    <div className="flex-[2_1_400px] overflow-x-auto bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-6 py-3 font-bold w-[60px]">Stop</th>
                                    <th className="px-6 py-3 font-bold">Location / Landmark</th>
                                    <th className="px-6 py-3 font-bold">Scheduled Time</th>
                                    <th className="px-6 py-3 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {routeSchedule.map((row, idx) => (
                                    <tr key={idx} className={`border-b border-slate-100 transition-colors ${row.isCurrent ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                                        <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className={`font-bold ${row.isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                                                {row.stop}
                                            </div>
                                            {row.isCurrent && <div className="mt-1"><span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Current Stop</span></div>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-600">{row.time}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold px-2 py-1 rounded text-[10px] uppercase ${
                                                row.status === 'Passed' ? 'bg-slate-100 text-slate-500' : 
                                                (row.status === 'Your Stop' ? 'bg-blue-100 text-blue-700' : 'bg-amber-50 text-amber-600')
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportView;
