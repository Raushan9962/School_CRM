import React from 'react';

const AssignmentsManagement = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Assignments</h2>
                <button style={{ padding: '10px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>+</span> Create New Assignment
                </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Algebra Chapter 4 Exercises</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Grade 10 - Section A • Due: Tomorrow</p>
                        </div>
                        <span style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>24</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Submitted</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>8</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Pending</p>
                            </div>
                        </div>
                        <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', background: 'transparent', borderRadius: '6px', cursor: 'pointer', color: '#334155', fontWeight: '500' }}>View Submissions</button>
                    </div>
                </div>

                <div style={{ padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Geometry Project</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Grade 10 - Section B • Due: 25 Oct 2026</p>
                        </div>
                        <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Upcoming</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>0</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Submitted</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>30</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Pending</p>
                            </div>
                        </div>
                        <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', background: 'transparent', borderRadius: '6px', cursor: 'pointer', color: '#334155', fontWeight: '500' }}>Edit Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentsManagement;
