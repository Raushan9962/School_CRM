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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 flex-wrap gap-4">
                <div>
                    <h2 className="m-0 text-sm text-gray-900 font-semibold">Transport & Route Details</h2>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-sky-500 border-none rounded text-white text-sm font-medium cursor-pointer flex items-center gap-1.5 hover:bg-sky-600 transition-colors">
                        <MapPin size={16} /> Track Bus Live
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-10 text-center text-gray-500">Loading transport data...</div>
            ) : !myBus ? (
                <div className="p-10 text-center text-gray-500">No transport opted or found.</div>
            ) : (
                <div className="flex flex-wrap gap-0">
                    
                    {/* Left Side: Summary & Driver */}
                    <div className="flex-1 basis-[300px] p-4 border-r border-slate-200 flex flex-col gap-4">
                        
                        {/* Bus Info */}
                        <div>
                            <h3 className="m-0 mb-4 text-sm text-gray-500 uppercase tracking-wider font-semibold">Assignment</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                                        <Bus size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Bus Number</div>
                                        <div className="text-sm text-gray-900 font-semibold">Bus {myBus.id} ({myBus.vehicle_number})</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <Navigation size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Route Name</div>
                                        <div className="text-sm text-gray-900 font-semibold">{myBus.route || 'Main Route'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Capacity</div>
                                        <div className="text-sm text-gray-900 font-semibold">{myBus.capacity} Seats</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 w-full"></div>

                        {/* Driver Info */}
                        <div>
                            <h3 className="m-0 mb-4 text-sm text-gray-500 uppercase tracking-wider font-semibold">Driver Details</h3>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col gap-3">
                                <div className="text-sm text-gray-900 font-semibold">Assigned Driver ID: {myBus.driver_id || 'Pending'}</div>
                                <div className="text-sm text-gray-600">Managed By School Admin</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-900 font-medium">Contact Office</span>
                                    <button className="px-3 py-1.5 bg-white border border-sky-500 text-sky-500 rounded cursor-pointer flex items-center gap-1.5 text-xs font-medium hover:bg-sky-50 transition-colors">
                                        <Phone size={14} /> Call
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Side: Route Table */}
                    <div className="flex-[2_1_400px] pb-6">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-gray-900 font-semibold bg-slate-50">
                                    <th className="p-4 px-6 w-[60px]">Stop</th>
                                    <th className="p-4 px-6">Location / Landmark</th>
                                    <th className="p-4 px-6">Scheduled Time</th>
                                    <th className="p-4 px-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routeSchedule.map((row, idx) => (
                                    <tr key={idx} className={`border-b border-slate-100 ${row.isCurrent ? 'bg-green-50' : 'bg-transparent hover:bg-slate-50 transition-colors'}`}>
                                        <td className="p-4 px-6 text-gray-500">{idx + 1}</td>
                                        <td className={`p-4 px-6 text-gray-900 ${row.isCurrent ? 'font-semibold' : 'font-medium'}`}>
                                            {row.stop}
                                            {row.isCurrent && <span className="ml-2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">Current</span>}
                                        </td>
                                        <td className="p-4 px-6 text-gray-600">{row.time}</td>
                                        <td className="p-4 px-6 text-right">
                                            <span className={`font-semibold text-sm ${
                                                row.status === 'Passed' ? 'text-gray-400' : (row.status === 'Your Stop' ? 'text-green-700' : 'text-sky-500')
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
