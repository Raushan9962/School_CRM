import React, { useState } from 'react';

const AssignmentManagement = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const assignments = [
        { id: 'ASN-001', title: 'Newton\'s Laws of Motion', class: 'Class 10 - A', dueDate: '25-Oct-2026', total: 45, submitted: 40, pending: 5, status: 'Active' },
        { id: 'ASN-002', title: 'Chemical Reactions', class: 'Class 9 - B', dueDate: '20-Oct-2026', total: 40, submitted: 40, pending: 0, status: 'Closed' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Assignment Management</h2>
                <button onClick={() => setIsCreateModalOpen(true)} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    ➕ Create Assignment
                </button>
            </div>

            {/* Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📋</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Total Assignments</p>
                        <h3 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>12</h3>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⏳</div>
                    <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Pending Reviews</p>
                        <h3 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>28</h3>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                    {['list', 'review'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '8px 16px',
                                background: activeTab === tab ? '#eff6ff' : 'transparent',
                                color: activeTab === tab ? '#3b82f6' : '#64748b',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab === 'list' ? 'All Assignments' : 'Review Submissions'}
                        </button>
                    ))}
                </div>

                {activeTab === 'list' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Assignment Details</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Class</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Due Date</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Stats (Sub/Pen)</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((asn, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '500', color: '#1e293b' }}>{asn.title}</p>
                                        <span style={{ fontSize: '12px', color: '#64748b' }}>{asn.id}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{asn.class}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>{asn.dueDate}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                            <span style={{ color: '#10b981', fontWeight: '600' }}>{asn.submitted}</span> /
                                            <span style={{ color: '#ef4444', fontWeight: '600' }}>{asn.pending}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: asn.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: asn.status === 'Active' ? '#166534' : '#64748b' }}>
                                            {asn.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'review' && (
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>I</div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>Ishaan Singh (Roll No: 4)</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Submitted "Newton's Laws of Motion" • 2 hours ago</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px', color: '#475569', fontSize: '13px', cursor: 'pointer' }}>View File</button>
                                <input type="number" placeholder="Marks/10" style={{ width: '80px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} />
                                <button style={{ padding: '6px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Assignment Modal */}
            {isCreateModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Create New Assignment</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Select Class</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Class 10 - A (Science)</option>
                                    <option>Class 9 - B (Physics)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Assignment Title</label>
                                <input type="text" placeholder="e.g. Chapter 1 Exercise" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Description</label>
                                <textarea rows="3" placeholder="Instructions for students..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Due Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Total Marks</label>
                                    <input type="number" placeholder="e.g. 10" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Attachment (Optional)</label>
                                <input type="file" style={{ fontSize: '14px', color: '#64748b' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentManagement;
