import React from 'react';

const ExamsView = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Exams & Results</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#3b82f6', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🎫 Download Hall Ticket
                    </button>
                </div>
            </div>

            {/* Performance Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500', opacity: 0.9 }}>Class Rank</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>4th</p>
                    <p style={{ fontSize: '13px', margin: '8px 0 0 0', opacity: 0.8 }}>Out of 45 Students</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>🏆</span>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500', opacity: 0.9 }}>Overall Grade</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>A+</p>
                    <p style={{ fontSize: '13px', margin: '8px 0 0 0', opacity: 0.8 }}>Latest Semester</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>🌟</span>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500', opacity: 0.9 }}>Average Marks</h3>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>88.5%</p>
                    <p style={{ fontSize: '13px', margin: '8px 0 0 0', opacity: 0.8 }}>Top 10% in class</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>📈</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Results Section */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Latest Results (Mid-Term)</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                                🔄 Re-evaluation Request
                            </button>
                            <button style={{ padding: '6px 12px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                                ⬇️ Download Report Card
                            </button>
                        </div>
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '14px' }}>
                                <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Subject</th>
                                <th style={{ padding: '12px 16px' }}>Total Marks</th>
                                <th style={{ padding: '12px 16px' }}>Obtained Marks</th>
                                <th style={{ padding: '12px 16px' }}>Grade</th>
                                <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { subject: 'Mathematics', total: 100, obtained: 92, grade: 'A+' },
                                { subject: 'Physics', total: 100, obtained: 88, grade: 'A' },
                                { subject: 'Chemistry', total: 100, obtained: 85, grade: 'A' },
                                { subject: 'English', total: 100, obtained: 78, grade: 'B+' },
                                { subject: 'Computer Science', total: 100, obtained: 95, grade: 'A+' },
                            ].map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: '#334155' }}>{row.subject}</td>
                                    <td style={{ padding: '16px', color: '#64748b' }}>{row.total}</td>
                                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{row.obtained}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: row.grade.includes('A') ? '#10b981' : '#3b82f6' }}>{row.grade}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>Pass</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Upcoming Schedule */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1e293b' }}>Upcoming Exam Schedule</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { date: '12', month: 'NOV', title: 'Mathematics Final', time: '10:00 AM - 1:00 PM', type: 'Theory' },
                            { date: '15', month: 'NOV', title: 'Physics Practical', time: '09:00 AM - 12:00 PM', type: 'Practical' },
                            { date: '18', month: 'NOV', title: 'Chemistry Final', time: '10:00 AM - 1:00 PM', type: 'Theory' },
                        ].map((exam, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ background: 'white', color: '#3b82f6', minWidth: '50px', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{exam.month}</span>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: '1' }}>{exam.date}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{exam.title}</h4>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>⏰ {exam.time}</p>
                                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: exam.type === 'Theory' ? '#e0e7ff' : '#fce7f3', color: exam.type === 'Theory' ? '#4f46e5' : '#db2777', fontWeight: '600' }}>
                                        {exam.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamsView;
