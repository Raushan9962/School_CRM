import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Key, AlertTriangle, CheckCircle2, Award } from 'lucide-react';

const TeacherProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/profile', { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (!d.data || Object.keys(d.data).length === 0) {
                        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                        setProfile({
                            name: localUser.name || 'Teacher',
                            email: localUser.email || 'teacher@school.com',
                            phone: '9876543210',
                            address: '123 Education Lane, Learning City',
                            designation: 'Senior Teacher',
                            joined_date: '2020-05-15',
                            department: 'Science & Mathematics',
                            qualifications: 'M.Sc. Physics, B.Ed.'
                        });
                    } else {
                        setProfile(d.data);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleChangePassword = () => {
        setMsg('error:Password change is currently disabled for demo purposes.');
        setTimeout(() => setMsg(''), 3000);
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const sectionTitleStyle = { fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading profile...</div>;
    }

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>My Profile</h2>
                    <p style={subTitleStyle}>Manage your personal and professional details</p>
                </div>
            </div>

            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />} {msgText}
                </div>
            )}

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Left Col: Profile Summary */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            {profile?.name?.[0]?.toUpperCase()}
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{profile?.name}</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>{profile?.designation}</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'left', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#475569' }}>
                                <Mail size={16} color="#94a3b8" /> {profile?.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#475569' }}>
                                <Phone size={16} color="#94a3b8" /> {profile?.phone || 'Not provided'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#475569' }}>
                                <MapPin size={16} color="#94a3b8" /> {profile?.address || 'Not provided'}
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={sectionTitleStyle}><Key size={18} color="#3b82f6" /> Security Settings</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Keep your account secure by updating your password regularly.</p>
                        <button onClick={handleChangePassword} style={{ width: '100%', padding: '10px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 'bold', color: '#334155', cursor: 'pointer', transition: 'all 0.2s' }}>
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Right Col: Professional Details */}
                <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                            <h3 style={sectionTitleStyle}><Briefcase size={18} color="#3b82f6" /> Professional Information</h3>
                        </div>
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Department</label>
                                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{profile?.department || 'General'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Designation</label>
                                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{profile?.designation || 'Teacher'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date of Joining</label>
                                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={16} color="#64748b" /> {profile?.joined_date ? new Date(profile.joined_date).toLocaleDateString('en-IN') : '—'}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Qualifications</label>
                                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Award size={16} color="#64748b" /> {profile?.qualifications || 'B.Ed'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                            <h3 style={sectionTitleStyle}><User size={18} color="#3b82f6" /> Edit Profile (Demo)</h3>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Full Name</label>
                                    <input type="text" value={profile?.name || ''} readOnly style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#64748b', cursor: 'not-allowed' }} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Phone Number</label>
                                    <input type="text" value={profile?.phone || ''} readOnly style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#64748b', cursor: 'not-allowed' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Residential Address</label>
                                <textarea rows={2} value={profile?.address || ''} readOnly style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#64748b', cursor: 'not-allowed', resize: 'none' }} />
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Note: Profile editing is restricted to School Admin only. Please contact administration to update these details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
