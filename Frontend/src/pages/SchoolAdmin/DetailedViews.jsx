import React, { useState, useEffect } from 'react';

export const StudentManagementView = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-students', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setStudents(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading students...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">Student Directory</h3>
                <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">Total: {students.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Student</th>
                            <th className="p-4">Admission Details</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Fee Dues</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map(s => (
                            <React.Fragment key={s.id}>
                                <tr className="hover:bg-indigo-50/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={s.image || `https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-bold text-gray-800">{s.name}</p>
                                                <p className="text-xs text-gray-500">{s.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-gray-700">Adm: {s.admission_no || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">Roll: {s.roll_number || 'N/A'}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-indigo-600">{s.class_name || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">Sec: {s.class_section || s.section || 'N/A'}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.total_fees_due > 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                            ₹ {s.total_fees_due}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="text-xs bg-white border border-gray-300 text-gray-700 font-semibold px-3 py-1.5 rounded hover:bg-gray-50">
                                            {expandedId === s.id ? 'Close' : 'Full Profile'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === s.id && (
                                    <tr>
                                        <td colSpan={5} className="bg-slate-50 p-6 sm:p-8 border-b border-gray-200">
                                            <div className="bg-white max-w-4xl mx-auto rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                                
                                                {/* Header / Student Profile */}
                                                <div className="flex flex-col md:flex-row items-start md:items-center p-8 gap-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                                    <img src={s.image || `https://api.dicebear.com/5.x/initials/svg?seed=${s.name}`} alt="Student" className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover" />
                                                    <div className="flex-1">
                                                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.name || 'N/A'}</h2>
                                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                                                            <div><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Admission No</p><p className="font-semibold text-gray-900 mt-1">{s.admission_no || 'N/A'}</p></div>
                                                            <div><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Class / Sec</p><p className="font-semibold text-gray-900 mt-1">{s.class_name || 'N/A'} - {s.class_section || s.section || 'N/A'}</p></div>
                                                            <div><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Roll No</p><p className="font-semibold text-gray-900 mt-1">{s.roll_number || 'N/A'}</p></div>
                                                            <div><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">DOB</p><p className="font-semibold text-gray-900 mt-1">{s.dob ? new Date(s.dob).toLocaleDateString() : 'N/A'}</p></div>
                                                            <div><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Gender</p><p className="font-semibold text-gray-900 mt-1">{s.gender || 'N/A'}</p></div>
                                                            <div><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Blood Group</p><p className="font-semibold text-red-600 mt-1">{s.blood_group || 'N/A'}</p></div>
                                                            <div className="col-span-2"><p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Address</p><p className="font-semibold text-gray-900 mt-1 truncate" title={s.address}>{s.address || 'N/A'}</p></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                                                    
                                                    {/* Parent Information */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-100 pb-2 mb-4 flex items-center gap-2">
                                                            <i className="fas fa-users text-indigo-500"></i> Parent Information
                                                        </h3>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-center justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Father Name</span><span className="font-medium text-gray-900">{s.father_name || 'N/A'}</span></div>
                                                            <div className="flex items-center justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Mother Name</span><span className="font-medium text-gray-900">{s.mother_name || 'N/A'}</span></div>
                                                            <div className="flex items-center justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Mobile Number</span><span className="font-medium text-gray-900">{s.parent_phone || 'N/A'}</span></div>
                                                            <div className="flex items-center justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{s.parent_email || 'N/A'}</span></div>
                                                            <div className="flex items-center justify-between py-1"><span className="text-gray-500">Address</span><span className="font-medium text-gray-900 text-right w-1/2 truncate" title={s.address}>{s.address || 'N/A'}</span></div>
                                                        </div>
                                                    </div>

                                                    {/* Attendance Summary */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-emerald-100 pb-2 mb-4 flex items-center gap-2">
                                                            <i className="fas fa-calendar-check text-emerald-500"></i> Attendance Summary
                                                        </h3>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 transition hover:shadow-md">
                                                                    <p className="text-emerald-800 text-2xl font-bold">{s.present_days || '0'}</p>
                                                                    <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mt-1">Present</p>
                                                                </div>
                                                                <div className="bg-red-50 p-3 rounded-xl border border-red-100 transition hover:shadow-md">
                                                                    <p className="text-red-800 text-2xl font-bold">{s.absent_days || '0'}</p>
                                                                    <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-1">Absent</p>
                                                                </div>
                                                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 transition hover:shadow-md">
                                                                    <p className="text-blue-800 text-2xl font-bold">{s.attendance_percentage ? s.attendance_percentage + '%' : '0%'}</p>
                                                                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mt-1">Overall</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Fees Details */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-amber-100 pb-2 mb-4 flex items-center gap-2">
                                                            <i className="fas fa-rupee-sign text-amber-500"></i> Fees Details
                                                        </h3>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-center justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Tuition Fee</span><span className="font-medium text-gray-900">{s.tuition_fee_status || 'N/A'}</span></div>
                                                            <div className="flex items-center justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Transport Fee</span><span className="font-medium text-gray-900">{s.transport_fee_status || 'N/A'}</span></div>
                                                            <div className="flex items-center justify-between py-3 mt-2 bg-red-50 px-4 rounded-lg border border-red-100 shadow-sm"><span className="font-bold text-red-800 uppercase tracking-wide text-xs">Total Due</span><span className="font-bold text-red-600 text-xl">₹{s.total_fees_due || '0'}</span></div>
                                                        </div>
                                                    </div>

                                                    {/* Exam Results */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-purple-100 pb-2 mb-4 flex items-center gap-2">
                                                            <i className="fas fa-graduation-cap text-purple-500"></i> Exam Results
                                                        </h3>
                                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-white hover:shadow-md hover:border-purple-100">
                                                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Math</span>
                                                                <span className="text-xl font-black text-gray-800">{s.marks_math || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-white hover:shadow-md hover:border-purple-100">
                                                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Science</span>
                                                                <span className="text-xl font-black text-gray-800">{s.marks_science || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-100 transition hover:bg-white hover:shadow-md hover:border-purple-100">
                                                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">English</span>
                                                                <span className="text-xl font-black text-gray-800">{s.marks_english || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 border border-purple-100">
                                                                <span className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-1">Total Marks</span>
                                                                <span className="text-xl font-black text-purple-900">{s.total_marks || ((Number(s.marks_math) || 0) + (Number(s.marks_science) || 0) + (Number(s.marks_english) || 0)) || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 border border-purple-100">
                                                                <span className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-1">Percentage</span>
                                                                <span className="text-xl font-black text-purple-900">{s.percentage || s.marks_percentage || ((((Number(s.marks_math) || 0) + (Number(s.marks_science) || 0) + (Number(s.marks_english) || 0)) / 3).toFixed(1) + '%') || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {students.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No students registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const TeacherManagementView = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-teachers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setTeachers(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading teachers...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">Teacher Directory</h3>
                <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold">Total: {teachers.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Teacher</th>
                            <th className="p-4">Employee Details</th>
                            <th className="p-4">Academic Info</th>
                            <th className="p-4">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {teachers.map(t => (
                            <tr key={t.id} className="hover:bg-purple-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={t.image || `https://api.dicebear.com/5.x/initials/svg?seed=${t.name}`} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{t.name}</p>
                                            <p className="text-xs text-gray-500">Joined: {t.joining_date ? new Date(t.joining_date).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-700">EMP ID: {t.employee_id || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Salary: ₹{t.salary || '—'}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-purple-600">{t.subject || 'General'}</p>
                                    <p className="text-xs text-gray-500">Qual: {t.qualification || 'N/A'} ({t.experience || 0} yrs exp)</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-medium">{t.email}</p>
                                    <p className="text-xs text-gray-500">{t.phone || '—'}</p>
                                </td>
                            </tr>
                        ))}
                        {teachers.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No teachers registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ParentManagementView = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-parents', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setParents(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchParents();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading parents...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">Parent Directory</h3>
                <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full text-xs font-bold">Total: {parents.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Parent</th>
                            <th className="p-4">Relation</th>
                            <th className="p-4">Linked Student</th>
                            <th className="p-4">Contact Info</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {parents.map(p => (
                            <tr key={p.id} className="hover:bg-amber-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image || `https://api.dicebear.com/5.x/initials/svg?seed=${p.name}`} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.occupation || '—'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold">{p.relation || 'Parent'}</span>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-amber-600">{p.student_name || 'Not Linked'}</p>
                                    <p className="text-xs text-gray-500">{p.student_class || ''}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-medium">{p.email}</p>
                                    <p className="text-xs text-gray-500">{p.phone || '—'}</p>
                                </td>
                            </tr>
                        ))}
                        {parents.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No parents registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AccountantManagementView = () => {
    const [accountants, setAccountants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccountants = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-accountants', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setAccountants(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccountants();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading accountants...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">Finance Team Directory</h3>
                <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">Total: {accountants.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Accountant</th>
                            <th className="p-4">Employee ID</th>
                            <th className="p-4">Qualification</th>
                            <th className="p-4">Salary</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {accountants.map(a => (
                            <tr key={a.id} className="hover:bg-green-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={a.image || `https://api.dicebear.com/5.x/initials/svg?seed=${a.name}`} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{a.name}</p>
                                            <p className="text-xs text-gray-500">{a.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-700">{a.employee_id || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Joined: {a.joining_date ? new Date(a.joining_date).toLocaleDateString() : 'N/A'}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{a.qualification || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{a.experience || 0} years exp.</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-green-600">₹{a.salary || '—'}</p>
                                </td>
                            </tr>
                        ))}
                        {accountants.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No accountants registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const LibrarianManagementView = () => {
    const [librarians, setLibrarians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibrarians = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-librarians', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setLibrarians(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibrarians();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading librarians...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">Library Staff Directory</h3>
                <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">Total: {librarians.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Librarian</th>
                            <th className="p-4">Employee ID</th>
                            <th className="p-4">Qualification</th>
                            <th className="p-4">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {librarians.map(l => (
                            <tr key={l.id} className="hover:bg-blue-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={l.image || `https://api.dicebear.com/5.x/initials/svg?seed=${l.name}`} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{l.name}</p>
                                            <p className="text-xs text-gray-500">Joined: {l.joining_date ? new Date(l.joining_date).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-semibold text-gray-700">{l.employee_id || 'N/A'}</td>
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{l.qualification || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{l.experience || 0} years exp.</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-medium">{l.email}</p>
                                    <p className="text-xs text-gray-500">{l.phone || '—'}</p>
                                </td>
                            </tr>
                        ))}
                        {librarians.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No librarians registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const TransportManagementView = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/users/school-transport-managers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setManagers(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchManagers();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading transport managers...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-800">Transport Staff Directory</h3>
                <span className="bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-xs font-bold">Total: {managers.length}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Manager</th>
                            <th className="p-4">Employee Details</th>
                            <th className="p-4">Assigned Duties</th>
                            <th className="p-4">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {managers.map(m => (
                            <tr key={m.id} className="hover:bg-yellow-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={m.image || `https://api.dicebear.com/5.x/initials/svg?seed=${m.name}`} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{m.name}</p>
                                            <p className="text-xs text-gray-500">Joined: {m.joining_date ? new Date(m.joining_date).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-700">EMP ID: {m.employee_id || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Lic: {m.license_number || 'N/A'}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-gray-800">Vehicle: {m.vehicle_assigned || 'Not Assigned'}</p>
                                    <p className="text-xs text-gray-500">Route: {m.route_assigned || 'N/A'}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-medium">{m.email}</p>
                                    <p className="text-xs text-gray-500">{m.phone || '—'}</p>
                                </td>
                            </tr>
                        ))}
                        {managers.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No transport managers registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const StudentAttendanceView = () => {
    const [records, setRecords] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [formData, setFormData] = useState({ studentId: '', date: new Date().toISOString().split('T')[0], status: 'Present', remarks: '' });

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-attendance', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setRecords(data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setStudents(data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAttendance(); fetchStudents(); }, []);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setShowModal(false);
                setFormData({ studentId: '', date: new Date().toISOString().split('T')[0], status: 'Present', remarks: '' });
                fetchAttendance();
            } else {
                alert(data.message || 'Failed to mark attendance');
            }
        } catch (err) { console.error(err); alert('Error marking attendance'); }
    };

    const filtered = records.filter(r => {
        if (filterStatus && r.status !== filterStatus) return false;
        if (filterDate && r.date?.split('T')[0] !== filterDate) return false;
        return true;
    });

    if (loading) return <div className="p-10 text-center">Loading attendance records...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Student Attendance</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Track and manage attendance for all students</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                    </select>
                    <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-xs font-bold">Total: {filtered.length}</span>
                    <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Mark Attendance
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Student</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(r => (
                            <tr key={r.id} className="hover:bg-emerald-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={r.student_image || `https://api.dicebear.com/5.x/initials/svg?seed=${r.student_name}`} alt="" className="w-9 h-9 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{r.student_name}</p>
                                            <p className="text-xs text-gray-500">Adm: {r.admission_no || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-700">{r.class_name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Sec: {r.class_section || 'N/A'}</p>
                                </td>
                                <td className="p-4 font-medium text-gray-700">{r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : r.status === 'Absent' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">{r.remarks || '—'}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No attendance records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mark Attendance Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-800">Mark Attendance</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleMarkAttendance} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
                                <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.admission_no || 'N/A'} ({s.class_name || 'N/A'})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Late">Late</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks (Optional)</label>
                                <input type="text" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Any additional notes..." />
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm">Mark Attendance</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export const StudentFeesHistoryView = () => {
    const [records, setRecords] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [formData, setFormData] = useState({ studentId: '', amount: '', dueDate: '', status: 'Pending', paidDate: '' });

    const fetchFees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-fees-history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setRecords(data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setStudents(data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchFees(); fetchStudents(); }, []);

    const handleAddFee = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/school-fees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setShowModal(false);
                setFormData({ studentId: '', amount: '', dueDate: '', status: 'Pending', paidDate: '' });
                fetchFees();
            } else {
                alert(data.message || 'Failed to add fee');
            }
        } catch (err) { console.error(err); alert('Error adding fee'); }
    };

    const filtered = records.filter(r => {
        if (filterStatus && r.status !== filterStatus) return false;
        return true;
    });

    const totalCollected = filtered.filter(r => r.status === 'Paid').reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const totalPending = filtered.filter(r => r.status !== 'Paid').reduce((sum, r) => sum + Number(r.amount || 0), 0);

    if (loading) return <div className="p-10 text-center">Loading fees history...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Records</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{filtered.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Collected</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalCollected.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-black text-red-700 mt-1">₹{totalPending.toLocaleString()}</p>
                </div>
            </div>

            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-lg text-gray-800">Fees History</h3>
                <div className="flex items-center gap-3 flex-wrap">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Fee
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Student</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Paid Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(r => (
                            <tr key={r.id} className="hover:bg-amber-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={r.student_image || `https://api.dicebear.com/5.x/initials/svg?seed=${r.student_name}`} alt="" className="w-9 h-9 rounded-full" />
                                        <div>
                                            <p className="font-bold text-gray-800">{r.student_name}</p>
                                            <p className="text-xs text-gray-500">Adm: {r.admission_no || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-700">{r.class_name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">Sec: {r.class_section || 'N/A'}</p>
                                </td>
                                <td className="p-4 font-bold text-gray-900">₹{Number(r.amount || 0).toLocaleString()}</td>
                                <td className="p-4 text-gray-700">{r.due_date ? new Date(r.due_date).toLocaleDateString() : '—'}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : r.status === 'Overdue' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                        {r.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{r.paid_date ? new Date(r.paid_date).toLocaleDateString() : '—'}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No fee records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Fee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-800">Add Fee Record</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddFee} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
                                <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.admission_no || 'N/A'} ({s.class_name || 'N/A'})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹)</label>
                                    <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. 5000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                                    <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Paid Date</label>
                                    <input type="date" value={formData.paidDate} onChange={e => setFormData({...formData, paidDate: e.target.value})} className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm">Add Fee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
