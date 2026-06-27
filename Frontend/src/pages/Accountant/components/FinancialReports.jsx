import React, { useState } from 'react';
import { BarChart3, FileText, Download, Printer, Table, PieChart } from 'lucide-react';

const FinancialReports = () => {
    const [reportType, setReportType] = useState('daily_collection');
    const [dateRange, setDateRange] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });

    const reportOptions = [
        { id: 'daily_collection', label: 'Daily Collection Report' },
        { id: 'monthly_revenue', label: 'Monthly Revenue Report' },
        { id: 'outstanding_fee', label: 'Outstanding Fee Report' },
        { id: 'expense_report', label: 'Expense Report' },
        { id: 'profit_loss', label: 'Profit & Loss Report' },
        { id: 'salary_report', label: 'Salary Report' },
        { id: 'transport_fee', label: 'Transport Fee Report' },
        { id: 'general_ledger', label: 'General Ledger' }
    ];

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">Financial Reports & Analytics</h1>
                    <p className="text-slate-500 text-xs mt-1">Generate and export detailed financial statements</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row items-end gap-3">
                    <div className="flex-1 w-full md:w-auto">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Report Type</label>
                        <select 
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-3 py-1.5 rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-xs text-slate-700"
                        >
                            {reportOptions.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">From Date</label>
                            <input 
                                type="date" 
                                value={dateRange.from}
                                onChange={e => setDateRange({...dateRange, from: e.target.value})}
                                className="w-full px-3 py-1.5 rounded border border-slate-300 outline-none focus:ring-1 focus:ring-blue-500 text-xs" 
                            />
                        </div>
                        <div className="mt-4"><span className="text-slate-400 font-medium text-xs">to</span></div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">To Date</label>
                            <input 
                                type="date" 
                                value={dateRange.to}
                                onChange={e => setDateRange({...dateRange, to: e.target.value})}
                                className="w-full px-3 py-1.5 rounded border border-slate-300 outline-none focus:ring-1 focus:ring-blue-500 text-xs" 
                            />
                        </div>
                    </div>
                    
                    <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 shadow-sm whitespace-nowrap w-full md:w-auto mt-2 md:mt-0">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="bg-white rounded shadow-sm border border-slate-200 min-h-[300px] flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100">
                        <BarChart3 size={24} />
                    </div>
                    
                    <h3 className="text-sm font-bold text-slate-800 mb-2 m-0">
                        {reportOptions.find(o => o.id === reportType)?.label}
                    </h3>
                    
                    <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                        Select date ranges and click "Generate Report" to view data visualization and detailed tabular records here.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                        <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs shadow-sm">
                            <FileText size={14} className="text-red-500" /> PDF
                        </button>
                        <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs shadow-sm">
                            <Table size={14} className="text-emerald-500" /> Excel
                        </button>
                        <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs shadow-sm">
                            <Printer size={14} className="text-slate-500" /> Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;
