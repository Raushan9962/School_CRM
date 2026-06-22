import React, { useState, useEffect } from 'react';

const PlaceholderView = ({ title }) => {
    const lowerTitle = title.toLowerCase();
    
    const [data, setData] = useState([]);
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Determine category and endpoint
    let category = 'generic';
    let endpoint = '';
    
    if (lowerTitle.includes('attendance')) { category = 'attendance'; endpoint = '/api/principal/attendance'; }
    else if (lowerTitle.includes('teacher') || lowerTitle.includes('staff')) { category = 'staff'; endpoint = '/api/principal/staff'; }
    else if (lowerTitle.includes('fee') || lowerTitle.includes('finance') || lowerTitle.includes('expense')) { category = 'finance'; endpoint = '/api/principal/fees'; }
    else if (lowerTitle.includes('exam') || lowerTitle.includes('result') || lowerTitle.includes('performance')) { category = 'academic'; endpoint = '/api/principal/exams'; }
    else if (lowerTitle.includes('leave')) { category = 'leave'; endpoint = '/api/principal/leaves'; }
    else if (lowerTitle.includes('admission')) { category = 'admissions'; endpoint = '/api/principal/admissions'; }

    useEffect(() => {
        const fetchData = async () => {
            if (!endpoint) {
                setLoading(false);
                return;
            }
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                
                const json = await response.json();
                
                if (json.data) {
                    if (Array.isArray(json.data)) {
                        setData(json.data);
                        setKpiData({ total: json.data.length });
                    } else if (typeof json.data === 'object') {
                        // Handle specific objects like fees
                        if (json.data.recent) {
                            setData(json.data.recent);
                            setKpiData(json.data);
                        } else {
                            // General object without a table array
                            setKpiData(json.data);
                            setData([]);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching generic data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    // Format headers dynamically
    const formatHeader = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    const renderTable = () => {
        if (loading) return <div className="mt-8 text-slate-500 font-medium">Loading data from database...</div>;
        if (!data || data.length === 0) return <div className="mt-8 text-slate-500 font-medium bg-white p-6 rounded-xl border border-slate-200">No records found for {title}.</div>;

        const headers = Object.keys(data[0]);

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {headers.map((h, i) => (
                                    <th key={i} className="p-4 text-sm font-bold text-slate-600 whitespace-nowrap">{formatHeader(h)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50">
                                    {headers.map((key, cellIndex) => {
                                        const cellValue = row[key];
                                        const cellStr = String(cellValue);
                                        return (
                                            <td key={cellIndex} className="p-4 text-sm text-slate-700 font-medium">
                                                {['Active', 'Present', 'Approved', 'Paid', 'Completed'].includes(cellStr) ? (
                                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{cellStr}</span>
                                                ) : ['Pending', 'Late', 'On Leave', 'Pending Review'].includes(cellStr) ? (
                                                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{cellStr}</span>
                                                ) : ['Absent', 'Archived'].includes(cellStr) ? (
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{cellStr}</span>
                                                ) : cellStr}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Calculate generic or specific KPI numbers based on kpiData state
    const kpi1 = kpiData?.totalExpected ? `₹${kpiData.totalExpected}` : (kpiData?.total || 0);
    const kpi2 = kpiData?.totalCollected ? `₹${kpiData.totalCollected}` : (kpiData?.studentAvg || 'N/A');
    const kpi3 = kpiData?.pending ? `₹${kpiData.pending}` : (kpiData?.teacherAvg || 'N/A');

    return (
        <div className="p-6 animate-fade-in relative max-w-7xl mx-auto">
            {/* Top KPI Cards (Common to almost all management screens) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 ">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{category === 'finance' ? 'Total Expected' : 'Total Records'}</p>
                        <p className="text-2xl font-black text-gray-900">{kpi1}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{category === 'finance' ? 'Total Collected' : (category === 'attendance' ? 'Student Avg' : 'Active / Success')}</p>
                        <p className="text-2xl font-black text-gray-900">{kpi2}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 ">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{category === 'finance' ? 'Pending' : (category === 'attendance' ? 'Teacher Avg' : 'Pending Actions')}</p>
                        <p className="text-2xl font-black text-gray-900">{kpi3}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 ">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">This Month</p>
                        <p className="text-2xl font-black text-gray-900">+12%</p>
                    </div>
                </div>
            </div>

            {/* The Realistic Data Table */}
            {renderTable()}

            {/* Chart Area Preview */}
            {(category === 'finance' || category === 'academic' || category === 'attendance') && (
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-6">Trend Overview</h3>
                    <div className="flex items-end gap-2 h-48 border-b border-slate-100 pb-2">
                        {[40, 70, 45, 90, 65, 80, 55, 100, 30, 85, 60, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-indigo-200 to-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceholderView;
