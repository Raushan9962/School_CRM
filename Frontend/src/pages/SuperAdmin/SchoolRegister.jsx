import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SchoolRegister = () => {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────────────────
  const [plans,         setPlans]         = useState([]);
  const [plansLoading,  setPlansLoading]  = useState(true);
  const [selectedPlan,  setSelectedPlan]  = useState('');
  const [billingCycle,  setBillingCycle]  = useState('Monthly');
  const [price,         setPrice]         = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [message,       setMessage]       = useState('');
  const [messageType,   setMessageType]   = useState(''); // 'success' | 'error'

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    schoolName: '', schoolCode: '', schoolEmail: '', schoolPhone: '',
    schoolAddress: '', city: '', state: '', country: '', pincode: '', schoolWebsite: ''
  });

  // ── useEffect: Fetch subscription plans from backend ──────────────────────
  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        const res   = await fetch('http://localhost:5000/api/subscriptions/plans', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && (data.plans || data.data || Array.isArray(data))) {
          const list = data.plans || data.data || data;
          setPlans(list);
        } else {
          // Fallback to default tiers if API unavailable
          setPlans([
            { id: 1, name: 'Up to 50',               monthly_price: 500,   yearly_price: 5000   },
            { id: 2, name: 'Up to 100',              monthly_price: 900,   yearly_price: 9000   },
            { id: 3, name: 'Up to 200',              monthly_price: 1600,  yearly_price: 16000  },
            { id: 4, name: 'Up to 400',              monthly_price: 3000,  yearly_price: 30000  },
            { id: 5, name: 'Up to 500',              monthly_price: 3500,  yearly_price: 35000  },
            { id: 6, name: 'Up to 1000',             monthly_price: 6000,  yearly_price: 60000  },
            { id: 7, name: 'Up to 1500',             monthly_price: 8500,  yearly_price: 85000  },
            { id: 8, name: 'Up to 2000',             monthly_price: 11000, yearly_price: 110000 },
            { id: 9, name: '2000+ (Unlimited)',      monthly_price: 15000, yearly_price: 150000 },
          ]);
        }
      } catch {
        // Network error — use fallback
        setPlans([
          { id: 1, name: 'Up to 50',          monthly_price: 500,   yearly_price: 5000   },
          { id: 2, name: 'Up to 100',         monthly_price: 900,   yearly_price: 9000   },
          { id: 3, name: 'Up to 200',         monthly_price: 1600,  yearly_price: 16000  },
          { id: 4, name: 'Up to 400',         monthly_price: 3000,  yearly_price: 30000  },
          { id: 5, name: 'Up to 500',         monthly_price: 3500,  yearly_price: 35000  },
          { id: 6, name: 'Up to 1000',        monthly_price: 6000,  yearly_price: 60000  },
          { id: 7, name: 'Up to 1500',        monthly_price: 8500,  yearly_price: 85000  },
          { id: 8, name: 'Up to 2000',        monthly_price: 11000, yearly_price: 110000 },
          { id: 9, name: '2000+ (Unlimited)', monthly_price: 15000, yearly_price: 150000 },
        ]);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlanChange = (e) => {
    const planId = parseInt(e.target.value);
    setSelectedPlan(planId);
    updatePrice(planId, billingCycle);
  };

  const handleBillingChange = (e) => {
    const cycle = e.target.value;
    setBillingCycle(cycle);
    updatePrice(selectedPlan, cycle);
  };

  const updatePrice = (planId, cycle) => {
    const plan = plans.find(p => p.id === planId);
    setPrice(plan ? (cycle === 'Monthly' ? plan.monthly_price : plan.yearly_price) : 0);
  };

  // ── Cancel: go back to Super Admin ────────────────────────────────────────
  const handleCancel = () => {
    navigate('/SuperAdmin');
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...formData,
        roleName: 'School Admin',
        planId: selectedPlan,
        billingCycle: billingCycle
      };

      const token = localStorage.getItem('token') || '';
      const response = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ School & Admin registered successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/SuperAdmin'), 1800);
      } else {
        setMessage(data.message || 'Error registering school');
        setMessageType('error');
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Server connection failed. Make sure backend is running.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // ── Input class helper ─────────────────────────────────────────────────────
  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-colors';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl border-t-4 border-indigo-600 overflow-hidden">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">Register New School</h2>
              <p className="text-sm text-gray-500 mt-0.5">Fill in all details to register a school and its admin account</p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* ── Alert Message ────────────────────────────────────────────── */}
        {message && (
          <div className={`mx-8 mt-6 p-4 rounded-xl text-center font-semibold text-sm ${
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-8">

          {/* ── Section 1: Admin User Details ─────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">1</span>
              <h3 className="text-lg font-bold text-gray-800">Admin User Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Admin Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="Full Name" />
              </div>
              <div>
                <label className={labelCls}>Admin Email (Login ID) *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="admin@example.com" />
              </div>
              <div>
                <label className={labelCls}>Admin Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="Phone Number" />
              </div>
              <div>
                <label className={labelCls}>Password *</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className={inputCls} placeholder="Secure Password" />
              </div>
            </div>
          </div>

          {/* ── Section 2: School Information ─────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">2</span>
              <h3 className="text-lg font-bold text-gray-800">School Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>School Name *</label>
                <input required type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className={inputCls} placeholder="Enter school name" />
              </div>
              <div>
                <label className={labelCls}>School Code (Optional)</label>
                <input type="text" name="schoolCode" value={formData.schoolCode} onChange={handleChange} className={inputCls} placeholder="e.g. DPS-101" />
              </div>
              <div>
                <label className={labelCls}>School Email *</label>
                <input required type="email" name="schoolEmail" value={formData.schoolEmail} onChange={handleChange} className={inputCls} placeholder="info@school.com" />
              </div>
              <div>
                <label className={labelCls}>School Phone *</label>
                <input required type="text" name="schoolPhone" value={formData.schoolPhone} onChange={handleChange} className={inputCls} placeholder="School Contact No." />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>School Address *</label>
                <input required type="text" name="schoolAddress" value={formData.schoolAddress} onChange={handleChange} className={inputCls} placeholder="Full Address" />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputCls} placeholder="City" />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputCls} placeholder="State" />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputCls} placeholder="Country" />
              </div>
              <div>
                <label className={labelCls}>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputCls} placeholder="Zip/Pincode" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Website (Optional)</label>
                <input type="text" name="schoolWebsite" value={formData.schoolWebsite} onChange={handleChange} className={inputCls} placeholder="https://www.school.com" />
              </div>
            </div>
          </div>

          {/* ── Section 3: Subscription Plan ──────────────────────────── */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">3</span>
              <h3 className="text-lg font-bold text-indigo-800">Choose Subscription Plan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Student Capacity Tier *</label>
                <select
                  required
                  disabled={plansLoading}
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm disabled:opacity-60"
                  value={selectedPlan}
                  onChange={handlePlanChange}
                >
                  <option value="">{plansLoading ? 'Loading plans...' : 'Select a tier...'}</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} students</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Billing Cycle *</label>
                <select
                  required
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                  value={billingCycle}
                  onChange={handleBillingChange}
                >
                  <option value="Monthly">Monthly Billing</option>
                  <option value="Yearly">Yearly Billing (Save ~17%)</option>
                </select>
              </div>
            </div>

            {/* Price Preview */}
            {selectedPlan !== '' && (
              <div className="mt-5 flex items-center justify-between bg-white rounded-xl px-6 py-4 shadow-sm border border-indigo-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Estimated Pricing</p>
                  <p className="text-3xl font-extrabold text-indigo-600 mt-0.5">
                    ₹{price.toLocaleString('en-IN')}
                    <span className="text-base text-gray-400 font-normal ml-1">/{billingCycle === 'Monthly' ? 'month' : 'year'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Selected Plan</p>
                  <p className="text-sm font-bold text-gray-700">{plans.find(p => p.id === selectedPlan)?.name} students</p>
                  <p className="text-xs text-indigo-500 font-semibold mt-0.5">{billingCycle}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 sm:flex-none sm:w-48 flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-bold text-sm rounded-xl transition-all shadow-md ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Create School & Admin Account
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SchoolRegister;
