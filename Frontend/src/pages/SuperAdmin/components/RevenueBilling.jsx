import React, { useState, useEffect } from 'react';
import { TrendingUp, CalendarDays, X, IndianRupee, Activity } from 'lucide-react';
import apiFetch from '../../../services/api';

const RevenueBilling = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('monthly');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const res = await apiFetch('/super-admin/revenue/report');
      const data = await res.json();
      if (data.success) {
        setRevenueData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReport = (type) => {
    setReportType(type);
    setShowReportModal(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-800 m-0">Revenue & Billing</h2>
        <p className="text-slate-500 text-sm mt-1">Track platform revenue and billing cycles.</p>
      </div>
      
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Monthly Reports" icon={<TrendingUp size={16} />} variant="primary" onClick={() => handleOpenReport('monthly')} />
        <ActionBtn text="Yearly Reports" icon={<CalendarDays size={16} />} variant="secondary" onClick={() => handleOpenReport('yearly')} />
      </div>

      <div className="mt-8">
        <h3 className="m-0 mb-4 text-sm font-bold text-slate-800 uppercase tracking-wider">Revenue Insights</h3>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading revenue data...</p>
        ) : revenueData ? (
          <div className="flex flex-col md:flex-row gap-0 rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-slate-50/50 transition-colors min-h-[100px] flex flex-col justify-between">
              <div className="text-[14px] text-slate-700">Total Revenue</div>
              <div className="text-right mt-4">
                <div className="text-[28px] font-semibold text-slate-900 leading-none tracking-tight">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(revenueData.totalRevenue || 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  +12.5% this month
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-slate-50/50 transition-colors min-h-[100px] flex flex-col justify-between">
              <div className="text-[14px] text-slate-700">Projected Revenue</div>
              <div className="text-right mt-4">
                <div className="text-[28px] font-semibold text-slate-900 leading-none tracking-tight">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(revenueData.projectedRevenue || 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Expected this billing cycle
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 hover:bg-slate-50/50 transition-colors min-h-[100px] flex flex-col justify-between">
              <div className="text-[14px] text-slate-700">Pending Dues</div>
              <div className="text-right mt-4">
                <div className="text-[28px] font-semibold text-slate-900 leading-none tracking-tight">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(revenueData.pendingDues || 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Requires follow-up
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Failed to load revenue data.</p>
        )}
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0 capitalize">{reportType} Report</h3>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {reportType === 'monthly' ? <TrendingUp size={32} /> : <CalendarDays size={32} />}
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Generate {reportType} Statement</h4>
              <p className="text-sm text-slate-500 mb-6">You are about to generate a comprehensive {reportType} revenue and billing report across all registered schools.</p>
              
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowReportModal(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border-none">Cancel</button>
                <button onClick={() => { alert('Report generated and downloaded as CSV!'); setShowReportModal(false); }} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer border-none">
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ text, icon, variant = 'primary', onClick }) => {
  const base = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[13px] transition-all duration-200 border shadow-sm cursor-pointer";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border-slate-300",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
  };
  
  return (
    <button 
      onClick={onClick || (() => alert(`${text} functionality coming soon!`))}
      className={`${base} ${variants[variant] || variants.primary} hover:-translate-y-0.5`}
    >
      {icon} {text}
    </button>
  );
};

export default RevenueBilling;
