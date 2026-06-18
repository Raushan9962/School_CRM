import React, { useState } from 'react';

const TeacherTimetable = () => {
    const [view, setView] = useState('weekly');

    const schedule = [
        { day: 'Monday', slots: [
            { time: '08:30 - 09:30', class: '10 - A', subject: 'Science', room: 'Lab 1', type: 'Regular' },
            { time: '09:30 - 10:30', class: '9 - B', subject: 'Physics', room: 'Room 201', type: 'Regular' },
            { time: '10:30 - 11:00', type: 'Break' },
            { time: '11:00 - 12:00', class: '10 - B', subject: 'Science', room: 'Lab 1', type: 'Regular' }
        ]},
        { day: 'Tuesday', slots: [
            { time: '08:30 - 09:30', class: '9 - A', subject: 'Physics', room: 'Room 202', type: 'Regular' },
            { time: '09:30 - 10:30', class: '8 - C', subject: 'Science', room: 'Room 105', type: 'Substitute', originalTeacher: 'Mr. Verma' },
            { time: '10:30 - 11:00', type: 'Break' }
        ]}
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>My Timetable</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📥 Download PDF
                    </button>
                    <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        🔄 Request Shift Change
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['weekly', 'daily'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setView(tab)}
                        style={{
                            padding: '8px 16px',
                            background: view === tab ? '#10b981' : 'white',
                            color: view === tab ? 'white' : '#64748b',
                            border: view === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab} View
                    </button>
                ))}
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {schedule.map((dayObj, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>{dayObj.day}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                                {dayObj.slots.map((slot, sIdx) => (
                                    <div key={sIdx} style={{ padding: '16px', borderRadius: '12px', border: '1px solid', borderColor: slot.type === 'Break' ? '#cbd5e1' : (slot.type === 'Substitute' ? '#fde68a' : '#bfdbfe'), background: slot.type === 'Break' ? '#f8fafc' : (slot.type === 'Substitute' ? '#fffbeb' : '#eff6ff') }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: slot.type === 'Break' ? '#64748b' : (slot.type === 'Substitute' ? '#d97706' : '#2563eb') }}>{slot.time}</span>
                                            {slot.type !== 'Break' && (
                                                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: slot.type === 'Substitute' ? '#fef3c7' : '#dbeafe', color: slot.type === 'Substitute' ? '#b45309' : '#1d4ed8' }}>{slot.type}</span>
                                            )}
                                        </div>
                                        {slot.type === 'Break' ? (
                                            <h4 style={{ margin: 0, fontSize: '16px', color: '#64748b', textAlign: 'center' }}>Break</h4>
                                        ) : (
                                            <>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>{slot.class} • {slot.subject}</h4>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>📍 {slot.room}</p>
                                                {slot.originalTeacher && (
                                                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#d97706', fontStyle: 'italic' }}>Subbing for {slot.originalTeacher}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherTimetable;
