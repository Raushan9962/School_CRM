import React from 'react';

const AssignmentsView = () => {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#0f172a' }}>Assignments & Homework</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            📝
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>Algebra Chapter 4 Exercises</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Mathematics • Mrs. Smith</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Pending</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>Due Tomorrow</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            🧪
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>Biology Lab Report</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Science • Mr. Johnson</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Pending</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Due in 3 days</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', opacity: 0.7 }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            📚
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#64748b', textDecoration: 'line-through' }}>Read Chapter 2</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>English • Ms. Davis</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>Submitted</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Submitted 2 days ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentsView;
