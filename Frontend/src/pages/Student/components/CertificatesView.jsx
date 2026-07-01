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
        <div className="flex flex-col gap-5 bg-white rounded-lg border border-slate-200 overflow-hidden relative animate-fade-in">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        Certificate Type <ChevronDown size={14} />
                    </button>
                    
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search certificates..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 w-48" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-1.5 bg-blue-600 text-white border-none rounded text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <PlusCircle size={14} /> Request Certificate
                    </button>
                </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto px-6 gap-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-w-[160px] p-4 text-left cursor-pointer flex flex-col gap-1 relative -mb-[1px] border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                        <div className="flex justify-between items-start w-full">
                            <span className={`text-xs font-bold ${activeTab === tab.id ? 'text-blue-700' : 'text-slate-600'}`}>{tab.label}</span>
                            <span className={`text-lg font-bold leading-none ${activeTab === tab.id ? 'text-blue-800' : 'text-slate-800'}`}>{tab.count}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium self-end">{tab.subtext}</span>
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto px-6 pb-6 min-h-[300px]">
                {activeTab === 'issued' ? (
                    loading ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading certificates...</div>
                    ) : issuedCertificates.length === 0 ? (
                        <div className="p-10 text-center text-slate-500 font-medium text-sm">No certificates found.</div>
                    ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Certificate No.</th>
                                <th className="px-4 py-2 font-bold">Type</th>
                                <th className="px-4 py-2 font-bold">Purpose</th>
                                <th className="px-4 py-2 font-bold">Issued On</th>
                                <th className="px-4 py-2 font-bold text-center">Status</th>
                                <th className="px-4 py-2 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {issuedCertificates.map((row, idx) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 relative">
                                        {row.isNew && (
                                            <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-2 py-0.5 rounded-br-lg font-bold">
                                                NEW
                                            </div>
                                        )}
                                        <span className={`block font-bold text-slate-700 ${row.isNew ? 'mt-3' : ''}`}>{row.id}</span>
                                    </td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.type}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.purpose}</td>
                                    <td className="px-4 py-2.5 text-slate-600 font-medium">{row.issuedOn}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            row.status === 'Valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center" title="View">
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center" title="Download PDF">
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                                <th className="px-4 py-2 font-bold w-[60px]">S.No.</th>
                                <th className="px-4 py-2 font-bold">Request ID</th>
                                <th className="px-4 py-2 font-bold">Type</th>
                                <th className="px-4 py-2 font-bold">Purpose</th>
                                <th className="px-4 py-2 font-bold">Requested On</th>
                                <th className="px-4 py-2 font-bold">Expected Date</th>
                                <th className="px-4 py-2 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {pendingRequests.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-2.5 text-slate-500">{idx + 1}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.id}</td>
                                    <td className="px-4 py-2.5 font-bold text-slate-800">{row.type}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.purpose}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{row.requestedOn}</td>
                                    <td className="px-4 py-2.5 text-slate-600 font-medium">{row.expectedDate}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-600">
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
                    className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-600 text-white border-none flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end items-center px-6 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] font-bold gap-4">
                <div className="flex items-center gap-2">
                    Rows per page: 
                    <select className="border-none outline-none text-slate-700 bg-transparent font-bold cursor-pointer">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                <div>1-{activeTab === 'issued' ? issuedCertificates.length : pendingRequests.length} of {activeTab === 'issued' ? issuedCertificates.length : pendingRequests.length}</div>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-400 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                    <button className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default CertificatesView;
