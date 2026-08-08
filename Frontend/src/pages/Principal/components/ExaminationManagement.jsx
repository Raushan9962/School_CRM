import React, { useState, useEffect } from 'react';
import { FileText, Megaphone, TrendingUp, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const ExaminationManagement = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [exRes, clsRes] = await Promise.all([
                    apiFetch('/exams'),
                    apiFetch('/classes')
                ]);
                
                const exData = await exRes.json();
                const clsData = await clsRes.json();
                
                if (Array.isArray(exData)) setExams(exData);
                else if (exData.success) setExams(exData.data || []);
                else setExams([]);
                
                if (Array.isArray(clsData)) setClasses(clsData);
                else if (clsData.success) setClasses(clsData.data || []);
                else setClasses([]);
                
            } catch (err) {
                console.error("Failed to fetch exams for marks status", err);
                setExams([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Inline style objects mapping standard Tailwind
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Examination Management</h2>
                    <p style={subTitleStyle}>Manage exam schedules, publish results, and analyze performance</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ ...btnPrimary, background: 'white', color: '#1e293b', border: '1px solid #cbd5e1' }}>
                        <Megaphone size={16} /> Publish Results
                    </button>
                    <button style={btnPrimary}>
                        <FileText size={16} /> Create Exams
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Upcoming Exams</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{exams.filter(e => e.status !== 'Completed').length}</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Megaphone size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending Results</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>1</h3>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Avg. Performance</p>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>76.4%</h3>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} className="text-slate-500" /> Exam Schedules & Results
                    </h3>
                </div>
                
                {loading ? (
                    <div style={{ padding: '30px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading exams...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Exam Name</th>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Classes</th>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Start Date</th>
                                    <th style={{ padding: '10px 16px', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No exams found.</td></tr>
                                ) : (
                                    exams.map(e => {
                                        const cls = classes.find(c => c.id === e.class_id);
                                        const status = e.status || 'Upcoming';
                                        return (
                                        <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50 transition-colors">
                                            <td style={{ padding: '12px 16px' }}>
                                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{e.name}</p>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                {cls ? `${cls.name} (${cls.section})` : 'All Classes'}
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                                {e.date ? new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ 
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                                                    background: status === 'Completed' ? '#dcfce7' : (status === 'Upcoming' ? '#fef3c7' : '#e0f2fe'),
                                                    color: status === 'Completed' ? '#166534' : (status === 'Upcoming' ? '#92400e' : '#075985'),
                                                    border: `1px solid ${status === 'Completed' ? '#bbf7d0' : (status === 'Upcoming' ? '#fde68a' : '#bae6fd')}`
                                                }}>
                                                    {status === 'Completed' ? <CheckCircle2 size={12} /> : (status === 'Upcoming' ? <Clock size={12} /> : <AlertCircle size={12} />)}
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    )})
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExaminationManagement;
