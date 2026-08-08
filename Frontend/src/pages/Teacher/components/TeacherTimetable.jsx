import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Calendar as CalendarIcon, Clock, BookOpen, AlertTriangle, Printer } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['08:00 - 08:45', '08:45 - 09:30', '09:30 - 10:15', '10:15 - 10:30 (Break)', '10:30 - 11:15', '11:15 - 12:00', '12:00 - 12:45'];

const TeacherTimetable = () => {
    const [timetable, setTimetable] = useState({});
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        apiFetch('/teacher-portal/timetable', { headers })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (Object.keys(d.data).length === 0) {
                        setTimetable({
                            'Monday': [
                                { period: 1, class_name: '10', section: 'A', subject: 'Science', time: '08:00 - 08:45' },
                                { period: 2, class_name: '9', section: 'B', subject: 'Mathematics', time: '08:45 - 09:30' }
                            ],
                            'Tuesday': [
                                { period: 3, class_name: '10', section: 'A', subject: 'Science', time: '09:30 - 10:15' }
                            ]
                        });
                    } else {
                        setTimetable(d.data);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>My Timetable</h2>
                    <p style={subTitleStyle}>Your weekly class schedule</p>
                </div>
                <button onClick={() => window.print()}
                    style={{ backgroundColor: 'white', color: '#0f172a', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Printer size={16} /> Print Schedule
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontWeight: 'bold' }}>Loading timetable...</div>
            ) : Object.keys(timetable).length === 0 ? (
                <div style={{ background: 'white', borderRadius: '8px', padding: '64px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <CalendarIcon size={48} color="#e2e8f0" style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: '0 0 4px 0', color: '#475569', fontWeight: 'bold' }}>No timetable found</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Your schedule has not been assigned yet.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '16px', width: '120px', borderRight: '1px solid #e2e8f0' }}></th>
                                {DAYS.map(day => (
                                    <th key={day} style={{ padding: '16px', fontSize: '13px', fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERIODS.map((time, idx) => {
                                const isBreak = time.includes('Break');
                                if (isBreak) {
                                    return (
                                        <tr key={idx} style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                            <td colSpan={DAYS.length + 1} style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#64748b', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                                {time}
                                            </td>
                                        </tr>
                                    );
                                }

                                const periodNum = idx < 3 ? idx + 1 : idx;
                                return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px', borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Period {periodNum}</span>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}>{time.split(' - ')[0]}<br/>{time.split(' - ')[1]}</span>
                                            </div>
                                        </td>
                                        {DAYS.map(day => {
                                            const dayClasses = timetable[day] || [];
                                            const classInfo = dayClasses.find(c => c.period === periodNum || (c.time && c.time.startsWith(time.split(' - ')[0])));
                                            
                                            return (
                                                <td key={day} style={{ padding: '12px', borderRight: '1px solid #e2e8f0', verticalAlign: 'top', minWidth: '140px' }}>
                                                    {classInfo ? (
                                                        <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>Class {classInfo.class_name} {classInfo.section}</div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' }}>
                                                                <BookOpen size={14} /> {classInfo.subject}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ padding: '12px', textAlign: 'center', color: '#cbd5e1', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic' }}>
                                                            Free Period
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherTimetable;
