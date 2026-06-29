import React, { useState, useEffect } from 'react';
import { Settings, ClipboardList, X } from 'lucide-react';
import apiFetch from '../../../services/api';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    maintenance_mode: 'false',
    default_currency: 'INR',
    email_notifications: 'true'
  });

  const [plans, setPlans] = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiFetch('/super-admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openConfigModal = () => {
    setFormData({
      maintenance_mode: settings.maintenance_mode || 'false',
      default_currency: settings.default_currency || 'INR',
      email_notifications: settings.email_notifications || 'true'
    });
    setShowConfigModal(true);
  };

  const openPlansModal = async () => {
    setShowPlansModal(true);
    setLoadingPlans(true);
    try {
      const res = await apiFetch('/super-admin/plans');
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const startEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      max_students: plan.max_students || '',
      monthly_price: plan.monthly_price,
      yearly_price: plan.yearly_price
    });
  };

  const savePlan = async (id) => {
    try {
      const res = await apiFetch(`/super-admin/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           name: planForm.name,
           max_students: planForm.max_students ? parseInt(planForm.max_students) : null,
           monthly_price: parseFloat(planForm.monthly_price),
           yearly_price: parseFloat(planForm.yearly_price)
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingPlanId(null);
        openPlansModal(); // refresh
      } else {
        alert(data.message || 'Failed to update plan');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating plan');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/super-admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowConfigModal(false);
        fetchSettings();
      } else {
        alert(data.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-800 m-0">Platform Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Configure global parameters for the School CRM.</p>
      </div>
      
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="System Config" icon={<Settings size={16} />} variant="primary" onClick={openConfigModal} />
        <ActionBtn text="Manage Plans" icon={<ClipboardList size={16} />} variant="secondary" onClick={openPlansModal} />
      </div>

      <div className="mt-8">
        <h3 className="m-0 mb-4 text-sm font-bold text-slate-800 uppercase tracking-wider">Global Configurations</h3>
        
        {loading ? (
          <p className="text-slate-500 text-sm">Loading settings...</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-0 rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-slate-50/50 transition-colors min-h-[100px] flex flex-col justify-between">
              <div className="text-[14px] text-slate-700">Maintenance Mode</div>
              <div className="text-right mt-4 flex flex-col items-end">
                <div className="text-[28px] font-semibold text-slate-900 leading-none tracking-tight flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${settings.maintenance_mode === 'true' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                  {settings.maintenance_mode === 'true' ? 'Active' : 'Disabled'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Global platform state
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-slate-50/50 transition-colors min-h-[100px] flex flex-col justify-between">
              <div className="text-[14px] text-slate-700">Default Currency</div>
              <div className="text-right mt-4">
                <div className="text-[28px] font-semibold text-slate-900 leading-none tracking-tight">
                  {settings.default_currency || 'INR'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Used across platform
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 hover:bg-slate-50/50 transition-colors min-h-[100px] flex flex-col justify-between">
              <div className="text-[14px] text-slate-700">Email Notifications</div>
              <div className="text-right mt-4 flex flex-col items-end">
                <div className="text-[28px] font-semibold text-slate-900 leading-none tracking-tight flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${settings.email_notifications === 'false' ? 'bg-slate-300' : 'bg-blue-500'}`}></span>
                  {settings.email_notifications === 'false' ? 'Disabled' : 'Enabled'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  System alerts
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showConfigModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0">System Config</h3>
              <button onClick={() => setShowConfigModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Maintenance Mode</label>
                  <select value={formData.maintenance_mode} onChange={e => setFormData({...formData, maintenance_mode: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="false">Disabled (Normal Operation)</option>
                    <option value="true">Active (Site Offline)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
                  <select value={formData.default_currency} onChange={(e) => setFormData({...formData, default_currency: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Notifications</label>
                  <select value={formData.email_notifications} onChange={e => setFormData({...formData, email_notifications: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="true">Enabled (Send Emails)</option>
                    <option value="false">Disabled (Silent Mode)</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowConfigModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border-none">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer border-none disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPlansModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 m-0">Manage Subscription Plans</h3>
              <button onClick={() => setShowPlansModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              {loadingPlans ? (
                <p className="text-slate-500 text-sm">Loading plans...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="p-3 border-b border-slate-200 font-semibold">Plan Name</th>
                        <th className="p-3 border-b border-slate-200 font-semibold">Max Students</th>
                        <th className="p-3 border-b border-slate-200 font-semibold">Monthly Price</th>
                        <th className="p-3 border-b border-slate-200 font-semibold">Yearly Price</th>
                        <th className="p-3 border-b border-slate-200 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">
                            {editingPlanId === p.id ? (
                              <input type="text" value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} className="w-full p-1 border rounded" />
                            ) : p.name}
                          </td>
                          <td className="p-3 text-slate-600">
                            {editingPlanId === p.id ? (
                              <input type="number" value={planForm.max_students} onChange={e => setPlanForm({...planForm, max_students: e.target.value})} placeholder="Unlimited if empty" className="w-full p-1 border rounded" />
                            ) : (p.max_students || 'Unlimited')}
                          </td>
                          <td className="p-3 text-slate-600">
                            {editingPlanId === p.id ? (
                              <input type="number" step="0.01" value={planForm.monthly_price} onChange={e => setPlanForm({...planForm, monthly_price: e.target.value})} className="w-full p-1 border rounded" />
                            ) : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p.monthly_price || 0)}
                          </td>
                          <td className="p-3 text-slate-600">
                            {editingPlanId === p.id ? (
                              <input type="number" step="0.01" value={planForm.yearly_price} onChange={e => setPlanForm({...planForm, yearly_price: e.target.value})} className="w-full p-1 border rounded" />
                            ) : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p.yearly_price || 0)}
                          </td>
                          <td className="p-3 text-right">
                            {editingPlanId === p.id ? (
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => savePlan(p.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs cursor-pointer">Save</button>
                                <button onClick={() => setEditingPlanId(null)} className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs cursor-pointer">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => startEditPlan(p)} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 cursor-pointer">Edit</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

export default PlatformSettings;
