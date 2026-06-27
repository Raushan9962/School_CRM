import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Lock, Edit, CreditCard, BookOpen, FileText } from 'lucide-react';
import apiFetch from '../../../services/api';

const TeacherProfile = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const [userImage, setUserImage] = useState('https://ui-avatars.com/api/?name=Anita+Sharma&background=10B981&color=fff&size=128');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            if (userObj.image) setUserImage(userObj.image);
        }
    }, []);

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
                setUserImage(data.imageUrl);
                const userObj = JSON.parse(localStorage.getItem('user'));
                userObj.image = data.imageUrl;
                localStorage.setItem('user', JSON.stringify(userObj));
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
                setUserImage(data.imageUrl);
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teacher = {
        name: user.name || "Anita Sharma",
        employeeId: "EMP-2023-045",
        department: "Science",
        designation: "Senior Science Teacher",
        qualification: "M.Sc. Physics, B.Ed.",
        experience: "8 Years",
        dob: "15-Aug-1985",
        gender: "Female",
        bloodGroup: "O+",
        contact: {
            email: user.email || "anita.sharma@vidyasetu.edu",
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
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="m-0 text-xl font-bold text-slate-900 tracking-tight">My Profile</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                        <Lock size={16} /> Change Password
                    </button>
                    <button className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                        <Edit size={16} /> Update Profile
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-700 w-full"></div>
                
                <div className="px-6 sm:px-8 pb-8 relative">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-12 sm:-mt-16 mb-4 gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md mx-auto sm:mx-0">
                                <img src={userImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white border-2 border-white flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="text-center sm:text-left pb-1">
                                <h1 className="m-0 mb-1.5 text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{teacher.name}</h1>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-slate-500 text-sm font-semibold">
                                    <span className="flex items-center gap-1.5"><CreditCard size={16} /> {teacher.employeeId}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1.5"><BookOpen size={16} /> {teacher.department} Department</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 mb-4 flex overflow-x-auto hide-scrollbar">
                        <div className="flex gap-4 sm:gap-8">
                            {['personal', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 text-[15px] font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                        activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab === 'personal' ? 'Professional & Personal Details' : 'Documents'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'personal' && (
                        <div className="flex flex-col gap-8">
                            <div>
                                <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Professional Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Designation</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.designation}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Qualification</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.qualification}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Experience</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.experience}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 m-0" />

                            <div>
                                <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.dob}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Gender</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.gender}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Blood Group</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.bloodGroup}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 m-0" />

                            <div>
                                <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.contact.email}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800">{teacher.contact.phone}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 md:col-span-2">
                                        <p className="m-0 mb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Residential Address</p>
                                        <p className="m-0 text-[15px] font-bold text-slate-800 leading-relaxed">{teacher.contact.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Uploaded Documents</h3>
                            <div className="flex flex-col gap-3">
                                {teacher.documents.map((doc, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-slate-200 rounded-xl bg-slate-50 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="m-0 mb-1 text-[15px] font-bold text-slate-800">{doc.name}</h4>
                                                <p className="m-0 text-[13px] font-medium text-slate-500">Uploaded on: {doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                                            <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                                                doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {doc.status}
                                            </span>
                                            <button className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                                                View
                                            </button>
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
