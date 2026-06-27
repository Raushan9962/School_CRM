import React from 'react';

const Recommendations = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl text-slate-900">Recommendations & Alerts</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Academic Recommendations */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        💡 Academic Recommendations
                    </h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { title: 'Extra Help Needed', desc: '5 students in Class 10-A scored below 40% in Unit Test 2.', action: 'Schedule Remedial Class' },
                            { title: 'Syllabus Pace', desc: 'Class 9-B Physics syllabus is slightly behind schedule.', action: 'Adjust Lesson Plan' }
                        ].map((rec, idx) => (
                            <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{rec.title}</h4>
                                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#475569' }}>{rec.desc}</p>
                                <button style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{rec.action}</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discipline Alerts */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⚠️ Discipline & Attendance Alerts
                    </h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { title: 'Low Attendance', desc: 'Ishaan Singh (10-A) has been absent for 3 consecutive days.', level: 'High', action: 'Contact Parent' },
                            { title: 'Late Submissions', desc: '3 students in 9-B constantly submitting assignments late.', level: 'Medium', action: 'Send Warning' }
                        ].map((alert, idx) => (
                            <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: alert.level === 'High' ? '#fee2e2' : '#fef3c7', borderLeft: `4px solid ${alert.level === 'High' ? '#ef4444' : '#f59e0b'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b' }}>{alert.title}</h4>
                                    <span style={{ fontSize: '11px', fontWeight: '600', color: alert.level === 'High' ? '#ef4444' : '#d97706' }}>{alert.level} Priority</span>
                                </div>
                                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#475569' }}>{alert.desc}</p>
                                <button style={{ padding: '6px 12px', background: 'white', color: alert.level === 'High' ? '#ef4444' : '#d97706', border: `1px solid ${alert.level === 'High' ? '#ef4444' : '#f59e0b'}`, borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{alert.action}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
