import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Shield, CheckCircle2 } from 'lucide-react';

const AccountantProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        // Load user from local storage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || 'Not Provided'
                });
            } catch (e) {
                console.error("Error parsing user profile:", e);
            }
        }
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        // Here you would typically send an API request to update the backend
        
        // Simulating a successful update
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    if (!user) {
        return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">My Profile</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage your account settings and personal information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded shadow-sm border border-slate-200 p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md mx-auto flex items-center justify-center overflow-hidden">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-blue-500" />
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm">
                                <Camera size={14} />
                            </button>
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 m-0">{user.name}</h2>
                        <p className="text-sm text-slate-500 mb-4">{user.role || user.roleName || 'Accountant'}</p>
                        
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-full w-fit mx-auto">
                            <Shield size={12} /> Active Account
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span className="truncate">{user.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span>{formData.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Briefcase size={16} className="text-slate-400" />
                                <span>Employee ID: {user.id || 'EMP-1234'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-sm m-0">Personal Information</h3>
                            <button 
                                onClick={() => setIsEditing(!isEditing)} 
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 shadow-sm transition-colors"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>
                        
                        <div className="p-5">
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            disabled={!isEditing}
                                            required
                                            className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            disabled={!isEditing}
                                            required
                                            className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            disabled={!isEditing}
                                            placeholder="Enter phone number"
                                            className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Role / Position</label>
                                        <input 
                                            type="text" 
                                            value="Accountant"
                                            disabled
                                            className="w-full px-3 py-2 text-sm rounded border border-slate-200 outline-none bg-slate-50 text-slate-500 cursor-not-allowed" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Address</label>
                                    <textarea 
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        disabled={!isEditing}
                                        rows="3"
                                        placeholder="Enter your address details"
                                        className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                                    ></textarea>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 flex items-center gap-1 shadow-sm">
                                            <CheckCircle2 size={14} /> Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow-sm border border-slate-200 mt-6">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-sm m-0">Security Settings</h3>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 m-0">Password</h4>
                                    <p className="text-xs text-slate-500 m-0">Change your login password</p>
                                </div>
                                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 shadow-sm transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantProfile;
