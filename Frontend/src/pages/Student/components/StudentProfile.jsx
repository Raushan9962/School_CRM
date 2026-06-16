import React from 'react';

const StudentProfile = () => {
    return (
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '24px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '36px', fontWeight: 'bold' }}>
                    S
                </div>
                <div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a' }}>John Doe</h2>
                    <p style={{ margin: 0, fontSize: '16px', color: '#64748b', display: 'flex', gap: '16px' }}>
                        <span>Grade: 10th - A</span>
                        <span>Roll No: 42</span>
                    </p>
                </div>
            </div>
            
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Date of Birth</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>15 May 2010</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Blood Group</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>O+</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Address</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>123 Main Street, Cityville</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Contact Number</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>+1 234 567 8900</p>
                </div>
            </div>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Parent/Guardian Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Father's Name</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>Richard Doe</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Mother's Name</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>Jane Doe</p>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#94a3b8' }}>Parent Contact</p>
                    <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>+1 987 654 3210</p>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
