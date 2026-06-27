import React from 'react';

const ReceptionistOverview = () => {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-lg text-white shadow-[0_10px_15px_-3px_rgba(236,72,153,0.3)]">
                <h3 className="m-0 mb-2.5 text-sm font-semibold opacity-90">Today's Visitors</h3>
                <p className="text-3xl font-bold m-0">45</p>
                <p className="text-xs mt-2 mb-0 opacity-80">12 Currently in premises</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-lg text-white shadow-[0_10px_15px_-3px_rgba(20,184,166,0.3)]">
                <h3 className="m-0 mb-2.5 text-sm font-semibold opacity-90">Admission Enquiries</h3>
                <p className="text-3xl font-bold m-0">18</p>
                <p className="text-xs mt-2 mb-0 opacity-80">Pending follow-ups</p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-4 rounded-lg text-white shadow-[0_10px_15px_-3px_rgba(139,92,246,0.3)]">
                <h3 className="m-0 mb-2.5 text-sm font-semibold opacity-90">Calls Handled</h3>
                <p className="text-3xl font-bold m-0">124</p>
                <p className="text-xs mt-2 mb-0 opacity-80">Today</p>
            </div>

            <div className="col-[1/-1] bg-white p-4 rounded-lg shadow-sm">
                <h3 className="m-0 mb-4 text-lg text-slate-800">Recent Front Desk Activity</h3>
                <ul className="list-none p-0 m-0">
                    <li className="py-3 border-b border-slate-200 flex gap-3 items-center">
                        <span className="text-xl">👤</span>
                        <div>
                            <p className="m-0 font-semibold text-slate-700">Visitor Entry: Michael Brown</p>
                            <span className="text-xs text-slate-500">Meeting with: Principal (10:15 AM)</span>
                        </div>
                    </li>
                    <li className="py-3 border-b border-slate-200 flex gap-3 items-center">
                        <span className="text-xl">📞</span>
                        <div>
                            <p className="m-0 font-semibold text-slate-700">Enquiry: Grade 1 Admission</p>
                            <span className="text-xs text-slate-500">Forwarded to Admissions Team</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ReceptionistOverview;
