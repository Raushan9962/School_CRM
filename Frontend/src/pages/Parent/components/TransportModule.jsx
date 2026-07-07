import React from 'react';
import { Bus, MapPin, Phone, Clock, Navigation } from 'lucide-react';

const TransportModule = ({ childId }) => {
    // In a real app, you would fetch transport info based on childId
    const transportDetails = {
        busNumber: "DL-1P-1234",
        route: "Route 5 - City Center to School",
        driverName: "Ramesh Singh",
        driverPhone: "+91 98765 43210",
        pickupTime: "07:30 AM",
        dropTime: "03:15 PM",
        pickupStop: "City Center Metro Gate 2",
        status: "On Route",
        eta: "10 mins"
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Transport & Tracking</h1>
                <p className="text-slate-500">Live bus tracking and route details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Details Card */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
                                    <Bus size={18} />
                                </div>
                                <div>
                                    <p className="m-0 mb-0.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bus Number</p>
                                    <h2 className="m-0 text-base font-bold text-slate-800">{transportDetails.busNumber}</h2>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider border border-emerald-200">
                                {transportDetails.status}
                            </span>
                        </div>

                        <div className="space-y-3 border-t border-slate-100 pt-3">
                            <div>
                                <p className="m-0 mb-0.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Route Name</p>
                                <p className="m-0 text-[13px] font-bold text-slate-800">{transportDetails.route}</p>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                <Phone size={14} className="text-slate-400 shrink-0" />
                                <div>
                                    <p className="m-0 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Driver: {transportDetails.driverName}</p>
                                    <p className="m-0 text-[13px] font-bold text-slate-800">{transportDetails.driverPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                            <Clock size={16} className="text-amber-500 shrink-0" />
                            <h3 className="m-0 text-sm font-bold text-slate-800">Schedule</h3>
                        </div>
                        <div className="relative pl-5 space-y-4 border-l border-slate-200 ml-2.5 mt-2">
                            <div className="relative">
                                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div>
                                <p className="m-0 text-[11px] font-bold text-blue-600 mb-0.5">{transportDetails.pickupTime}</p>
                                <p className="m-0 text-[13px] font-bold text-slate-800">Pickup</p>
                                <p className="m-0 text-[11px] text-slate-500 mt-0.5">{transportDetails.pickupStop}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
                                <p className="m-0 text-[11px] font-bold text-emerald-600 mb-0.5">{transportDetails.dropTime}</p>
                                <p className="m-0 text-[13px] font-bold text-slate-800">Drop (School)</p>
                                <p className="m-0 text-[11px] text-slate-500 mt-0.5">Main Campus Gate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Tracking Area (Placeholder) */}
                <div className="lg:col-span-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm min-h-[400px] flex flex-col relative overflow-hidden">
                    {/* Simulated Map Overlay */}
                    <div className="absolute inset-0 bg-slate-100/50 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-[1px]">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md mb-3 animate-pulse">
                            <Navigation size={24} />
                        </div>
                        <h3 className="m-0 text-base font-bold text-slate-800 mb-1">Live Tracking Active</h3>
                        <p className="m-0 text-[12px] text-slate-500 max-w-xs">
                            Map integration is required to show the live position of the bus. Currently showing simulated status.
                        </p>
                        <div className="mt-4 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg inline-flex flex-col items-center">
                            <span className="m-0 text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">ETA to your stop</span>
                            <span className="m-0 text-xl font-black text-blue-600">{transportDetails.eta}</span>
                        </div>
                    </div>
                    {/* Fake map background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default TransportModule;
