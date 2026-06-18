import React, { useState } from 'react';

const TimetableView = () => {
    const [view, setView] = useState('daily');
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [activeDay, setActiveDay] = useState('Monday');

    const schedule = [
        { time: '08:00 AM - 08:45 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 101', type: 'Theory' },
        { time: '08:45 AM - 09:30 AM', subject: 'Physics', teacher: 'Mrs. Sunita Sharma', room: 'Lab 2', type: 'Practical' },
        { time: '09:30 AM - 09:45 AM', subject: 'Break', isBreak: true },
        { time: '09:45 AM - 10:30 AM', subject: 'Chemistry', teacher: 'Mr. Amit Patel', room: 'Room 101', type: 'Theory' },
        { time: '10:30 AM - 11:15 AM', subject: 'English', teacher: 'Ms. Priya Singh', room: 'Room 101', type: 'Theory' },
        { time: '11:15 AM - 12:00 PM', subject: 'Lunch Break', isBreak: true },
        { time: '12:00 PM - 12:45 PM', subject: 'Computer Science', teacher: 'Mr. Rohan Gupta', room: 'Computer Lab 1', type: 'Practical' },
        { time: '12:45 PM - 01:30 PM', subject: 'Physical Education', teacher: 'Mr. Vikram Singh', room: 'Playground', type: 'Sports' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Class Timetable</h2>
                <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    ⬇️ Download Timetable
                </button>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                        <button onClick={() => setView('daily')} style={{ padding: '6px 16px', background: view === 'daily' ? 'white' : 'transparent', color: view === 'daily' ? '#0f172a' : '#64748b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', boxShadow: view === 'daily' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                            Daily View
                        </button>
                        <button onClick={() => setView('weekly')} style={{ padding: '6px 16px', background: view === 'weekly' ? 'white' : 'transparent', color: view === 'weekly' ? '#0f172a' : '#64748b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', boxShadow: view === 'weekly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                            Weekly View
                        </button>
                    </div>

                    {view === 'daily' && (
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                            {days.map(day => (
                                <button key={day} onClick={() => setActiveDay(day)} style={{ padding: '6px 12px', background: activeDay === day ? '#3b82f6' : 'transparent', color: activeDay === day ? 'white' : '#64748b', border: activeDay === day ? 'none' : '1px solid #cbd5e1', borderRadius: '20px', fontWeight: '500', fontSize: '13px', cursor: 'pointer' }}>
                                    {day}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {view === 'daily' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {schedule.map((slot, idx) => (
                            slot.isBreak ? (
                                <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontWeight: '500', fontSize: '14px', border: '1px dashed #cbd5e1' }}>
                                    ☕ {slot.time} • {slot.subject}
                                </div>
                            ) : (
                                <div key={idx} style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', alignItems: 'center' }}>
                                    <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '12px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', minWidth: '160px', textAlign: 'center' }}>
                                        {slot.time}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {slot.subject}
                                                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: slot.type === 'Theory' ? '#e0e7ff' : (slot.type === 'Practical' ? '#dcfce7' : '#fef3c7'), color: slot.type === 'Theory' ? '#4f46e5' : (slot.type === 'Practical' ? '#166534' : '#b45309'), fontWeight: '600' }}>
                                                    {slot.type}
                                                </span>
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>👨‍🏫 {slot.teacher}</p>
                                        </div>
                                        <div style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: '500', fontSize: '14px' }}>
                                            🏫 {slot.room}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                        <span style={{ fontSize: '48px' }}>📅</span>
                        <h3 style={{ margin: '16px 0 8px', color: '#1e293b' }}>Weekly View Layout</h3>
                        <p style={{ margin: 0 }}>The full weekly grid timetable is available in the downloaded PDF.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimetableView;
