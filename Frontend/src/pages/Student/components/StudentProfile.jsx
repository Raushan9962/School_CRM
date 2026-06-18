import React from 'react';

const StudentProfile = () => {
    const student = {
        studentId: "STU2026001",
        admissionNo: "ADM-9988",
        name: "Rahul Kumar",
        dob: "15 May 2010",
        gender: "Male",
        bloodGroup: "O+",
        address: "123 Main Street, Cityville, State, 12345",
        fatherName: "Rajesh Kumar",
        motherName: "Sunita Devi",
        emergencyContact: "+91 9876543210",
        transport: { route: "Route A", stop: "City Center", busNo: "Bus-05" },
        hostel: { status: "Day Scholar", roomNo: "N/A" },
        documents: ["Aadhar Card", "Previous Marksheet", "Transfer Certificate"]
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <img src="https://ui-avatars.com/api/?name=Rahul+Kumar&background=0D8ABC&color=fff&size=128" alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f1f5f9' }} />
                        <button style={{ position: 'absolute', bottom: 0, right: 0, background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} title="Upload Profile Photo">📷</button>
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a' }}>{student.name}</h2>
                        <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🆔 ID: {student.studentId}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📝 Adm No: {student.admissionNo}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#334155', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🔒 Change Password
                    </button>
                    <button style={{ padding: '10px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ✏️ Update Request
                    </button>
                </div>
            </div>

            {/* Profile Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Personal Info */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>👤 Personal Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <DetailItem label="Date of Birth" value={student.dob} />
                        <DetailItem label="Gender" value={student.gender} />
                        <DetailItem label="Blood Group" value={student.bloodGroup} />
                        <DetailItem label="Address" value={student.address} fullWidth />
                    </div>
                </div>

                {/* Parent & Emergency Info */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>👨‍👩‍👦 Parent & Contact Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <DetailItem label="Father's Name" value={student.fatherName} />
                        <DetailItem label="Mother's Name" value={student.motherName} />
                        <DetailItem label="Emergency Contact" value={student.emergencyContact} fullWidth />
                    </div>
                </div>

                {/* Transport & Hostel Info */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>🚌 Transport & Hostel</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <DetailItem label="Transport Status" value={student.transport.route ? "Opted" : "Not Opted"} />
                        <DetailItem label="Bus Number" value={student.transport.busNo} />
                        <DetailItem label="Pickup Point" value={student.transport.stop} fullWidth />
                        <DetailItem label="Hostel Status" value={student.hostel.status} />
                        <DetailItem label="Room No." value={student.hostel.roomNo} />
                    </div>
                </div>

                {/* Documents Info */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>📁 Submitted Documents</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {student.documents.map((doc, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '20px' }}>📄</span>
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
        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>{label}</p>
        <p style={{ margin: 0, fontWeight: '500', color: '#334155', fontSize: '15px' }}>{value}</p>
    </div>
);

export default StudentProfile;
