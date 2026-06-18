import React, { useState } from 'react';

const ExamManagement = () => {
    const [activeTab, setActiveTab] = useState('marks');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Exam Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📊 Generate Report Cards
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ➕ Create Exam
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['marks', 'schedule', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? '#10b981' : 'white',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: activeTab === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'marks' ? 'Enter/Update Marks' : tab === 'schedule' ? 'Exam Schedules' : 'Subject Analytics'}
                    </button>
                ))}
            </div>

            {activeTab === 'marks' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                            <option>Class 10 - A</option>
                            <option>Class 9 - B</option>
                        </select>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                            <option>Unit Test 2</option>
                            <option>Half Yearly</option>
                        </select>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                            <option>Science</option>
                            <option>Physics</option>
                        </select>
                        <button style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Fetch List</button>
                    </div>

                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Unit Test 2 - Science (Max Marks: 40)</h3>
                            <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Publish Results</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Roll No</th>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student Name</th>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Marks Obtained</th>
                                    <th style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { roll: 1, name: 'Aarav Patel', marks: 38 },
                                    { roll: 2, name: 'Diya Sharma', marks: 35 },
                                    { roll: 3, name: 'Rohan Gupta', marks: '' }
                                ].map((student, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.roll}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{student.name}</td>
                                        <td style={{ padding: '16px' }}>
                                            <input type="number" defaultValue={student.marks} placeholder="Enter marks" style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100px', outline: 'none' }} />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <input type="text" placeholder="Add remark..." style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', outline: 'none' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ padding: '4px 8px', background: '#eff6ff', color: '#3b82f6', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Upcoming</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>25-Oct-2026</span>
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Unit Test 2</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Class 10 - A • Science</p>
                    </div>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Draft</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>10-Nov-2026</span>
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Half Yearly</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Class 9 - B • Physics</p>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Subject Analytics</h3>
                    <p style={{ margin: 0 }}>Charts showing average marks, pass percentages, and subject performance will appear here.</p>
                </div>
            )}

            {/* Create Exam Modal */}
            {isCreateModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Create Exam</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Exam Type</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Unit Test</option>
                                    <option>Half Yearly</option>
                                    <option>Final Exam</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Class</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Class 10 - A</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Exam Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Max Marks</label>
                                    <input type="number" placeholder="e.g. 100" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Exam</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
