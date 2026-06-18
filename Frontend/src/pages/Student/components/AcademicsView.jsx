import React, { useState } from 'react';

const AcademicsView = () => {
    const [activeTab, setActiveTab] = useState('study-materials');

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Academics & Study Materials</h2>
                <button style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    🙋‍♂️ Ask Doubt to Teacher
                </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <button onClick={() => setActiveTab('study-materials')} style={{ padding: '8px 16px', background: activeTab === 'study-materials' ? '#eff6ff' : 'transparent', color: activeTab === 'study-materials' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    📚 Study Materials & Notes
                </button>
                <button onClick={() => setActiveTab('lectures')} style={{ padding: '8px 16px', background: activeTab === 'lectures' ? '#eff6ff' : 'transparent', color: activeTab === 'lectures' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    🎥 Recorded Lectures
                </button>
                <button onClick={() => setActiveTab('syllabus')} style={{ padding: '8px 16px', background: activeTab === 'syllabus' ? '#eff6ff' : 'transparent', color: activeTab === 'syllabus' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    📑 Syllabus
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>Subjects</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {subjects.map((sub, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', ':hover': { background: '#f8fafc' } }}>
                                <input type="checkbox" defaultChecked={idx === 0} style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }} />
                                <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{sub}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
                    {activeTab === 'study-materials' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                            {[
                                { title: 'Chapter 5: Calculus Notes', subject: 'Mathematics', type: 'PDF', size: '2.4 MB' },
                                { title: 'Physics Formula Sheet', subject: 'Physics', type: 'PDF', size: '1.1 MB' },
                                { title: 'Organic Chemistry Reactions', subject: 'Chemistry', type: 'DOCX', size: '3.5 MB' },
                                { title: 'English Grammar Rules', subject: 'English', type: 'PDF', size: '1.8 MB' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer', ':hover': { borderColor: '#3b82f6', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.1)' } }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: item.type === 'PDF' ? '#fee2e2' : '#e0e7ff', color: item.type === 'PDF' ? '#ef4444' : '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                                        {item.type === 'PDF' ? '📄' : '📝'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>{item.title}</h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{item.subject} • {item.size}</p>
                                    </div>
                                    <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3b82f6' }}>
                                        ⬇️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'lectures' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {[
                                { title: 'Integration Basics', subject: 'Mathematics', duration: '45 mins', date: '15 Oct 2026' },
                                { title: 'Laws of Motion', subject: 'Physics', duration: '52 mins', date: '14 Oct 2026' },
                                { title: 'Chemical Bonding', subject: 'Chemistry', duration: '38 mins', date: '12 Oct 2026' },
                            ].map((lec, idx) => (
                                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', ':hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}>
                                    <div style={{ height: '160px', background: '#cbd5e1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>▶️</div>
                                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{lec.duration}</span>
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>{lec.subject}</span>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#1e293b' }}>{lec.title}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Recorded: {lec.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'syllabus' && (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                            <span style={{ fontSize: '48px' }}>📑</span>
                            <h3 style={{ margin: '16px 0 8px', color: '#1e293b' }}>Annual Syllabus 2026-27</h3>
                            <p style={{ margin: '0 0 24px', fontSize: '14px' }}>Download the complete syllabus for all subjects.</p>
                            <button style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                Download Syllabus PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicsView;
