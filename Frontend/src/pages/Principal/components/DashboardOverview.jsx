import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import StatCard from '../../../components/layout/StatCard';
import apiFetch from '../../../services/api';
import { QrCode, X } from 'lucide-react';

const panelStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  border: '1px solid rgba(255,255,255,0.5)',
  display: 'flex',
  flexDirection: 'column'
};

const panelTitleStyle = { margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };

const DashboardOverview = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrPayload, setQrPayload] = useState(null);
  const [data, setData] = useState({
    stats: { students: 0, teachers: 0, present: 0, absent: 0, feesCollected: 0, pendingFees: 0, passPercentage: '0%', teacherAttendance: '0%' },
    exams: [],
    notices: [],
    topStudents: [],
    weakStudents: [],
    monthlyAttendance: [],
    revenueGraph: [],
    pendingApprovals: [],
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await apiFetch('/principal/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('API not ready');
        const json = await res.json();
        setData({ ...json, loading: false });
      } catch (err) {
        // Fallback Mock Data
        setData({
          stats: { students: 1240, teachers: 85, present: 1150, absent: 90, feesCollected: 450000, pendingFees: 120000, passPercentage: '98%', teacherAttendance: '95%' },
          exams: [{ id: 1, title: 'Term 2 Final', date: '2026-12-15' }],
          notices: [{ id: 1, title: 'Sports Day', date: '2026-11-20' }],
          topStudents: [{ id: 1, name: 'Aarav Sharma', total_marks: 480 }],
          weakStudents: [{ id: 3, name: 'Rohan Kumar', failed_subjects: 2 }],
          monthlyAttendance: [{ month: 'Jan', pct: 92 }, { month: 'Feb', pct: 95 }],
          revenueGraph: [{ month: 'Jan', amount: 120000 }],
          pendingApprovals: [{ id: 1, title: 'Leave Request - John' }],
          loading: false
        });
      }
    };
    fetchData();
  }, []);

  const handleGenerateQR = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await apiFetch('/principal/attendance-qr', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setQrPayload(data.qrPayload);
            setShowQRModal(true);
        } else {
            alert('Failed to generate QR code');
        }
    } catch (err) {
        console.error("Error generating QR:", err);
        alert('Error generating QR code');
    }
  };

  if (data.loading) return <div style={{ padding: '24px', color: '#64748b' }}>Loading comprehensive dashboard data...</div>;

  return (
    <div className="dashboard-section animate-fade-in p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 m-0">Principal Dashboard</h2>
        <button 
            onClick={handleGenerateQR}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer border-none"
        >
            <QrCode size={18} />
            Generate Daily Attendance QR
        </button>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col items-center p-8 relative">
                <button 
                    onClick={() => setShowQRModal(false)} 
                    className="absolute top-4 right-4 p-1 hover:bg-slate-200 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                >
                    <X size={20} className="text-slate-500" />
                </button>
                <h3 className="font-bold text-xl text-slate-800 mb-2 mt-4 text-center">Daily Attendance QR</h3>
                <p className="text-slate-500 text-sm mb-8 text-center">Display this QR code for students and staff to scan using their mobile apps.</p>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    {qrPayload && <QRCode value={qrPayload} size={250} level="H" />}
                </div>
                
                <p className="text-xs text-slate-400 mt-8">Valid for today only ({new Date().toLocaleDateString()})</p>
            </div>
        </div>
      )}
      
      {/* Top Row: 3 Large Stat Cards (Matching User Sample) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard 
            title="Student Overview" 
            metrics={[
                { label: 'Total Students', value: data.stats.students.toLocaleString() },
                { label: 'Present Today', value: data.stats.present.toLocaleString() },
                { label: 'Absent Today', value: data.stats.absent.toLocaleString() },
                { label: 'Pass Percentage', value: data.stats.passPercentage }
            ]}
        />
        <StatCard 
            title="Financial Summary" 
            metrics={[
                { label: "Today's Collection", value: `₹${data.stats.feesCollected.toLocaleString()}` },
                { label: 'Pending Fees', value: `₹${data.stats.pendingFees.toLocaleString()}` }
            ]}
            bottomComponent={
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: '#475569', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
                </div>
            }
        />
        <StatCard 
            title="Staff Overview" 
            extraHeaderIcon={<span className="material-icons">refresh</span>}
            metrics={[
                { label: 'Total Teachers', value: data.stats.teachers.toLocaleString() },
                { label: 'Teacher Attendance', value: data.stats.teacherAttendance }
            ]}
            bottomComponent={
                <div style={{ textAlign: 'right' }}>
                    <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>View All Staff</a>
                </div>
            }
        />
      </div>

      {/* Middle Grid: 5 Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Top 10 Students */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Top 10 Students 🏆</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {data.topStudents.length === 0 ? <p className="text-slate-500">No result data available.</p> : (
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr style={{ color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 0' }}>Name</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topStudents.map((s, i) => (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td style={{ padding: '8px 0', fontWeight: '600', color: '#334155' }}>{i + 1}. {s.name}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>{s.total_marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Weak Students */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Weak Students Alerts ⚠️</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {data.weakStudents.length === 0 ? <p className="text-slate-500">No failing students found!</p> : (
              <ul className="list-none p-0 m-0">
                {data.weakStudents.map((s) => (
                  <li key={s.id} style={{ padding: '10px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#7f1d1d' }}>{s.name}</span>
                    <span style={{ fontSize: '12px', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>{s.failed_subjects} Fails</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Upcoming Exams 📝</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {data.exams.length === 0 ? <p className="text-slate-500">No upcoming exams scheduled.</p> : (
              <ul className="list-none p-0 m-0">
                {data.exams.map((e) => (
                  <li key={e.id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#334155' }}>{e.title}</span>
                    <span style={{ fontSize: '12px', color: '#6366f1', background: '#e0e7ff', padding: '2px 8px', borderRadius: '12px' }}>{new Date(e.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Recent Notices 📢</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {data.notices.length === 0 ? <p className="text-slate-500">No recent notices.</p> : (
              <ul className="list-none p-0 m-0">
                {data.notices.map((n) => (
                  <li key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#334155' }}>{n.title}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(n.date).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Pending Approvals ⏳</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {data.pendingApprovals.length === 0 ? <p className="text-slate-500">All caught up!</p> : (
              <ul className="list-none p-0 m-0">
                {data.pendingApprovals.map((p) => (
                  <li key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{p.title}</span>
                    <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Review</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: 2 Analytics Graphs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '24px' }}>
        
        {/* Monthly Attendance Graph */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Monthly Attendance % 📈</h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '20px 0 0', borderBottom: '2px solid #e2e8f0' }}>
            {data.monthlyAttendance.map((item, index) => {
              const heightPct = Math.min(100, Math.max(0, item.pct));
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{heightPct}%</div>
                  <div style={{ width: '100%', maxWidth: '40px', height: `${heightPct * 2}px`, background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', borderRadius: '8px 8px 0 0' }}></div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Graph */}
        <div className="glass-panel" style={panelStyle}>
          <h3 style={panelTitleStyle}>Fee Revenue (Past 6 Months) 📉</h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '20px 0 0', borderBottom: '2px solid #e2e8f0' }}>
            {data.revenueGraph.map((item, index) => {
              // Scale heights based on max revenue (assuming max ~250000 for visuals)
              const maxRev = Math.max(...data.revenueGraph.map(r => r.amount), 1);
              const heightPct = (item.amount / maxRev) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{(item.amount/1000).toFixed(0)}k</div>
                  <div style={{ width: '100%', maxWidth: '40px', height: `${heightPct * 2}px`, background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', borderRadius: '8px 8px 0 0' }}></div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
