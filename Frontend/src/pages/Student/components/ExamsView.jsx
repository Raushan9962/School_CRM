import React from 'react';

const ExamsView = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#0f172a' }}>Examinations & Grades</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Recent Results</h3>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 style={{ margin: 0, color: '#334155', fontSize: '16px' }}>Mid-Term Exam</h4>
                            <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Passed</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b' }}>Mathematics</span>
                                <span style={{ fontWeight: '600' }}>85/100</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b' }}>Science</span>
                                <span style={{ fontWeight: '600' }}>92/100</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b' }}>English</span>
                                <span style={{ fontWeight: '600' }}>78/100</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b' }}>History</span>
                                <span style={{ fontWeight: '600' }}>88/100</span>
                            </li>
                        </ul>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', marginTop: '8px', fontWeight: 'bold', color: '#0f172a' }}>
                            <span>Total Percentage</span>
                            <span>85.75%</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Upcoming Exams</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #f59e0b', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px 12px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', fontWeight: '600' }}>OCT</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>12</div>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#334155' }}>Mathematics Final</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>10:00 AM - 1:00 PM</p>
                            </div>
                        </div>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', fontWeight: '600' }}>OCT</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>15</div>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#334155' }}>Science Practical</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>09:00 AM - 12:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamsView;
