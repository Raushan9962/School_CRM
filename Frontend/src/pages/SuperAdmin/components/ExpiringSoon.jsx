import React, { useState, useEffect } from 'react';
import { Bell, Clock, X, AlertTriangle } from 'lucide-react';
import apiFetch from '../../../services/api';

const ExpiringSoon = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpiringSchools();
  }, []);

  const fetchExpiringSchools = async () => {
    try {
      const res = await apiFetch('/super-admin/expiring-soon');
      const data = await res.json();
      if (data.success) {
        setSchools(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching expiring schools', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    setSending(true);
    try {
      const res = await apiFetch('/super-admin/reminders/send', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowReminderModal(false);
      } else {
        alert(data.message || 'Failed to send reminders');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending reminders');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-800 m-0">Expiring Soon</h2>
        <p className="text-slate-500 text-sm mt-1">Monitor school subscriptions expiring within 30 days.</p>
      </div>
      
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Send Reminders" icon={<Bell size={16} />} variant="primary" onClick={() => setShowReminderModal(true)} />
        <ActionBtn text="View All" icon={<Clock size={16} />} variant="secondary" onClick={() => alert('View All Expiring Schools feature coming soon!')} />
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6">
        <h3 className="m-0 mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          Schools Expiring within 30 Days
        </h3>
        
        {loading ? (
          <p className="text-slate-500 text-sm">Loading expiring schools...</p>
        ) : schools.length === 0 ? (
          <p className="text-slate-500 text-sm">No schools are expiring soon.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">School Name</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Admin</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Plan</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Renewal Date</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {schools.map(s => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">
                      <div>{s.name}</div>
                      <div className="text-xs text-slate-500 font-normal">{s.city}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{s.admin_name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{s.admin_email}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold">{s.plan_name}</span>
                    </td>
                    <td className="p-3 font-bold text-amber-700">
                      {new Date(s.next_renewal_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button onClick={() => setShowReminderModal(true)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded transition-colors border border-blue-200 cursor-pointer">
                        Remind
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showReminderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0">Send Reminders</h3>
              <button onClick={() => setShowReminderModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Automated Renewal Reminders</h4>
              <p className="text-sm text-slate-500 mb-6">This will send an email reminder to all schools whose subscriptions are expiring within the next 30 days.</p>
              
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowReminderModal(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border-none">Cancel</button>
                <button onClick={handleSendReminders} disabled={sending} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer border-none disabled:opacity-50">
                  {sending ? 'Sending...' : 'Confirm Send'}
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

export default ExpiringSoon;
