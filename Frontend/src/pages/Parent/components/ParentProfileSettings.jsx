import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';

const ParentProfileSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Profile & Settings</h1>
                <p className="text-slate-500">Manage your account details and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Settings Sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-1.5 flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-bold transition-colors ${
                                activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <User size={16} /> Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-bold transition-colors ${
                                activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Lock size={16} /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-bold transition-colors ${
                                activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Bell size={16} /> Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-bold transition-colors ${
                                activeTab === 'privacy' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Shield size={16} /> Privacy
                        </button>
                    </div>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <h3 className="m-0 text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Personal Information</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm overflow-hidden">
                                    <User size={32} />
                                </div>
                                <div>
                                    <button className="px-3 py-1.5 bg-white text-slate-700 rounded-md text-[12px] font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">
                                        Change Avatar
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                                    <input type="text" defaultValue="Rajesh Sharma" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium focus:outline-none focus:border-blue-500 transition-colors" disabled />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Relation</label>
                                    <input type="text" defaultValue="Father" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium focus:outline-none focus:border-blue-500 transition-colors" disabled />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                                    <input type="email" defaultValue="rajesh.sharma@example.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                                    <input type="text" defaultValue="+91 98765 43210" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium focus:outline-none focus:border-blue-500 transition-colors" />
                                    <p className="m-0 text-[10px] text-amber-600 mt-1 font-medium">Number change requires admin approval.</p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                    <Save size={14} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-4">
                            <h3 className="m-0 text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Security Settings</h3>
                            <div className="space-y-3 max-w-md">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <button className="px-4 py-2 bg-slate-800 text-white rounded-md text-[12px] font-semibold hover:bg-slate-900 transition-colors shadow-sm">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <h3 className="m-0 text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Notification Preferences</h3>
                            <div className="space-y-3">
                                {['Email Alerts', 'SMS Alerts', 'Push Notifications', 'Weekly Summary Reports'].map((pref, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
                                        <div>
                                            <p className="m-0 text-[13px] font-bold text-slate-800">{pref}</p>
                                            <p className="m-0 text-[11px] text-slate-500 mt-0.5">Receive notifications for important updates.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'privacy' && (
                        <div className="p-8 text-center text-slate-500 text-[13px]">
                            Privacy settings are currently managed by school administrators.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentProfileSettings;
