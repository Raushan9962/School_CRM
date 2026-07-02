import React from 'react';
import { HelpCircle, RefreshCcw, Send, Settings, UserPlus, CreditCard } from 'lucide-react';

const SelfServiceRequests = () => {
    const services = [
        { id: 1, title: 'Update Contact Info', description: 'Request to update phone number or address.', icon: <UserPlus size={24} />, reqApproval: true },
        { id: 2, title: 'Transport Route Change', description: 'Request to change bus stop or route.', icon: <RefreshCcw size={24} />, reqApproval: true },
        { id: 3, title: 'Fee Payment Query', description: 'Raise a dispute or query regarding fees.', icon: <CreditCard size={24} />, reqApproval: false },
        { id: 4, title: 'ID Card Reprint', description: 'Request a new ID card for the student.', icon: <HelpCircle size={24} />, reqApproval: true },
        { id: 5, title: 'Document Correction', description: 'Request correction in marksheet or profile.', icon: <Settings size={24} />, reqApproval: true },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Self Service Portal</h1>
                <p className="text-slate-500">Raise requests directly to the school administration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {service.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-slate-800">{service.title}</h3>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">{service.description}</p>
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                    service.reqApproval ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                }`}>
                                    {service.reqApproval ? 'Approval Required' : 'Auto Processed'}
                                </span>
                                <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:underline">
                                    Raise Request <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">My Recent Requests</h3>
                <div className="text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">You don't have any active requests.</p>
                </div>
            </div>
        </div>
    );
};

export default SelfServiceRequests;
