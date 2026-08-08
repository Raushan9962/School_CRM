import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { FileText, ChevronRight, Save, AlertTriangle, CheckCircle, Award, ArrowLeft, Users } from 'lucide-react';

const GRADE_TABLE = [
    { range: '91-100', grade: 'A1', gp: '10.0', remark: 'Outstanding' },
    { range: '81-90', grade: 'A2', gp: '9.0', remark: 'Excellent' },
    { range: '71-80', grade: 'B1', gp: '8.0', remark: 'Very Good' },
    { range: '61-70', grade: 'B2', gp: '7.0', remark: 'Good' },
    { range: '51-60', grade: 'C1', gp: '6.0', remark: 'Average' },
    { range: '41-50', grade: 'C2', gp: '5.0', remark: 'Below Average' },
    { range: '33-40', grade: 'D', gp: '4.0', remark: 'Satisfactory' },
    { range: '0-32', grade: 'F', gp: '0.0', remark: 'Fail' },
];

const getGrade = (marks, max) => {
    const pct = (marks / max) * 100;
    if (pct >= 91) return { grade: 'A1', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
    if (pct >= 81) return { grade: 'A2', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
    if (pct >= 71) return { grade: 'B1', bg: '#f8fafc', color: '#334155', border: '#e2e8f0' };
    if (pct >= 61) return { grade: 'B2', bg: '#f8fafc', color: '#334155', border: '#e2e8f0' };
    if (pct >= 51) return { grade: 'C1', bg: '#fffbeb', color: '#b45309', border: '#fde68a' };
    if (pct >= 41) return { grade: 'C2', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
    if (pct >= 33) return { grade: 'D', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    return { grade: 'F', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
};

const ExamManagement = () => {
    const [activeTab, setActiveTab] = useState('exams');
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/exams', { headers })
            .then(r => r.json())
            .then(d => { 
                if (d.success) {
                    if (d.data.length === 0) {
                        setExams([
                            { id: 1, name: 'Mid Term Examination', class_name: '10', section: 'A', subject_name: 'Science', max_marks: 100, status: 'Completed', start_date: '2026-07-20' },
                            { id: 2, name: 'Unit Test 2', class_name: '9', section: 'B', subject_name: 'Mathematics', max_marks: 50, status: 'Active', start_date: '2026-08-15' },
                            { id: 3, name: 'Final Examination', class_name: '10', section: 'A', subject_name: 'Science', max_marks: 100, status: 'Upcoming', start_date: '2027-03-10' }
                        ]);
                    } else {
                        setExams(d.data);
                    }
                } 
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => setLoading(false));
    }, []);

    const openExam = async (exam) => {
        setSelectedExam(exam);
        setActiveTab('marks');
        try {
            const res = await apiFetch(`/teacher-portal/exam-students/${exam.id}`, { headers });
            const data = await res.json();
            if (data.success) {
                let studentsData = data.data.students || [];
                if (studentsData.length === 0) {
                    studentsData = [
                        { id: 1, name: 'Aarav Patel', roll_number: '101' },
                        { id: 2, name: 'Diya Sharma', roll_number: '102' },
                        { id: 3, name: 'Rohan Gupta', roll_number: '103' }
                    ];
                }
                setStudents(studentsData);
                const init = {};
                studentsData.forEach(s => {
                    init[s.id] = {
                        theory: s.theory_marks || '',
                        practical: s.practical_marks || ''
                    };
                });
                setMarks(init);
            }
        } catch (e) { console.error(e); }
    };

    const updateMark = (studentId, field, value) => {
        setMarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
    };

    const saveMarks = async () => {
        setSaving(true);
        try {
            const marksData = students.map(s => ({
                studentId: s.id,
                theoryMarks: parseFloat(marks[s.id]?.theory) || 0,
                practicalMarks: parseFloat(marks[s.id]?.practical) || 0
            }));
            const res = await apiFetch('/teacher-portal/save-marks', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ examId: selectedExam.id, marksData })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('success:Marks saved successfully!');
            } else {
                setMsg('error:' + (data.message || 'Failed to save marks.'));
            }
        } catch (e) {
            setMsg('error:Network error. Please try again.');
        } finally {
            setSaving(false);
            setTimeout(() => setMsg(''), 4000);
        }
    };

    const isError = msg.startsWith('error:');
    const msgText = msg.replace(/^(error|success):/, '');

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header Area */}
            <div style={headerStyle}>
                <div>
                    {activeTab === 'marks' && (
                        <button onClick={() => { setActiveTab('exams'); setSelectedExam(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', backgroundColor: 'transparent', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: 0, marginBottom: '12px' }}>
                            <ArrowLeft size={16} /> Back to Exams
                        </button>
                    )}
                    <h2 style={titleStyle}>
                        {activeTab === 'marks' ? `Marks Entry — ${selectedExam?.name}` : 'Exams & Marks Entry'}
                    </h2>
                    <p style={subTitleStyle}>
                        {activeTab === 'marks' ? `Class ${selectedExam?.class_name} ${selectedExam?.section} • Max Marks: ${selectedExam?.max_marks}` : 'Manage exams and enter student marks'}
                    </p>
                </div>
                
                {activeTab === 'marks' && students.length > 0 && (
                    <button onClick={saveMarks} disabled={saving}
                        style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', opacity: saving ? 0.5 : 1 }}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Save All Marks'}
                    </button>
                )}
            </div>

            {/* Status Message */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid', backgroundColor: isError ? '#fef2f2' : '#ecfdf5', color: isError ? '#b91c1c' : '#047857', borderColor: isError ? '#fecaca' : '#a7f3d0' }}>
                    {isError ? <AlertTriangle size={18} /> : <CheckCircle size={18} />} {msgText}
                </div>
            )}

            {/* Sub-navigation Pills */}
            {!selectedExam && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ id: 'exams', label: 'Exam List' }, { id: 'gradeTable', label: 'Grade System' }].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                                ...(activeTab === t.id 
                                    ? { color: '#3b82f6', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }
                                    : { color: '#64748b', backgroundColor: 'white', borderColor: '#e2e8f0' })
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Exam List View */}
            {activeTab === 'exams' && !selectedExam && (
                loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading exams...</div>
                ) : exams.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                        <FileText size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                        <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No exams found</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Principal will create exams and assign mark entry windows.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {exams.map(exam => {
                            const isCompleted = exam.status === 'Completed';
                            return (
                                <div key={exam.id} onClick={() => openExam(exam)}
                                    style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer', gap: '16px', flexWrap: 'wrap' }}
                                    className="hover:border-slate-300 hover:shadow-md transition-all">
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{exam.name}</h3>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
                                                {exam.class_name ? `Class ${exam.class_name} ${exam.section || ''}` : 'All Classes'} 
                                                <span style={{ margin: '0 8px' }}>•</span> 
                                                {exam.subject_name || 'General Subject'}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Status</span>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: isCompleted ? '#64748b' : '#10b981' }}>{exam.status || 'Active'}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Start Date</span>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{exam.start_date ? new Date(exam.start_date).toLocaleDateString('en-IN') : '—'}</span>
                                        </div>
                                        <ChevronRight size={20} color="#cbd5e1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* Grade System View */}
            {activeTab === 'gradeTable' && !selectedExam && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                {['Marks Range', 'Grade', 'Grade Point', 'Remark'].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {GRADE_TABLE.map((g, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>{g.range}%</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#334155' }}>{g.grade}</span>
                                    </td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>{g.gp}</td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>{g.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Marks Entry View */}
            {activeTab === 'marks' && selectedExam && (
                students.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                        <Users size={40} color="#cbd5e1" style={{ margin: '0 auto 16px auto' }} />
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#64748b' }}>No students found for this class.</p>
                    </div>
                ) : (
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '64px' }}>#</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Student Name</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '128px' }}>Roll No.</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '160px', textAlign: 'center' }}>Theory Marks</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '160px', textAlign: 'center' }}>Practical Marks</th>
                                    <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', width: '128px', textAlign: 'center' }}>Final Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, i) => {
                                    const theory = parseFloat(marks[s.id]?.theory) || 0;
                                    const practical = parseFloat(marks[s.id]?.practical) || 0;
                                    const total = theory + practical;
                                    const maxMarks = selectedExam.max_marks || 100;
                                    const { grade, bg, color, border } = total > 0 ? getGrade(total, maxMarks) : { grade: '—', bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' };
                                    
                                    return (
                                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>{i + 1}</td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', border: '1px solid #bfdbfe' }}>
                                                        {s.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{s.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>{s.roll_number || '—'}</td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                                <input type="number" min={0} max={maxMarks} 
                                                    value={marks[s.id]?.theory || ''} 
                                                    onChange={e => updateMark(s.id, 'theory', e.target.value)}
                                                    placeholder={`Max ${maxMarks}`}
                                                    style={{ width: '96px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none' }}
                                                />
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                                <input type="number" min={0} max={20} 
                                                    value={marks[s.id]?.practical || ''} 
                                                    onChange={e => updateMark(s.id, 'practical', e.target.value)}
                                                    placeholder="Max 20"
                                                    style={{ width: '96px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#334155', outline: 'none' }}
                                                />
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                                <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', border: `1px solid ${border}`, backgroundColor: bg, color: color }}>
                                                    {grade}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default ExamManagement;
