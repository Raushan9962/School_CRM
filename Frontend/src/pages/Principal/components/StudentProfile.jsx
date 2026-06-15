import React, { useState, useEffect } from 'react';

const StudentProfile = ({ studentId, onBack }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/principal/students/${studentId}/profile`, {
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

    if (loading || !profile) return <div className="p-8 text-center text-slate-500">Loading student profile...</div>;

    const { basic_info, contact_info, parent_details, academic_info, attendance_summary, performance, fee_info, documents, discipline, timeline, insights } = profile;

    return (
        <div className="animate-fade-in relative max-w-7xl mx-auto pb-12">
            {/* Header & Insights */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <span className="text-xl">⬅️</span>
                </button>
                <h2 className="text-3xl font-extrabold text-indigo-950 m-0 flex-1">Student Profile</h2>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700">Edit Profile</button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-purple-700">Print ID Card</button>
                </div>
            </div>

            {/* Top Principal Insights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    <SectionCard title="1. Basic Information">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-lg">{basic_info.photo}</div>
                            <h3 className="text-xl font-bold text-slate-800">{basic_info.name}</h3>
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold mt-2">Class {basic_info.class} - {basic_info.section}</span>
                        </div>
                        <div className="space-y-3">
                            <InfoRow label="Admission No" value={basic_info.admission_number} />
                            <InfoRow label="Roll Number" value={basic_info.roll_number} />
                            <InfoRow label="Date of Birth" value={basic_info.dob} />
                            <InfoRow label="Gender" value={basic_info.gender} />
                            <InfoRow label="Blood Group" value={basic_info.blood_group} />
                            <InfoRow label="Category" value={basic_info.category} />
                        </div>
                    </SectionCard>

                    {/* Contact Info */}
                    <SectionCard title="2. Contact Information">
                        <div className="space-y-3">
                            <InfoRow label="Mobile" value={contact_info.mobile} />
                            <InfoRow label="Email" value={contact_info.email} />
                            <InfoRow label="Address" value={contact_info.address} />
                            <InfoRow label="City/State" value={`${contact_info.city}, ${contact_info.state}`} />
                            <InfoRow label="Pincode" value={contact_info.pincode} />
                        </div>
                    </SectionCard>
                </div>

                {/* Right Column (Data Heavy) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Academic & Parent Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SectionCard title="3. Parent / Guardian Details">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Father</h4>
                                    <InfoRow label="Name" value={parent_details.father_name} />
                                    <InfoRow label="Mobile" value={parent_details.father_mobile} />
                                    <InfoRow label="Occupation" value={parent_details.father_occupation} />
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mother</h4>
                                    <InfoRow label="Name" value={parent_details.mother_name} />
                                    <InfoRow label="Mobile" value={parent_details.mother_mobile} />
                                    <InfoRow label="Occupation" value={parent_details.mother_occupation} />
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <InfoRow label="Emergency Contact" value={parent_details.emergency_contact} />
                                </div>
                            </div>
                        </SectionCard>

                        <div className="space-y-8">
                            <SectionCard title="4. Academic Information">
                                <div className="space-y-3">
                                    <InfoRow label="Current Session" value={academic_info.current_session} />
                                    <InfoRow label="Class Teacher" value={academic_info.class_teacher} />
                                    <InfoRow label="Previous Class" value={`Class ${academic_info.previous_class}`} />
                                    <InfoRow label="Admission Date" value={academic_info.admission_date} />
                                </div>
                            </SectionCard>

                            <SectionCard title="5. Attendance Summary">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-slate-800">{attendance_summary.working_days}</div>
                                        <div className="text-xs font-semibold text-slate-500">Working Days</div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-emerald-600">{attendance_summary.present}</div>
                                        <div className="text-xs font-semibold text-emerald-600">Present</div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-red-500">{attendance_summary.absent}</div>
                                        <div className="text-xs font-semibold text-red-500">Absent</div>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-amber-500">{attendance_summary.late}</div>
                                        <div className="text-xs font-semibold text-amber-500">Late Days</div>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>
                    </div>

                    {/* Results & Performance */}
                    <SectionCard title="6. Result & Performance">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-slate-700 mb-4">Recent Exams</h4>
                                <table className="w-full text-left text-sm">
                                    <thead><tr className="text-slate-400 border-b border-slate-100"><th className="pb-2">Exam</th><th className="pb-2">Score</th><th className="pb-2">Grade</th></tr></thead>
                                    <tbody>
                                        {performance.recent_exams.map((e, i) => (
                                            <tr key={i} className="border-b border-slate-50">
                                                <td className="py-3 font-semibold text-slate-700">{e.exam}</td>
                                                <td className="py-3 font-bold text-blue-600">{e.percentage}</td>
                                                <td className="py-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">{e.grade}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 mb-4">Subject Wise (Latest)</h4>
                                <div className="space-y-4">
                                    {performance.subject_marks.map((s, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-slate-600">{s.subject}</span><span className="font-bold text-slate-800">{s.marks}/100</span></div>
                                            <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${s.marks}%` }}></div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <SectionCard title="7. Fee Information">
                                <div className="space-y-3">
                                    <InfoRow label="Total Fees" value={`₹${fee_info.total_fees.toLocaleString()}`} />
                                    <InfoRow label="Paid Fees" value={`₹${fee_info.paid.toLocaleString()}`} valueColor="text-emerald-600 font-bold" />
                                    <InfoRow label="Pending Fees" value={`₹${fee_info.pending.toLocaleString()}`} valueColor="text-red-500 font-bold" />
                                    <InfoRow label="Last Payment" value={fee_info.last_payment_date} />
                                </div>
                            </SectionCard>

                            <SectionCard title="8. Documents">
                                <ul className="space-y-3">
                                    {documents.map((d, i) => (
                                        <li key={i} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                                            <span className="font-semibold text-slate-700 flex items-center gap-2">📄 {d.name}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${d.status === 'Uploaded' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </SectionCard>
                        </div>

                        <div className="space-y-8">
                            <SectionCard title="9. Discipline Record">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-red-50 p-3 rounded-xl text-center border border-red-100">
                                        <div className="text-xl font-bold text-red-600">{discipline.warnings}</div>
                                        <div className="text-xs font-semibold text-red-500">Warnings</div>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-xl text-center border border-amber-100">
                                        <div className="text-xl font-bold text-amber-600">{discipline.complaints}</div>
                                        <div className="text-xs font-semibold text-amber-600">Complaints</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-slate-500">Achievements:</strong> <span className="font-semibold text-slate-800">{discipline.achievements}</span></p>
                                    <p><strong className="text-slate-500">Awards:</strong> <span className="font-semibold text-slate-800">{discipline.awards}</span></p>
                                </div>
                            </SectionCard>

                            <SectionCard title="10. Activity Timeline">
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
    <div className={`p-6 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100 bg-white`}>
        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center text-2xl`}>{icon}</div>
        <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</div>
            <div className={`text-xl font-black ${color}`}>{value}</div>
        </div>
    </div>
);

const SectionCard = ({ title, children }) => (
    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-6 border-b border-slate-100 pb-4">{title}</h3>
        {children}
    </div>
);

const InfoRow = ({ label, value, valueColor = "text-slate-800 font-semibold" }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-0">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className={`${valueColor} text-right`}>{value}</span>
    </div>
);

export default StudentProfile;
