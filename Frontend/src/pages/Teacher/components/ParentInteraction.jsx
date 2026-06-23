import React, { useState } from 'react';

const ParentInteraction = () => {
    const [isPtmModalOpen, setIsPtmModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState('');

    const parents = [
        { id: 1, studentName: 'Aarav Patel', rollNo: '1', class: '10 - A', parentName: 'Mr. Rakesh Patel', phone: '+91 98765 43210', email: 'rakesh.patel@email.com', lastMeeting: '15-Sep-2026' },
        { id: 2, studentName: 'Diya Sharma', rollNo: '2', class: '10 - A', parentName: 'Mrs. Sunita Sharma', phone: '+91 87654 32109', email: 'sunita.sharma@email.com', lastMeeting: '20-Sep-2026' }
    ];

    const meetingHistory = [
        { id: 'PTM-001', date: '20-Sep-2026', student: 'Diya Sharma', parent: 'Mrs. Sunita Sharma', topic: 'Academic Progress Review', status: 'Completed', notes: 'Discussed improvement in Mathematics.' },
        { id: 'PTM-002', date: '25-Oct-2026', student: 'Aarav Patel', parent: 'Mr. Rakesh Patel', topic: 'Behavioral Feedback', status: 'Scheduled', notes: '-' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Parent Interaction</h2>
                <button onClick={() => setIsPtmModalOpen(true)} style={{ padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(16,185,129,0.2)' }}>
                    📅 Schedule PTM
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Parent Contact Directory</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Student</th>
                                    <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Parent Name</th>
                                    <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Contact Details</th>
                                    <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Last Meeting</th>
                                    <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.map((p, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{p.studentName}</p>
                                            <span className="text-xs text-slate-500">Roll: {p.rollNo} | {p.class}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{p.parentName}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p className="m-0 mb-1 text-[13px] text-slate-500">📞 {p.phone}</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>✉️ {p.email}</p>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>{p.lastMeeting}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button onClick={() => { setSelectedParent(p.parentName); setIsFeedbackModalOpen(true); }} style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                                Share Feedback
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Meeting History</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                        {meetingHistory.map(meeting => (
                            <div key={meeting.id} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{meeting.topic}</h4>
                                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: meeting.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: meeting.status === 'Completed' ? '#166534' : '#d97706' }}>
                                        {meeting.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                                    <div className="flex gap-2"><strong>Date:</strong> {meeting.date}</div>
                                    <div className="flex gap-2"><strong>Parent:</strong> {meeting.parent} ({meeting.student})</div>
                                    <div className="flex gap-2"><strong>Notes:</strong> {meeting.notes}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule PTM Modal */}
            {isPtmModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="m-0 text-xl text-slate-900">Schedule PTM</h3>
                            <button onClick={() => setIsPtmModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Select Parent/Student</label>
                                <select className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                                    <option>Mr. Rakesh Patel (Aarav Patel)</option>
                                    <option>Mrs. Sunita Sharma (Diya Sharma)</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Date</label>
                                    <input type="date" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Time</label>
                                    <input type="time" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Topic/Agenda</label>
                                <input type="text" placeholder="e.g. Discuss Term 1 Results" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsPtmModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsPtmModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Send Invite</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Feedback Modal */}
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="m-0 text-xl text-slate-900">Share Feedback</h3>
                            <button onClick={() => setIsFeedbackModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', fontWeight: '500', fontSize: '15px' }}>
                                To: {selectedParent}
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Feedback Type</label>
                                <select className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                                    <option>Academic Performance</option>
                                    <option>Behavioral Observation</option>
                                    <option>Appreciation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Message</label>
                                <textarea rows="4" placeholder="Write your feedback here..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsFeedbackModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsFeedbackModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Send Feedback</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentInteraction;
