import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ─── API helper ───────────────────────────────────────────────────────────────
const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || '';
const authFetch = (url) =>
  fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json());

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  schools: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  revenue: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  expiring: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  txn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const formatINR = (n) => '₹' + (parseFloat(n) || 0).toLocaleString('en-IN');
const cls = (...args) => args.filter(Boolean).join(' ');

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ text, color = 'blue' }) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    yellow: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-indigo-50 text-indigo-700',
    gray: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={cls('inline-block px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap', styles[color] || styles.blue)}>
      {text}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, borderColor, iconBg, iconColor, icon }) => (
  <div className={cls('bg-white rounded-xl p-5 shadow-sm border-l-4 flex items-center gap-4', borderColor)}>
    <div className={cls('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
      <span className={cls('w-6 h-6', iconColor)}>{icon}</span>
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-extrabold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Revenue SVG Chart ────────────────────────────────────────────────────────
const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-sm">
        <span className="text-4xl mb-3">📊</span>
        No revenue data yet. Register schools to see the graph.
      </div>
    );
  }
  const W = 600, H = 200, PAD = 44;
  const max = Math.max(...data.map(d => parseFloat(d.revenue)), 1);
  const pts = data.map((d, i) => {
    const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - (parseFloat(d.revenue) / max) * (H - PAD * 2);
    return [x, y];
  });
  const polyline = pts.map(p => p.join(',')).join(' ');
  const area = [...pts.map(p => p.join(',')), `${pts[pts.length - 1][0]},${H - PAD}`, `${pts[0][0]},${H - PAD}`].join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = PAD + t * (H - PAD * 2);
        return (
          <g key={i}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">
              ₹{Math.round(max * (1 - t) / 1000)}k
            </text>
          </g>
        );
      })}
      <polygon points={area} fill="url(#revGrad)" />
      <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.5" fill="#6366f1" stroke="white" strokeWidth="2" />
          <text x={x} y={H - PAD + 14} textAnchor="middle" fontSize="8.5" fill="#64748b">
            {data[i].month?.split(' ')[0]}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];
