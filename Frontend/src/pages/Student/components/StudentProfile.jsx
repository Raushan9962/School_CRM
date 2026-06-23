import React, { useState, useEffect } from 'react';
import { Camera, IdCard, FileText, Lock, Edit, User, Users, Bus, FolderOpen, File } from 'lucide-react';
import apiFetch from '../../../services/api';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const userObj = JSON.parse(userStr);
                    const res = await apiFetch(`/students/user/${userObj.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setStudent(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading profile...</div>;
    }

    if (!student) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>Profile not found.</div>;
    }

    // Default mock documents since there is no documents table
    const documents = ["Aadhar Card", "Previous Marksheet", "Transfer Certificate"];

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div className="relative">
                        <img src="https://ui-avatars.com/api/?name=${student.name}&background=random" alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f1f5f9' }} />
                        <button style={{ position: 'absolute', bottom: 0, right: 0, background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} title="Upload Profile Photo"><Camera size={16} /></button>
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a' }}>{student.name}</h2>
                        <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IdCard size={14} /> ID: STU-{student.id}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> Adm No: {student.admission_number || 'N/A'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Class: {student.class_name || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button style={{ padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#334155', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={16} /> Change Password
                    </button>
                    <button style={{ padding: '10px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        <Edit size={16} /> Update Request
                    </button>
                </div>
            </div>

            {/* Profile Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Personal Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}><User size={20} /> Personal Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <DetailItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'} />
                        <DetailItem label="Gender" value={student.gender || 'N/A'} />
                        <DetailItem label="Blood Group" value={student.blood_group || 'N/A'} />
                        <DetailItem label="Email" value={student.email || 'N/A'} />
                        <DetailItem label="Phone" value={student.phone || 'N/A'} fullWidth />
                        <DetailItem label="Address" value={student.address || 'N/A'} fullWidth />
                    </div>
                </div>

                {/* Parent & Emergency Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}><Users size={20} /> Parent Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        {/* If we had a specific parents table join, we would show father/mother. For now generic */}
                        <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                            Parent records are managed by the administration separately.
                        </div>
                    </div>
                </div>

                {/* Transport & Hostel Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}><Bus size={20} /> Transport & Hostel</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <DetailItem label="Transport Status" value="Not Opted" />
                        <DetailItem label="Hostel Status" value="Day Scholar" />
                    </div>
                </div>

                {/* Documents Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}><FolderOpen size={20} /> Submitted Documents</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {documents.map((doc, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <File size={20} color="#3b82f6" />
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>{doc}</span>
                                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#10b981', fontWeight: '600', background: '#d1fae5', padding: '2px 8px', borderRadius: '12px' }}>Verified</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, fullWidth }) => (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
        <p className="m-0 mb-1 text-[13px] text-slate-500">{label}</p>
        <p style={{ margin: 0, fontWeight: '500', color: '#334155', fontSize: '15px' }}>{value}</p>
    </div>
);

export default StudentProfile;
