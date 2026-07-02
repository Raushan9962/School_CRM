import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Phone, MapPin, Heart, BookOpen, Fingerprint } from 'lucide-react';

const ChildProfile = ({ childId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching child profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) {
            fetchProfile();
        }
    }, [childId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-rose-500">Failed to load profile.</div>;

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Child Profile</h1>
                <p className="text-slate-500">Complete academic and personal information.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-4 shadow-inner">
                        {profile.name ? profile.name.charAt(0) : 'S'}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                    <p className="text-sm font-medium text-slate-500 mb-4">
                        Class {profile.class} - {profile.section} | Roll No: {profile.rollNumber}
                    </p>
                    <div className="w-full pt-4 border-t border-slate-100 mt-2 space-y-3 text-left">
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">Admission No</span>
                            <span className="font-semibold text-slate-800 text-sm">{profile.admissionNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">House</span>
                            <span className="font-semibold text-slate-800 text-sm">{profile.house}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">DOB</span>
                            <span className="font-semibold text-slate-800 text-sm">{profile.dob}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Details */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Fingerprint size={18} className="text-blue-500" />
                            Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500">Gender</p>
                                <p className="font-medium text-slate-800">{profile.gender}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Blood Group</p>
                                <p className="font-medium text-slate-800">{profile.bloodGroup}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Religion</p>
                                <p className="font-medium text-slate-800">{profile.religion}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Parent Details */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Phone size={18} className="text-emerald-500" />
                            Contact & Family Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500">Father's Name</p>
                                <p className="font-medium text-slate-800">{profile.fatherName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Mother's Name</p>
                                <p className="font-medium text-slate-800">{profile.motherName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Mobile Number</p>
                                <p className="font-medium text-slate-800">{profile.mobile}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-slate-500">Address</p>
                                <p className="font-medium text-slate-800">{profile.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildProfile;
