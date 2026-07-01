import React, { useState, useEffect } from 'react';
import { PlusCircle, Download, X, Check, FileText } from 'lucide-react';
import apiFetch from '../../../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    school_id: '',
    amount: '',
    reference_no: '',
    status: 'Completed',
    payment_method: 'Bank Transfer'
  });
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchSchools();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await apiFetch('/super-admin/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await apiFetch('/super-admin/schools');
      const data = await res.json();
      if (data.success) {
        setSchools(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch('/super-admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ school_id: '', amount: '', reference_no: '', status: 'Completed', payment_method: 'Bank Transfer' });
        fetchTransactions();
      } else {
        alert(data.message || 'Failed to add transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyTransaction = async (id) => {
    if (!window.confirm('Mark this transaction as verified and completed?')) return;
    try {
      const res = await apiFetch(`/super-admin/transactions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      const data = await res.json();
      if (data.success) {
        fetchTransactions();
      } else {
        alert(data.message || 'Failed to verify transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying transaction');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-800 m-0">Transactions</h2>
        <p className="text-slate-500 text-sm mt-1">Manage and track all payment transactions across schools.</p>
      </div>
      
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Add Transaction" icon={<PlusCircle size={16} />} variant="primary" onClick={() => setShowAddModal(true)} />
        <ActionBtn text="Export Report" icon={<Download size={16} />} variant="secondary" onClick={() => alert('Exporting Transactions CSV...')} />
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
        border: '1px solid #e2e8f0' 
      }}>
        <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Transaction History</h3>
        
        {loading ? (
          <p className="text-slate-500 text-sm">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-slate-500 text-sm">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Date</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">School</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Ref No.</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Method</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Amount</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap">Status</th>
                  <th className="p-3 border-b border-slate-200 font-semibold whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{new Date(t.transaction_date).toLocaleDateString()}</td>
                    <td className="p-3 font-medium text-slate-800">{t.school_name || 'N/A'}</td>
                    <td className="p-3 text-slate-600 font-mono text-xs">{t.reference_no}</td>
                    <td className="p-3 text-slate-600">{t.payment_method}</td>
                    <td className="p-3 font-bold text-slate-900">₹{parseFloat(t.amount).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        t.status === 'Completed' || t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        (t.status === 'Pending' || t.status === 'Pending Verification') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.receipt_url && (
                          <a href={`http://localhost:5000${t.receipt_url}`} target="_blank" rel="noreferrer" title="View Receipt" className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                            <FileText size={16} />
                          </a>
                        )}
                        {t.status === 'Pending Verification' && (
                          <button onClick={() => handleVerifyTransaction(t.id)} title="Verify & Approve" className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors border-none cursor-pointer">
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select School</label>
                  <select required value={formData.school_id} onChange={e => setFormData({...formData, school_id: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">-- Choose a School --</option>
                    {schools.map(s => <option key={s.school_id} value={s.school_id}>{s.school_name}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (₹)</label>
                    <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Reference No.</label>
                    <input type="text" required value={formData.reference_no} onChange={e => setFormData({...formData, reference_no: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. TXN-12345" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
                    <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border-none">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer border-none disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Add Transaction'}
                  </button>
                </div>
              </form>
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

export default Transactions;
