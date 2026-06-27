import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard, User, Phone, Mail, Droplet, Users, Calendar, GraduationCap, Briefcase, AlertCircle, FileText, CheckCircle, XCircle } from 'lucide-react';
import apiFetch from '../../../services/api';

const StudentProfile = ({ studentId, onBack }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await apiFetch(`/principal/students/${studentId}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                setProfile(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [studentId]);

    if (loading || !profile) return <div className="p-5 text-center text-slate-500">Loading student profile...</div>;

    const { basic_info, contact_info, parent_details, academic_info, attendance_summary, performance, fee_info, documents, discipline, timeline, insights } = profile;

    return (
        <div className="animate-fade-in relative max-w-7xl mx-auto pb-12">
            {/* Header & Insights */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <span className="text-lg">⬅️</span>
                </button>
                <h2 className="text-3xl font-extrabold text-indigo-950 m-0 flex-1">Student Profile</h2>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700">Edit Profile</button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-purple-700">Print ID Card</button>
                </div>
            </div>

            {/* Top Principal Insights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <InsightCard title="Attendance" value={insights.attendance} icon="📅" color="text-emerald-600" bg="bg-emerald-50" />
                <InsightCard title="Performance" value={`${insights.performance} Grade`} icon="📈" color="text-blue-600" bg="bg-blue-50" />
                <InsightCard title="Fee Status" value={`Pending ₹${insights.fee_pending}`} icon="💰" color="text-red-500" bg="bg-red-50" />
                <InsightCard title="Class Rank" value={insights.rank} icon="🏆" color="text-amber-500" bg="bg-amber-50" />
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column (Sticky Identity) */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Basic Info */}
                    <SectionCard title="BASIC INFORMATION">
                        <div className="flex flex-col items-center text-center mb-8 border-b border-slate-100 pb-6">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-lg">{basic_info.photo}</div>
                            <h3 className="text-lg font-bold text-slate-800">{basic_info.name}</h3>
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold mt-2">Class {basic_info.class} - {basic_info.section}</span>
                        </div>
                        <IconRow icon={CreditCard} text={`Admission No: ${basic_info.admission_number}`} />
                        <IconRow icon={FileText} text={`Roll No: ${basic_info.roll_number}`} />
                        <IconRow icon={Calendar} text={`DOB: ${basic_info.dob}`} />
                        <IconRow icon={User} text={`Gender: ${basic_info.gender}`} />
                        <IconRow icon={Droplet} text={`Blood Group: ${basic_info.blood_group}`} />
                        <IconRow icon={Users} text={`Category: ${basic_info.category}`} />
                    </SectionCard>

                    {/* Contact Info */}
                    <SectionCard title="CONTACT INFO">
                        <IconRow icon={MapPin} text={contact_info.address} subtext={`${contact_info.city}, ${contact_info.state} - ${contact_info.pincode}`} />
                        <IconRow icon={Phone} text={contact_info.mobile} />
                        <IconRow icon={Mail} text={contact_info.email} />
                    </SectionCard>
                </div>

                {/* Right Column (Data Heavy) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Academic & Parent Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SectionCard title="PARENT DETAILS">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Father</h4>
                            <IconRow icon={User} text={parent_details.father_name} />
                            <IconRow icon={Phone} text={parent_details.father_mobile} />
                            <IconRow icon={Briefcase} text={parent_details.father_occupation} />
                            
                            <div className="pt-6 border-t border-slate-100 mt-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Mother</h4>
                                <IconRow icon={User} text={parent_details.mother_name} />
                                <IconRow icon={Phone} text={parent_details.mother_mobile} />
                                <IconRow icon={Briefcase} text={parent_details.mother_occupation} />
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Emergency</h4>
                                <IconRow icon={AlertCircle} text={parent_details.emergency_contact} />
                            </div>
                        </SectionCard>

                        <div className="space-y-8">
                            <SectionCard title="ACADEMICS">
                                <IconRow icon={Calendar} text={`Session: ${academic_info.current_session}`} />
                                <IconRow icon={User} text={`Class Teacher: ${academic_info.class_teacher}`} />
                                <IconRow icon={GraduationCap} text={`Prev Class: ${academic_info.previous_class}`} />
                                <IconRow icon={Calendar} text={`Admitted: ${academic_info.admission_date}`} />
                            </SectionCard>

                            <SectionCard title="ATTENDANCE">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                                        <div className="text-xl font-bold text-slate-800">{attendance_summary.working_days}</div>
                                        <div className="text-xs font-semibold text-slate-500">Working Days</div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl text-center">
                                        <div className="text-xl font-bold text-emerald-600">{attendance_summary.present}</div>
                                        <div className="text-xs font-semibold text-emerald-600">Present</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl text-center">
                                        <div className="text-xl font-bold text-red-500">{attendance_summary.absent}</div>
                                        <div className="text-xs font-semibold text-red-500">Absent</div>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl text-center">
                                        <div className="text-xl font-bold text-amber-500">{attendance_summary.late}</div>
                                        <div className="text-xs font-semibold text-amber-500">Late Days</div>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <SectionCard title="FEE INFO">
                                <IconRow icon={CreditCard} text={`Total Fees: ₹${fee_info.total_fees.toLocaleString()}`} />
                                <IconRow icon={CheckCircle} text={`Paid: ₹${fee_info.paid.toLocaleString()}`} />
                                <IconRow icon={XCircle} text={`Pending: ₹${fee_info.pending.toLocaleString()}`} />
                                <IconRow icon={Calendar} text={`Last Payment: ${fee_info.last_payment_date}`} />
                            </SectionCard>

                            <SectionCard title="DOCUMENTS">
                                {documents.map((d, i) => (
                                    <IconRow 
                                        key={i} 
                                        icon={FileText} 
                                        text={d.name} 
                                        subtext={d.status} 
                                    />
                                ))}
                            </SectionCard>
                        </div>

                        <div className="space-y-8">
                            <SectionCard title="DISCIPLINE">
                                <IconRow icon={AlertCircle} text={`${discipline.warnings} Warnings`} />
                                <IconRow icon={AlertCircle} text={`${discipline.complaints} Complaints`} />
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <IconRow icon={GraduationCap} text={`Achievements: ${discipline.achievements}`} />
                                </div>
                            </SectionCard>

                            <SectionCard title="TIMELINE">
                                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                                    {timeline.map((t, i) => (
                                        <div key={i} className="relative pl-6">
                                            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white shadow"></div>
                                            <div className="text-xs font-bold text-slate-400 mb-0.5">{t.date}</div>
                                            <div className="text-sm font-semibold text-slate-700">{t.action}</div>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ title, value, icon, color, bg }) => (
    <div className={`p-4 rounded-lg flex items-center gap-4 shadow-sm border border-slate-100 bg-white`}>
        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center text-xl`}>{icon}</div>
        <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</div>
            <div className={`text-lg font-black ${color}`}>{value}</div>
        </div>
    </div>
);

const SectionCard = ({ title, children }) => (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <h3 style={{ color: '#3b82f6', fontSize: '20px', fontWeight: '400', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {children}
        </div>
    </div>
);

const IconRow = ({ icon: Icon, text, subtext }) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ color: '#be185d', marginTop: '2px' }}>
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ color: '#1e293b', fontSize: '15px' }}>{text}</div>
            {subtext && <div style={{ color: '#475569', fontSize: '14px', marginTop: '2px' }}>{subtext}</div>}
        </div>
    </div>
);

export default StudentProfile;
