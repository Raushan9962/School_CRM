import React, { useState } from 'react';

const StudentPerformance = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Student Performance</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                    <option>Class 10 - A</option>
                    <option>Class 9 - B</option>
                </select>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                    <option>Top Performers</option>
                    <option>Needs Improvement</option>
                    <option>All Students</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Mock Students */}
                {[
                    { name: 'Rohan Gupta', status: 'Top Performer', avgMarks: '95%', attendance: '98%', trend: '📈 Consistent' },
                    { name: 'Ishaan Singh', status: 'Needs Improvement', avgMarks: '65%', attendance: '78%', trend: '📉 Dropping in Physics' }
                ].map((student, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>{student.name}</h3>
                                <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: student.status === 'Top Performer' ? '#dcfce7' : '#fee2e2', color: student.status === 'Top Performer' ? '#166534' : '#dc2626' }}>
                                    {student.status}
                                </span>
                            </div>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                👨‍🎓
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#64748b' }}>Avg. Marks:</span>
                                <span style={{ fontWeight: '600', color: '#0f172a' }}>{student.avgMarks}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#64748b' }}>Attendance:</span>
                                <span style={{ fontWeight: '600', color: '#0f172a' }}>{student.attendance}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#64748b' }}>Trend:</span>
                                <span style={{ fontWeight: '600', color: '#0f172a' }}>{student.trend}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ flex: 1, padding: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View Detailed Report</button>
                            <button onClick={() => { setSelectedStudent(student.name); setIsRemarkModalOpen(true); }} style={{ flex: 1, padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Add Remark</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Remark Modal */}
            {isRemarkModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Add Remark & Recommendation</h3>
                            <button onClick={() => setIsRemarkModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', fontWeight: '500', fontSize: '15px' }}>
                                Student: {selectedStudent}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Remark/Observation</label>
                                <textarea rows="3" placeholder="e.g. Needs to focus more on numericals..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Improvement Plan Recommendation</label>
                                <textarea rows="3" placeholder="e.g. Practice Chapter 4 exercises daily..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsRemarkModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsRemarkModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Remark</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPerformance;