const DonutChart = ({ slices }) => {
  if (!slices?.length) return null;
  const total = slices.reduce((s, d) => s + parseFloat(d.value), 0);
  if (!total) return null;
  const R = 40, cx = 60, cy = 60, stroke = 22, circ = 2 * Math.PI * R;
  let cum = 0;
  const paths = slices.map((s, i) => {
    const pct = parseFloat(s.value) / total;
    const offset = circ * (1 - cum - pct);
    const dash = circ * pct;
    cum += pct;
    return { ...s, dash, offset, color: COLORS[i % COLORS.length] };
  });
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg viewBox="0 0 120 120" className="w-28 h-28 flex-shrink-0">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        {paths.map((p, i) => (
          <circle key={i} cx={cx} cy={cy} r={R} fill="none"
            stroke={p.color} strokeWidth={stroke}
            strokeDasharray={`${p.dash} ${circ - p.dash}`}
            strokeDashoffset={p.offset}
            style={{ transition: 'all 0.6s ease', transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)' }}
          />
        ))}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">{slices.length}</text>
        <text x={cx} y={cy + 17} textAnchor="middle" fontSize="7" fill="#64748b">plans</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1">
        {paths.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: p.color }} />
            <span className="text-slate-500 flex-1">{p.label}</span>
            <span className="font-bold text-slate-800">{p.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VIEWS
// ─────────────────────────────────────────────────────────────────────────────

// ── Dashboard Overview ────────────────────────────────────────────────────────
const DashboardView = ({ schoolAdmins }) => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch(`${API}/super-admin/dashboard`),
      authFetch(`${API}/super-admin/revenue/monthly`),
    ]).then(([s, r]) => {
      if (s.success) setStats(s.stats);
      if (r.success) setRevenue(r.data);
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
  }, []);

  const totalSchools = schoolAdmins.length;
  const withPlans = schoolAdmins.filter(a => a.plan_name).length;
  const cities = [...new Set(schoolAdmins.map(a => a.city).filter(Boolean))].length;
  const monthlyRev = stats?.revenue?.monthly_revenue || 0;
  const yearlyRev = stats?.revenue?.yearly_revenue || 0;
  const userRole = stats?.usersByRole || {};
  const totalUsers = Object.values(userRole).reduce((a, b) => a + b, 0);
  const planDist = (stats?.planDistribution || []).map(p => ({ label: p.plan_name, value: parseFloat(p.school_count), count: p.school_count }));

  const cards = [
    { label: 'Total Schools', value: totalSchools, sub: 'Registered', borderColor: 'border-indigo-500', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', icon: icons.schools },
    { label: 'Active Plans', value: withPlans, sub: 'With subscription', borderColor: 'border-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', icon: icons.check },
    { label: 'Cities Covered', value: cities, sub: 'Across India', borderColor: 'border-amber-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', icon: icons.schools },
    { label: 'Monthly Revenue', value: formatINR(monthlyRev), sub: 'From monthly plans', borderColor: 'border-red-500', iconBg: 'bg-red-50', iconColor: 'text-red-500', icon: icons.revenue },
    { label: 'Yearly Revenue', value: formatINR(yearlyRev), sub: 'From yearly plans', borderColor: 'border-violet-500', iconBg: 'bg-violet-50', iconColor: 'text-violet-500', icon: icons.revenue },
    { label: 'Total Users', value: totalUsers, sub: 'Across all schools', borderColor: 'border-teal-500', iconBg: 'bg-teal-50', iconColor: 'text-teal-500', icon: icons.users },
  ];

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time summary of your School CRM platform</p>
      </div>

      {loadingStats ? <Spinner /> : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {/* Revenue Graph */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="font-bold text-slate-800 text-base">Monthly Revenue Trend</p>
              <p className="text-xs text-slate-400 mb-4">Based on school registrations — last 12 months</p>
              <RevenueChart data={revenue} />
            </div>
            {/* Donut */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="font-bold text-slate-800 text-base mb-4">Plan Distribution</p>
              {planDist.length > 0
                ? <DonutChart slices={planDist} />
                : <p className="text-slate-400 text-sm text-center py-8">No plan data yet</p>
              }
            </div>
          </div>

          {/* Users by Role */}
          {Object.keys(userRole).length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <p className="font-bold text-slate-800 text-base mb-4">Users by Role</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(userRole).map(([role, count]) => (
                  <div key={role} className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-center min-w-[110px]">
                    <p className="text-2xl font-extrabold text-indigo-600">{count}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Manage Subscription Modal ───────────────────────────────────────────────────
const ManageSubscriptionModal = ({ school, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    subscription_start_date: school.subscription_start_date ? school.subscription_start_date.split('T')[0] : '',
    subscription_end_date: school.subscription_end_date ? school.subscription_end_date.split('T')[0] : '',
    subscription_status: school.subscription_status || 'Active',
    is_active: school.is_active !== false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API}/super-admin/schools/${school.school_id}/subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) { onUpdated(); onClose(); }
      else setError(data.message || 'Failed to update subscription');
    } catch { setError('Server error'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Manage Subscription</h3>
            <p className="text-xs text-slate-400 mt-0.5">{school.school_name}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 text-slate-400 hover:text-slate-700">{icons.close}</button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
              <input type="date" value={form.subscription_start_date} onChange={e => setForm(f => ({ ...f, subscription_start_date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Date</label>
              <input type="date" value={form.subscription_end_date} onChange={e => setForm(f => ({ ...f, subscription_end_date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subscription Status</label>
            <div className="flex gap-2">
              {['Active', 'Trial', 'Expired', 'Suspended'].map(s => (
                <button key={s} type="button"
                  onClick={() => setForm(f => ({ ...f, subscription_status: s }))}
                  className={cls(
                    'px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
                    form.subscription_status === s
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  )}>{s}</button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 text-indigo-600 rounded" />
              <span className="text-sm font-semibold text-slate-700">Account Active (Allows login)</span>
            </label>
            <p className="text-xs text-slate-400 mt-1 ml-6">If unchecked, all users for this school will be locked out.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Schools View ──────────────────────────────────────────────────────────────
const SchoolsView = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [manageSub, setManageSub] = useState(null);

  const loadSchools = async () => {
    setLoading(true);
    const d = await authFetch(`${API}/super-admin/schools`).catch(() => null);
    if (d?.success) setSchools(d.data);
    setLoading(false);
  };

  useEffect(() => { loadSchools(); }, []);

  const filtered = schools.filter(s =>
    [s.school_name, s.admin_name, s.admin_email, s.city]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {manageSub && <ManageSubscriptionModal school={manageSub} onClose={() => setManageSub(null)} onUpdated={loadSchools} />}
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Registered Schools</h2>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} school(s) found</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">{icons.search}</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search schools..."
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-52"
            />
          </div>

          <Link to="/register-school" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            <span className="w-4 h-4">{icons.plus}</span> New School
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="text-5xl mb-3">🏫</span>
            <p className="font-medium text-slate-500">No schools registered yet.</p>
            <Link to="/register-school" className="mt-2 text-indigo-500 text-sm underline">Register first school →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  {['#', 'School', 'Admin', 'Location', 'Plan', 'Status', 'Expiry', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <React.Fragment key={s.school_id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{s.school_name || '—'}</p>
                        <p className="text-xs text-slate-400">{s.school_phone || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-700">{s.admin_name || '—'}</p>
                        <p className="text-xs text-slate-400">{s.admin_email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{s.city || '—'}</td>
                      <td className="px-4 py-3">
                        {s.plan_name ? <Badge text={s.plan_name} color="purple" /> : <span className="text-slate-400 text-xs">No Plan</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge text={s.subscription_status || 'Active'} color={
                          s.subscription_status === 'Active' ? 'green' : 
                          s.subscription_status === 'Trial' ? 'blue' : 
                          s.subscription_status === 'Suspended' ? 'yellow' : 'red'
                        } />
                        {!s.is_active && <span className="ml-2 text-xs font-bold text-red-500">(Locked)</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                        {formatDate(s.subscription_end_date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setManageSub(s)}
                            className="text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-md px-2 py-1 hover:bg-indigo-50 transition-colors">
                            Manage
                          </button>
                          <button onClick={() => setExpanded(expanded === s.school_id ? null : s.school_id)}
                            className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-md px-2 py-1 hover:bg-slate-50 transition-colors">
                            {expanded === s.school_id ? 'Hide' : 'Info'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expanded === s.school_id && (
                      <tr>
                        <td colSpan={8} className="bg-indigo-50/60 px-5 py-4 border-b border-indigo-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">🏫 School Details</p>
                              <div className="space-y-1.5">
                                <div className="flex justify-between gap-2 text-xs">
                                  <span className="text-slate-400">Email</span>
                                  <span className="text-slate-700 font-medium text-right">{s.school_email}</span>
                                </div>
                                <div className="flex justify-between gap-2 text-xs">
                                  <span className="text-slate-400">Phone</span>
                                  <span className="text-slate-700 font-medium text-right">{s.school_phone}</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">📅 Subscription Timeline</p>
                              <div className="space-y-1.5">
                                <div className="flex justify-between gap-2 text-xs">
                                  <span className="text-slate-400">Start Date</span>
                                  <span className="text-slate-700 font-medium text-right">{formatDate(s.subscription_start_date)}</span>
                                </div>
                                <div className="flex justify-between gap-2 text-xs">
                                  <span className="text-slate-400">End Date</span>
                                  <span className="text-slate-700 font-medium text-right">{formatDate(s.subscription_end_date)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Revenue View ──────────────────────────────────────────────────────────────
const RevenueView = () => {
  const [revenue, setRevenue] = useState([]);
  const [txns, setTxns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch(`${API}/super-admin/revenue/monthly`),
      authFetch(`${API}/super-admin/transactions`),
    ]).then(([r, t]) => {
      if (r.success) setRevenue(r.data);
      if (t.success) setTxns(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const monthly = txns?.data?.filter(t => t.billing_cycle === 'Monthly').length || 0;
  const yearly = txns?.data?.filter(t => t.billing_cycle === 'Yearly').length || 0;

  const cards = [
    { label: 'Total Revenue', value: formatINR(txns?.totalRevenue || 0), borderColor: 'border-indigo-500', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', icon: icons.revenue },
    { label: 'Monthly Billing', value: monthly, sub: 'schools', borderColor: 'border-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', icon: icons.revenue },
    { label: 'Yearly Billing', value: yearly, sub: 'schools', borderColor: 'border-amber-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', icon: icons.revenue },
    { label: 'Total Payments', value: txns?.count || 0, sub: 'transactions', borderColor: 'border-red-500', iconBg: 'bg-red-50', iconColor: 'text-red-500', icon: icons.txn },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Revenue & Billing</h2>
        <p className="text-slate-400 text-sm mt-1">Subscription revenue overview and monthly trend</p>
      </div>
      {loading ? <Spinner /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="font-bold text-slate-800 mb-1">Monthly Revenue Graph</p>
            <p className="text-xs text-slate-400 mb-4">Prorated monthly contribution from each school's plan</p>
            <RevenueChart data={revenue} />
          </div>
        </>
      )}
    </div>
  );
};

// ── Expiring Soon View ────────────────────────────────────────────────────────
const ExpiringSoonView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch(`${API}/super-admin/expiring-soon`)
      .then(r => { if (r.success) setData(r.data); else setError(r.message); setLoading(false); })
      .catch(() => { setError('Failed to load expiring soon data.'); setLoading(false); });
  }, []);

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 text-amber-500">{icons.warning}</span> Expiring Soon
        </h2>
        <p className="text-slate-400 text-sm mt-1">Subscriptions renewing within the next 30 days</p>
      </div>

      {loading ? <Spinner /> : error ? (
        <div className="bg-red-50 text-red-600 rounded-xl p-5 font-medium">{error}</div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-100">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg font-bold text-slate-700">All Clear!</p>
          <p className="text-slate-400 text-sm mt-1">No subscriptions expiring in the next 30 days.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((s, i) => {
            const days = getDaysLeft(s.next_renewal_date);
            const isUrgent = days !== null && days <= 7;
            return (
              <div key={i} className={cls(
                'bg-white rounded-xl p-5 shadow-sm border-l-4 flex flex-wrap items-center gap-5',
                isUrgent ? 'border-red-500' : 'border-amber-400'
              )}>
                <div className="flex-1 min-w-48">
                  <p className="font-bold text-slate-800 text-base">{s.school_name}</p>
                  <p className="text-xs text-slate-500 mt-1">Admin: {s.admin_name} · {s.admin_email}</p>
                  <p className="text-xs text-slate-500">📞 {s.admin_phone || '—'} · 📍 {s.city || '—'}</p>
                </div>
                <div className="text-center min-w-24">
                  <Badge text={s.plan_name} color="purple" />
                  <p className="text-xs text-slate-400 mt-1 capitalize">{s.billing_cycle}</p>
                </div>
                <div className="text-center min-w-28">
                  <p className="text-xs text-slate-400">Renewal Date</p>
                  <p className="font-bold text-slate-800 text-sm">{formatDate(s.next_renewal_date)}</p>
                </div>
                <div className="text-center min-w-20">
                  <p className={cls('text-3xl font-black', isUrgent ? 'text-red-500' : 'text-amber-500')}>
                    {days ?? '—'}
                  </p>
                  <p className="text-xs text-slate-400">days left</p>
                </div>
                <div className="text-right min-w-24">
                  <p className="text-xs text-slate-400">Amount Due</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {s.billing_cycle === 'Monthly' ? formatINR(s.monthly_price) : formatINR(s.yearly_price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Transaction Status Config ──────────────────────────────────────────────────
const TXN_STATUSES = [
  { value: 'Paid',      color: 'green',  dot: 'bg-emerald-500' },
  { value: 'Pending',   color: 'yellow', dot: 'bg-amber-400'   },
  { value: 'Overdue',   color: 'red',    dot: 'bg-red-500'     },
  { value: 'Cancelled', color: 'gray',   dot: 'bg-slate-400'   },
  { value: 'Refunded',  color: 'blue',   dot: 'bg-blue-400'    },
];
const txnStatusColor = (s) => TXN_STATUSES.find(x => x.value === s)?.color || 'gray';

// ── Add Transaction Modal ──────────────────────────────────────────────────────
const AddTransactionModal = ({ schoolAdmins, onClose, onSaved }) => {
  const [form, setForm] = useState({
    school_id: '', amount: '', billing_cycle: 'Monthly',
    status: 'Paid', payment_method: 'Online Transfer',
    payment_date: '', due_date: '', notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Auto-fill amount when school selected
  const handleSchoolSelect = (e) => {
    const schoolId = e.target.value;
    const school = schoolAdmins.find(a => String(a.school_id) === String(schoolId));
    let amount = '';
    if (school) {
      const planName = school.plan_name || '';
      // Use monthly_price or yearly_price based on billing cycle — stored in admin data
      // We'll just leave amount editable for flexibility
      amount = school.billing_cycle === 'Yearly' ? (school.yearly_price || '') : (school.monthly_price || '');
    }
    setForm(f => ({ ...f, school_id: schoolId, amount: amount || f.amount }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${API}/super-admin/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) { onSaved(); onClose(); }
      else setError(data.message || 'Failed to save');
    } catch { setError('Server error'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-extrabold text-slate-800">Add New Transaction</h3>
          <button onClick={onClose} className="w-7 h-7 text-slate-400 hover:text-slate-700 transition-colors">{icons.close}</button>
        </div>
        {/* Form */}
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          {/* School */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">School *</label>
            <select name="school_id" value={form.school_id} onChange={handleSchoolSelect} required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              <option value="">Select school...</option>
              {schoolAdmins.map(a => (
                <option key={a.school_id} value={a.school_id}>{a.school_name}</option>
              ))}
            </select>
          </div>

          {/* Amount + Billing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
              <input name="amount" type="number" value={form.amount} onChange={handle} required placeholder="0.00" min="0" step="0.01"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Billing Cycle</label>
              <select name="billing_cycle" value={form.billing_cycle} onChange={handle}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>

          {/* Status + Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handle}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                {TXN_STATUSES.map(s => <option key={s.value}>{s.value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method</label>
              <select name="payment_method" value={form.payment_method} onChange={handle}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                {['Online Transfer', 'Cash', 'Cheque', 'UPI', 'Bank Transfer', 'Card'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Date</label>
              <input name="payment_date" type="date" value={form.payment_date} onChange={handle}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
              <input name="due_date" type="date" value={form.due_date} onChange={handle}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={2} placeholder="Optional notes..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Update Status Modal ────────────────────────────────────────────────────────
const UpdateStatusModal = ({ txn, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    status: txn.status,
    payment_method: txn.payment_method || 'Online Transfer',
    payment_date: txn.payment_date ? txn.payment_date.split('T')[0] : '',
    notes: txn.notes || ''
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${API}/super-admin/transactions/${txn.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) { onUpdated(data.data); onClose(); }
      else setError(data.message || 'Failed to update');
    } catch { setError('Server error'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Update Transaction Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">{txn.invoice_no} · {txn.school_name}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 text-slate-400 hover:text-slate-700">{icons.close}</button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          {/* Status pills */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Status</label>
            <div className="flex flex-wrap gap-2">
              {TXN_STATUSES.map(s => (
                <button key={s.value} type="button"
                  onClick={() => setForm(f => ({ ...f, status: s.value }))}
                  className={cls(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
                    form.status === s.value
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  )}>
                  <span className={cls('w-2 h-2 rounded-full', s.dot)} />
                  {s.value}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method</label>
              <select value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                {['Online Transfer', 'Cash', 'Cheque', 'UPI', 'Bank Transfer', 'Card'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Date</label>
              <input type="date" value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Transactions View ─────────────────────────────────────────────────────────
const TransactionsView = ({ schoolAdmins }) => {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [statusTab,  setStatusTab]  = useState('All');
  const [showAdd,    setShowAdd]    = useState(false);
  const [updateTxn,  setUpdateTxn]  = useState(null);   // txn being updated
  const [deletingId, setDeletingId] = useState(null);
  const [toast,      setToast]      = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    const d = await authFetch(`${API}/super-admin/transactions`).catch(() => null);
    if (d?.success) setData(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Local search + status filter
  const allRows = data?.data || [];
  const filtered = allRows.filter(t => {
    const matchStatus = statusTab === 'All' || t.status === statusTab;
    const matchSearch = !search || [t.school_name, t.admin_name, t.admin_email, t.invoice_no, t.plan_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  // Summary cards from server-side summary
  const summary = data?.summary || [];
  const getSum  = (s) => summary.find(x => x.status === s) || { count: 0, total: 0 };

  // Export CSV
  const exportCSV = () => {
    const headers = ['Invoice', 'School', 'Admin', 'Admin Email', 'Plan', 'Billing', 'Amount', 'Status', 'Method', 'Payment Date', 'Due Date', 'Notes', 'Date'];
    const rows = filtered.map(t => [
      t.invoice_no, t.school_name, t.admin_name, t.admin_email, t.plan_name,
      t.billing_cycle, t.amount, t.status, t.payment_method,
      formatDate(t.payment_date), formatDate(t.due_date), t.notes || '',
      formatDate(t.transaction_date)
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token') || '';
      const res   = await fetch(`${API}/super-admin/transactions/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (d.success) { showToast('Transaction deleted'); load(); }
      else showToast(d.message || 'Failed to delete');
    } catch { showToast('Server error'); }
    setDeletingId(null);
  };

  const statusTabs = ['All', ...TXN_STATUSES.map(s => s.value)];

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[300] bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Modals */}
      {showAdd   && <AddTransactionModal schoolAdmins={schoolAdmins} onClose={() => setShowAdd(false)}   onSaved={() => { load(); showToast('Transaction added!'); }} />}
      {updateTxn && <UpdateStatusModal   txn={updateTxn}             onClose={() => setUpdateTxn(null)} onUpdated={(updated) => { setData(d => ({ ...d, data: d.data.map(t => t.id === updated.id ? { ...t, ...updated } : t) })); showToast('Status updated!'); }} />}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Transactions</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and track all subscription payments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">{icons.search}</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..."
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-52" />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <span className="w-4 h-4">{icons.refresh}</span>
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            <span className="w-4 h-4">{icons.plus}</span> Add Transaction
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {TXN_STATUSES.map(s => {
              const sum = getSum(s.value);
              return (
                <button key={s.value} onClick={() => setStatusTab(s.value === statusTab ? 'All' : s.value)}
                  className={cls(
                    'text-left p-4 rounded-xl border-2 transition-all cursor-pointer',
                    statusTab === s.value ? 'border-indigo-400 bg-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200'
                  )}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cls('w-2.5 h-2.5 rounded-full flex-shrink-0', s.dot)} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.value}</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-800">{parseInt(sum.count) || 0}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatINR(sum.total)}</p>
                </button>
              );
            })}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {statusTabs.map(tab => (
              <button key={tab} onClick={() => setStatusTab(tab)}
                className={cls(
                  'px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all flex-shrink-0',
                  statusTab === tab
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                )}>
                {tab}
                {tab === 'All' ? ` (${allRows.length})` : ` (${allRows.filter(t => t.status === tab).length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>Showing <strong className="text-slate-700">{filtered.length}</strong> transactions</span>
              {statusTab !== 'All' && (
                <span className="font-bold text-slate-700">
                  Total: {formatINR(filtered.reduce((s, t) => s + parseFloat(t.amount || 0), 0))}
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    {['#', 'Invoice', 'School', 'Admin', 'Plan', 'Amount', 'Method', 'Due Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-slate-400">
                        <div className="text-3xl mb-2">📭</div>
                        No transactions found
                      </td>
                    </tr>
                  ) : filtered.map((t, i) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3.5 text-slate-400 font-semibold text-xs">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {t.invoice_no || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800">{t.school_name}</p>
                        <p className="text-xs text-slate-400">{t.school_city || ''}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-slate-700">{t.admin_name || '—'}</p>
                        <p className="text-xs text-slate-400">{t.admin_email || ''}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        {t.plan_name ? <Badge text={t.plan_name} color="purple" /> : <span className="text-slate-400 text-xs">—</span>}
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{t.billing_cycle}</p>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-indigo-600 whitespace-nowrap">{formatINR(t.amount)}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{t.payment_method || '—'}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">{formatDate(t.due_date)}</td>
                      <td className="px-4 py-3.5">
                        <span className={cls(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap',
                          {
                            green:  'bg-emerald-50 text-emerald-700',
                            yellow: 'bg-amber-50 text-amber-700',
                            red:    'bg-red-50 text-red-600',
                            gray:   'bg-slate-100 text-slate-600',
                            blue:   'bg-blue-50 text-blue-700',
                          }[txnStatusColor(t.status)]
                        )}>
                          <span className={cls('w-1.5 h-1.5 rounded-full', TXN_STATUSES.find(x => x.value === t.status)?.dot || 'bg-slate-400')} />
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setUpdateTxn(t)} title="Update Status"
                            className="text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-md px-2.5 py-1 hover:bg-indigo-50 transition-colors whitespace-nowrap">
                            Update
                          </button>
                          <button onClick={() => handleDelete(t.id)} disabled={deletingId === t.id} title="Delete"
                            className="text-xs font-semibold text-red-500 border border-red-200 rounded-md px-2.5 py-1 hover:bg-red-50 transition-colors disabled:opacity-50">
                            {deletingId === t.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


// ── Users View ────────────────────────────────────────────────────────────────
const UsersView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    authFetch(`${API}/super-admin/users`)
      .then(r => { if (r.success) setData(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = (data?.data || []).filter(u =>
    (roleFilter === 'All' || u.role_name === roleFilter) &&
    [u.name, u.email, u.school_name, u.role_name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">User Handles</h2>
        <p className="text-slate-400 text-sm mt-1">All registered users across every school</p>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Role filter pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', ...Object.keys(data?.byRole || {})].map(role => (
              <button key={role}
                onClick={() => setRoleFilter(role)}
                className={cls(
                  'px-4 py-1.5 rounded-full text-xs font-bold border transition-all',
                  roleFilter === role
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                )}>
                {role} {role !== 'All' && <span className="opacity-70 font-normal">({data?.byRole[role]})</span>}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">{icons.search}</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-64" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-500">
              Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{data?.total || 0}</span> users
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    {['#', 'Name', 'Email', 'Phone', 'Role', 'School', 'Status', 'Joined'].map(h => (
                      <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-10 text-slate-400">No users found</td></tr>
                  ) : filtered.map((u, i) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-semibold">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={u.image || `https://api.dicebear.com/5.x/initials/svg?seed=${u.name}`} alt="" className="w-8 h-8 rounded-full border-2 border-slate-100" />
                          <span className="font-semibold text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">{u.phone || '—'}</td>
                      <td className="px-4 py-3"><Badge text={u.role_name} color="blue" /></td>
                      <td className="px-4 py-3 text-slate-500">{u.school_name || '—'}</td>
                      <td className="px-4 py-3"><Badge text={u.is_active ? 'Active' : 'Inactive'} color={u.is_active ? 'green' : 'red'} /></td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    group: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
      { id: 'schools', label: 'Total Schools', icon: icons.schools },
    ]
  },
  {
    group: 'FINANCE',
    items: [
      { id: 'revenue', label: 'Revenue', icon: icons.revenue },
      { id: 'txn', label: 'Transactions', icon: icons.txn },
    ]
  },
  {
    group: 'ALERTS',
    items: [
      { id: 'expiring', label: 'Expiring Soon', icon: icons.expiring, badge: '!' },
    ]
  },
  {
    group: 'MANAGE',
    items: [
      { id: 'users', label: 'User Handles', icon: icons.users },
      { id: 'settings', label: 'Settings', icon: icons.settings },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SuperAdmin() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [schoolAdmins, setSchoolAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchSchoolAdmins(); }, []);

  const fetchSchoolAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const d = await authFetch(`${API}/users/school-admins`);
      if (d.success) setSchoolAdmins(d.data);
    } catch (_) { }
    setLoadingAdmins(false);
  };

  const activeLabel = NAV_GROUPS.flatMap(g => g.items).find(n => n.id === activeView)?.label || 'Dashboard';

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView schoolAdmins={schoolAdmins} />;
      case 'schools': return <SchoolsView />;
      case 'revenue': return <RevenueView />;
      case 'txn': return <TransactionsView schoolAdmins={schoolAdmins} />;
      case 'expiring': return <ExpiringSoonView />;
      case 'users': return <UsersView />;
      case 'settings': return (
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Settings</h2>
          <p className="text-slate-400 text-sm">Platform configuration — coming soon</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={cls(
        'flex flex-col sticky top-0 h-screen flex-shrink-0 overflow-hidden transition-all duration-300 z-50',
        'bg-gradient-to-b from-slate-900 to-indigo-900',
        sidebarOpen ? 'w-60' : 'w-16'
      )}>

        {/* Logo + Toggle */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10 min-h-[64px]">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-lg flex-shrink-0">🎓</div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-extrabold text-sm leading-tight">School CRM</p>
              <p className="text-indigo-300 text-xs">Super Admin</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)}
            className="ml-auto text-indigo-300 hover:text-white transition-colors w-5 h-5 flex-shrink-0">
            {sidebarOpen ? icons.close : icons.menu}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_GROUPS.map(({ group, items }) => (
            <div key={group}>
              {sidebarOpen && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{group}</p>
              )}
              {items.map(item => {
                const active = activeView === item.id;
                return (
                  <button key={item.id} onClick={() => setActiveView(item.id)}
                    title={!sidebarOpen ? item.label : ''}
                    className={cls(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all border-l-[3px]',
                      sidebarOpen ? 'justify-start' : 'justify-center',
                      active
                        ? 'bg-indigo-500/25 text-indigo-100 border-indigo-400 font-semibold'
                        : 'text-indigo-300 border-transparent hover:bg-white/[0.07] hover:text-white'
                    )}>
                    <span className="w-[18px] h-[18px] flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                    {sidebarOpen && item.badge && (
                      <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Register School */}
        <div className="px-3 pb-2 border-t border-white/10 pt-3">
          <Link to="/register-school"
            title={!sidebarOpen ? 'Register New School' : ''}
            className={cls(
              'flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors',
              sidebarOpen ? 'justify-start' : 'justify-center'
            )}>
            <span className="w-4 h-4 flex-shrink-0">{icons.plus}</span>
            {sidebarOpen && 'New School'}
          </Link>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
            title={!sidebarOpen ? 'Logout' : ''}
            className={cls(
              'w-full flex items-center gap-2 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors',
              sidebarOpen ? 'justify-start' : 'justify-center'
            )}>
            <span className="w-4 h-4 flex-shrink-0">{icons.logout}</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-7 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-lg font-extrabold text-slate-800 leading-tight">{activeLabel}</p>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              {schoolAdmins.length} Schools Active
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm">
              SA
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 max-w-[1200px] w-full">
          {renderView()}
        </main>
      </div>

    </div>
  );
}
