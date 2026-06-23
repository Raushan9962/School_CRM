import React, { useState } from 'react';

const TeacherProfile = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const teacher = {
        name: "Anita Sharma",
        employeeId: "EMP-2023-045",
        department: "Science",
        designation: "Senior Science Teacher",
        qualification: "M.Sc. Physics, B.Ed.",
        experience: "8 Years",
        dob: "15-Aug-1985",
        gender: "Female",
        bloodGroup: "O+",
        contact: {
            email: "anita.sharma@vidyasetu.edu",
            phone: "+91 98765 43210",
            address: "123, Rose Villa, Green Park Avenue, New Delhi - 110016"
        },
        documents: [
            { name: 'Aadhar Card', status: 'Verified', date: '10-Jan-2023' },
            { name: 'PAN Card', status: 'Verified', date: '10-Jan-2023' },
            { name: 'Degree Certificates', status: 'Verified', date: '15-Jan-2023' },
            { name: 'Experience Letter', status: 'Pending Review', date: '10-Oct-2026' }
        ]
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">My Profile</h2>
                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🔒 Change Password
                    </button>
                    <button style={{ padding: '8px 16px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(16,185,129,0.2)' }}>
                        📝 Update Profile Request
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div style={{ height: '120px', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}></div>
                
                <div style={{ padding: '0 32px 32px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-40px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                            <div className="relative">
                                <img src="https://ui-avatars.com/api/?name=Anita+Sharma&background=10B981&color=fff&size=128" alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                <button style={{ position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: '50%', background: '#3b82f6', color: 'white', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    📷
                                </button>
                            </div>
                            <div style={{ paddingBottom: '8px' }}>
                                <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a' }}>{teacher.name}</h1>
                                <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                                    <span>🆔 {teacher.employeeId}</span>
                                    <span>📚 {teacher.department} Department</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            {['personal', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '12px 0',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid #10b981' : '2px solid transparent',
                                        color: activeTab === tab ? '#10b981' : '#64748b',
                                        fontWeight: activeTab === tab ? '600' : '500',
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {tab === 'personal' ? 'Professional & Personal Details' : 'Documents'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'personal' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Professional Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Designation</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.designation}</p>
                                    </div>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Qualification</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.qualification}</p>
                                    </div>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Experience</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.experience}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#e2e8f0' }}></div>

                            <div>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Personal Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Date of Birth</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.dob}</p>
                                    </div>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Gender</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.gender}</p>
                                    </div>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Blood Group</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.bloodGroup}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#e2e8f0' }}></div>

                            <div>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Contact Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Email</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.contact.email}</p>
                                    </div>
                                    <div>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Phone Number</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{teacher.contact.phone}</p>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <p className="m-0 mb-1 text-[13px] text-slate-500">Residential Address</p>
                                        <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500', lineHeight: '1.5' }}>{teacher.contact.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 className="m-0 text-lg text-slate-800">Uploaded Documents</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {teacher.documents.map((doc, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                                📄
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{doc.name}</h4>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Uploaded on: {doc.date}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: doc.status === 'Verified' ? '#dcfce7' : '#fef3c7', color: doc.status === 'Verified' ? '#166534' : '#d97706' }}>
                                                {doc.status}
                                            </span>
                                            <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontSize: '13px', cursor: 'pointer' }}>View</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
