import React, { useState, useEffect, useRef } from 'react';
import { Camera, IdCard, FileText, Lock, Edit, User, Users, Bus, FolderOpen, File, X } from 'lucide-react';
import apiFetch from '../../../services/api';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordStep, setPasswordStep] = useState(1);
    const [pwdEmail, setPwdEmail] = useState('');
    const [pwdOtp, setPwdOtp] = useState('');
    const [pwdNew, setPwdNew] = useState('');

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateFields, setUpdateFields] = useState({ phone: '', address: '' });

    const fileInputRef = useRef(null);

    const handleVerifyEmail = async () => {
        try {
            const res = await apiFetch('/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pwdEmail })
            });
            const data = await res.json();
            if (data.success) {
                alert(`OTP Sent! (Mocked: ${data.otp})`);
                setPasswordStep(2);
            } else {
                alert(data.message || 'Error verifying email');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleResetPassword = async () => {
        try {
            const res = await apiFetch('/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pwdEmail, otp: pwdOtp, newPassword: pwdNew })
            });
            const data = await res.json();
            if (data.success) {
                alert('Password reset successfully!');
                setShowPasswordModal(false);
                setPasswordStep(1);
            } else {
                alert(data.message || 'Error resetting password');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateRequest = async () => {
        try {
            const res = await apiFetch('/profile-updates/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ changes: updateFields })
            });
            const data = await res.json();
            if (data.success) {
                alert('Update request submitted successfully! Academic team will review it.');
                setShowUpdateModal(false);
            } else {
                alert(data.message || 'Error submitting request');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await apiFetch('/users/profile-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setStudent({ ...student, image: data.imageUrl });
                // Also update local storage user object if needed
                const userObj = JSON.parse(localStorage.getItem('user'));
                userObj.image = data.imageUrl;
                localStorage.setItem('user', JSON.stringify(userObj));
                // Reload page or just show success
            } else {
                alert(data.message || 'Error uploading image');
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleRemoveImage = async () => {
        try {
            const res = await apiFetch('/users/profile-image', {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setStudent({ ...student, image: data.imageUrl });
                const userObj = JSON.parse(localStorage.getItem('user'));
                userObj.image = data.imageUrl;
                localStorage.setItem('user', JSON.stringify(userObj));
            } else {
                alert(data.message || 'Error removing image');
            }
        } catch (error) {
            console.error("Error removing image:", error);
        }
    };

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
        return <div className="p-10 text-center text-slate-500 font-medium text-sm">Loading profile...</div>;
    }

    if (!student) {
        return <div className="p-10 text-center text-red-500 font-bold text-sm bg-red-50 rounded-lg">Profile not found.</div>;
    }

    // Default mock documents since there is no documents table
    const documents = ["Aadhar Card", "Previous Marksheet", "Transfer Certificate"];

    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            {/* Header & Actions */}
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=random`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white border-none rounded-full w-8 h-8 cursor-pointer flex items-center justify-center shadow hover:bg-blue-700 transition-colors" title="Upload Profile Photo"><Camera size={14} /></button>
                    </div>
                    <div>
                        <h2 className="m-0 mb-2 text-2xl font-bold text-slate-800">{student.name}</h2>
                        <div className="flex flex-wrap gap-4 text-slate-500 text-xs font-bold">
                            <span className="flex items-center gap-1.5"><IdCard size={14} className="text-blue-500" /> ID: STU-{student.id}</span>
                            <span className="flex items-center gap-1.5"><FileText size={14} className="text-purple-500" /> Adm No: {student.admission_number || 'N/A'}</span>
                            <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Class: {student.class_name || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                        <Lock size={14} className="text-slate-500" /> Change Password
                    </button>
                    <button onClick={() => setShowUpdateModal(true)} className="px-4 py-2 bg-blue-600 border-none rounded text-white text-xs font-bold cursor-pointer flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                        <Edit size={14} /> Update Request
                    </button>
                </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Personal Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="m-0 mb-5 text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100"><User size={16} className="text-blue-600" /> Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'} />
                        <DetailItem label="Gender" value={student.gender || 'N/A'} />
                        <DetailItem label="Blood Group" value={student.blood_group || 'N/A'} />
                        <DetailItem label="Email" value={student.email || 'N/A'} />
                        <DetailItem label="Phone" value={student.phone || 'N/A'} fullWidth />
                        <DetailItem label="Address" value={student.address || 'N/A'} fullWidth />
                    </div>
                </div>

                {/* Right Column Stack */}
                <div className="flex flex-col gap-5">
                    {/* Parent & Emergency Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="m-0 mb-5 text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100"><Users size={16} className="text-purple-600" /> Parent Details</h3>
                        <div className="text-xs text-slate-500 font-medium italic bg-slate-50 p-4 rounded border border-slate-100 text-center">
                            Parent records are managed by the administration separately.
                        </div>
                    </div>

                    {/* Transport & Hostel Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="m-0 mb-5 text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100"><Bus size={16} className="text-amber-500" /> Transport & Hostel</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Transport Status" value="Not Opted" />
                            <DetailItem label="Hostel Status" value="Day Scholar" />
                        </div>
                    </div>

                    {/* Documents Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h3 className="m-0 mb-5 text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100"><FolderOpen size={16} className="text-emerald-500" /> Submitted Documents</h3>
                        <div className="flex flex-col gap-3">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100 transition-colors hover:bg-slate-100">
                                    <File size={16} className="text-blue-500" />
                                    <span className="text-xs font-bold text-slate-700">{doc}</span>
                                    <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">Verified</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6 relative shadow-xl">
                        <button onClick={() => { setShowPasswordModal(false); setPasswordStep(1); }} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Change Password</h3>
                        
                        {passwordStep === 1 ? (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter your email to verify</label>
                                    <input type="email" value={pwdEmail} onChange={e => setPwdEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <button onClick={handleVerifyEmail} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors cursor-pointer mt-2 shadow-sm">Verify Email</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter OTP</label>
                                    <input type="text" value={pwdOtp} onChange={e => setPwdOtp(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                                    <input type="password" value={pwdNew} onChange={e => setPwdNew(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <button onClick={handleResetPassword} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold transition-colors cursor-pointer mt-2 shadow-sm">Reset Password</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Update Request Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6 relative shadow-xl">
                        <button onClick={() => setShowUpdateModal(false)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Request Profile Update</h3>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Phone Number</label>
                                <input type="text" value={updateFields.phone} onChange={e => setUpdateFields({...updateFields, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Leave blank if no change" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Address</label>
                                <input type="text" value={updateFields.address} onChange={e => setUpdateFields({...updateFields, address: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Leave blank if no change" />
                            </div>
                            
                            <button onClick={handleUpdateRequest} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors cursor-pointer mt-2 shadow-sm">Submit Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value, fullWidth }) => (
    <div className={fullWidth ? 'col-span-1 md:col-span-2' : ''}>
        <p className="m-0 mb-1 text-[10px] uppercase font-bold text-slate-400">{label}</p>
        <p className="m-0 font-bold text-slate-800 text-sm">{value}</p>
    </div>
);

export default StudentProfile;
