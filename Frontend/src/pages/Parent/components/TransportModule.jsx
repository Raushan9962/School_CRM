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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Bus size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bus Number</p>
                                    <h2 className="text-lg font-bold text-slate-800">{transportDetails.busNumber}</h2>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                                {transportDetails.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Route Name</p>
                                <p className="text-sm font-semibold text-slate-800">{transportDetails.route}</p>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Phone size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Driver: {transportDetails.driverName}</p>
                                    <p className="text-sm font-bold text-slate-800">{transportDetails.driverPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-amber-500" />
                            Schedule
                        </h3>
                        <div className="relative pl-6 space-y-6 border-l-2 border-slate-100 ml-3">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>
                                <p className="text-xs font-bold text-blue-600 mb-1">{transportDetails.pickupTime}</p>
                                <p className="text-sm font-semibold text-slate-800">Pickup</p>
                                <p className="text-xs text-slate-500">{transportDetails.pickupStop}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm"></div>
                                <p className="text-xs font-bold text-emerald-600 mb-1">{transportDetails.dropTime}</p>
                                <p className="text-sm font-semibold text-slate-800">Drop (School)</p>
                                <p className="text-xs text-slate-500">Main Campus Gate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Tracking Area (Placeholder) */}
                <div className="lg:col-span-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col relative overflow-hidden">
                    {/* Simulated Map Overlay */}
                    <div className="absolute inset-0 bg-slate-100/50 flex flex-col items-center justify-center p-8 text-center z-10 backdrop-blur-[2px]">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg mb-4 animate-pulse">
                            <Navigation size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Live Tracking Active</h3>
                        <p className="text-slate-500 max-w-sm">
                            Map integration is required to show the live position of the bus. Currently showing simulated status.
                        </p>
                        <div className="mt-6 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-xl inline-flex flex-col items-center">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">ETA to your stop</span>
                            <span className="text-2xl font-black text-blue-600">{transportDetails.eta}</span>
                        </div>
                    </div>
                    {/* Fake map background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default TransportModule;
