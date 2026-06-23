import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight, Download, Eye, PlusCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const CertificatesView = () => {
    const [activeTab, setActiveTab] = useState('issued');
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                const res = await apiFetch(`/certificates/student/${userObj.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCertificates(data);
                }
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const issuedCertificates = certificates.map((cert, idx) => ({
        id: `CERT-${new Date(cert.issue_date || cert.created_at).getFullYear()}-${cert.id.toString().padStart(3, '0')}`,
        type: cert.type,
        issuedOn: new Date(cert.issue_date || cert.created_at).toLocaleDateString(),
        purpose: cert.description || 'General Purpose',
        validTill: 'N/A',
        status: 'Valid',
        isNew: idx === 0 // just mock visual
    }));

    const pendingRequests = [
        // Dummy data since there's no certificate requests table
        { id: 'REQ-088', type: 'Transfer Certificate', requestedOn: '12 Nov 2026', expectedDate: '20 Nov 2026', purpose: 'Relocating to another city', status: 'In Process' }
    ];

    const tabs = [
        { id: 'issued', label: 'Issued Certificates', count: issuedCertificates.length.toString(), subtext: 'Ready to Download' },
        { id: 'requests', label: 'My Requests', count: pendingRequests.length.toString(), subtext: 'Pending Approval' }
    ];

    return (
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                        Certificate Type <ChevronDown size={16} />
                    </button>
                    
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search certificates..." className="py-2 pr-3 pl-9 border border-slate-200 rounded text-sm outline-none w-48 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-shadow" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-sky-500 border-none rounded text-white text-sm font-medium cursor-pointer flex items-center gap-1.5 hover:bg-sky-600 transition-colors">
                        <PlusCircle size={16} /> Request Certificate
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b-2 border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[2px] rounded-t-lg transition-colors border ${
                            activeTab === tab.id 
                                ? 'bg-sky-50 border-sky-500 border-b-0 border-t-4' 
                                : 'bg-white border-slate-200 border-b-0 border-t-transparent hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className="text-sm text-gray-600 font-medium">{tab.label}</span>
                            <span className="text-2xl font-bold text-gray-900 leading-none">{tab.count}</span>
                        </div>
                        <span className="text-xs text-gray-400 self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {activeTab === 'issued' ? (
                    loading ? (
                        <div className="p-10 text-center text-gray-500">Loading certificates...</div>
                    ) : issuedCertificates.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No certificates found.</div>
                    ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="p-4 w-[60px]">S.No.</th>
                                <th className="p-4">Certificate No.</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Purpose</th>
                                <th className="p-4">Issued On</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issuedCertificates.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-gray-500">{idx + 1}</td>
                                    <td className="p-4 relative">
                                        {row.isNew && (
                                            <div className="absolute top-0 left-0 bg-sky-500 text-white text-[10px] py-0.5 pr-4 pl-1 font-bold" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }}>
                                                New
                                            </div>
                                        )}
                                        <span className={`text-gray-900 block ${row.isNew ? 'mt-2' : 'mt-0'}`}>{row.id}</span>
                                    </td>
                                    <td className="p-4 text-gray-900 font-medium">{row.type}</td>
                                    <td className="p-4 text-gray-600">{row.purpose}</td>
                                    <td className="p-4 text-gray-600">{row.issuedOn}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            row.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 bg-slate-100 text-sky-500 rounded hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center" title="View">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-1.5 bg-slate-100 text-sky-500 rounded hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center" title="Download PDF">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-gray-900 font-semibold">
                                <th className="p-4 w-[60px]">S.No.</th>
                                <th className="p-4">Request ID</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Purpose</th>
                                <th className="p-4">Requested On</th>
                                <th className="p-4">Expected Date</th>
                                <th className="p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-gray-500">{idx + 1}</td>
                                    <td className="p-4 text-gray-900">{row.id}</td>
                                    <td className="p-4 text-gray-900 font-medium">{row.type}</td>
                                    <td className="p-4 text-gray-600">{row.purpose}</td>
                                    <td className="p-4 text-gray-600">{row.requestedOn}</td>
                                    <td className="p-4 text-gray-600">{row.expectedDate}</td>
                                    <td className="p-4 text-right">
                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Floating Action Button */}
                <button 
                    onClick={fetchCertificates} 
                    className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center cursor-pointer shadow-[0_4px_6px_rgba(14,165,233,0.4)] hover:bg-sky-600 transition-all hover:scale-105 active:scale-95"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center p-4 px-6 border-t border-slate-200 text-gray-600 text-sm gap-6">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-gray-900 cursor-pointer bg-transparent focus:ring-0">
                        <option>100</option>
                        <option>50</option>
                        <option>20</option>
                    </select>
                </div>
                <div>1-{activeTab === 'issued' ? issuedCertificates.length : pendingRequests.length} of {activeTab === 'issued' ? issuedCertificates.length : pendingRequests.length}</div>
                <div className="flex gap-2">
                    <button className="bg-transparent border-none text-gray-400 flex items-center disabled:opacity-50" disabled><ChevronLeft size={20} /></button>
                    <button className="bg-transparent border-none text-gray-600 cursor-pointer flex items-center hover:text-gray-900 transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default CertificatesView;
