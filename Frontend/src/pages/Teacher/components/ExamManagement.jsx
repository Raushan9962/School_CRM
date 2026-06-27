import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { FileText, ChevronRight, Save, AlertTriangle, CheckCircle, X } from 'lucide-react';

const GRADE_TABLE = [
    { range: '91-100', grade: 'A1', gp: '10.0', remark: 'Outstanding', color: '#059669' },
    { range: '81-90', grade: 'A2', gp: '9.0', remark: 'Excellent', color: '#10b981' },
    { range: '71-80', grade: 'B1', gp: '8.0', remark: 'Very Good', color: '#3b82f6' },
    { range: '61-70', grade: 'B2', gp: '7.0', remark: 'Good', color: '#6366f1' },
    { range: '51-60', grade: 'C1', gp: '6.0', remark: 'Average', color: '#f59e0b' },
    { range: '41-50', grade: 'C2', gp: '5.0', remark: 'Below Average', color: '#f97316' },
    { range: '33-40', grade: 'D', gp: '4.0', remark: 'Satisfactory', color: '#ef4444' },
    { range: '0-32', grade: 'F', gp: '0.0', remark: 'Fail', color: '#dc2626' },
];

const getGrade = (marks, max) => {
    const pct = (marks / max) * 100;
    if (pct >= 91) return { grade: 'A1', color: '#059669' };
    if (pct >= 81) return { grade: 'A2', color: '#10b981' };
    if (pct >= 71) return { grade: 'B1', color: '#3b82f6' };
    if (pct >= 61) return { grade: 'B2', color: '#6366f1' };
    if (pct >= 51) return { grade: 'C1', color: '#f59e0b' };
    if (pct >= 41) return { grade: 'C2', color: '#f97316' };
    if (pct >= 33) return { grade: 'D', color: '#ef4444' };
    return { grade: 'F', color: '#dc2626' };
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
            .then(d => { if (d.success) setExams(d.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openExam = async (exam) => {
        setSelectedExam(exam);
        setActiveTab('marks');
        try {
            const res = await apiFetch(`/teacher-portal/exam-students/${exam.id}`, { headers });
            const data = await res.json();
            if (data.success) {
                setStudents(data.data.students);
                // Pre-fill existing marks
                const init = {};
                data.data.students.forEach(s => {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={22} color="#6366f1" />
                    {activeTab === 'exams' ? 'Exams & Marks Entry' : `Enter Marks — ${selectedExam?.name}`}
                </h2>
                {activeTab === 'marks' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { setActiveTab('exams'); setSelectedExam(null); }}
                            style={{ padding: '9px 16px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                            ← Back
                        </button>
                        <button onClick={saveMarks} disabled={saving}
                            style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save All Marks'}
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {[{ id: 'exams', label: 'Exam List' }, { id: 'gradeTable', label: 'Grade System' }].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        style={{ padding: '8px 18px', background: activeTab === t.id ? '#6366f1' : 'white', color: activeTab === t.id ? 'white' : '#64748b', border: activeTab === t.id ? 'none' : '1px solid #e2e8f0', borderRadius: '20px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Status Message */}
            {msg && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', background: isError ? '#fee2e2' : '#dcfce7', color: isError ? '#dc2626' : '#166534', fontWeight: 600, fontSize: '14px', border: `1px solid ${isError ? '#fca5a5' : '#86efac'}` }}>
                    {isError ? <AlertTriangle size={16} /> : <CheckCircle size={16} />} {msgText}
                </div>
            )}

            {/* Exam List */}
            {activeTab === 'exams' && (
                loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>Loading exams...</div>
                ) : exams.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                        <FileText size={40} color="#e2e8f0" style={{ marginBottom: '12px' }} />
                        <p style={{ color: '#94a3b8', margin: 0 }}>No exams found. Principal will create exams and assign mark entry windows.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {exams.map(exam => {
                            const statusColor = exam.status === 'Active' ? '#10b981' : exam.status === 'Completed' ? '#6366f1' : '#f59e0b';
                            return (
                                <div key={exam.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => openExam(exam)}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📝</div>
                                        <div>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{exam.name}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                                                {exam.class_name ? `Class ${exam.class_name} ${exam.section || ''} • ` : ''}{exam.subject_name || exam.exam_type} • Max: {exam.max_marks || 100} marks
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: statusColor + '20', color: statusColor }}>
                                            {exam.status || 'Active'}
                                        </span>
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                                            {exam.start_date ? new Date(exam.start_date).toLocaleDateString('en-IN') : '—'}
                                        </span>
                                        <ChevronRight size={16} color="#94a3b8" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* Grade Table */}
            {activeTab === 'gradeTable' && (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '16px', fontWeight: 700 }}>📊 10-Point Grade System</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                {['Marks Range', 'Grade', 'Grade Point', 'Remark'].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {GRADE_TABLE.map((g, i) => (
                                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>{g.range}%</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{ padding: '4px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '14px', background: g.color + '20', color: g.color }}>{g.grade}</span>
                                    </td>
                                    <td style={{ padding: '12px 20px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{g.gp}</td>
                                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#64748b' }}>{g.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Marks Entry */}
            {activeTab === 'marks' && selectedExam && (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: '48px 1fr 130px 130px 80px', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>#</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Student</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Theory Marks</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Practical</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Grade</span>
                    </div>
                    {students.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No students found for this exam.</div>
                    ) : (
                        students.map((s, i) => {
                            const theory = parseFloat(marks[s.id]?.theory) || 0;
                            const practical = parseFloat(marks[s.id]?.practical) || 0;
                            const total = theory + practical;
                            const maxMarks = selectedExam.max_marks || 100;
                            const { grade, color } = total > 0 ? getGrade(total, maxMarks) : { grade: '—', color: '#94a3b8' };
                            return (
                                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 130px 130px 80px', gap: '12px', padding: '12px 24px', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>{i + 1}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>
                                            {s.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{s.name}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Roll: {s.roll_number || '—'}</p>
                                        </div>
                                    </div>
                                    <input type="number" min={0} max={maxMarks} value={marks[s.id]?.theory || ''} onChange={e => updateMark(s.id, 'theory', e.target.value)}
                                        placeholder={`Max ${maxMarks}`}
                                        style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'center', fontWeight: 600 }} />
                                    <input type="number" min={0} max={20} value={marks[s.id]?.practical || ''} onChange={e => updateMark(s.id, 'practical', e.target.value)}
                                        placeholder="Max 20"
                                        style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'center', fontWeight: 600 }} />
                                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '13px', background: color + '20', color, textAlign: 'center' }}>{grade}</span>
                                </div>
                            );
                        })
                    )}
                    {students.length > 0 && (
                        <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
                            <button onClick={saveMarks} disabled={saving}
                                style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <Save size={16} /> {saving ? 'Saving...' : 'Save All Marks'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
