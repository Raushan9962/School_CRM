import React, { useState } from 'react';
import PlaceholderView from '../../Principal/components/PlaceholderView';

const ExamManagement = () => {
    const [activeTab, setActiveTab] = useState('marks');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="m-0 text-2xl text-slate-900">Exam Management</h2>
                <div className="flex gap-3">
                    <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📊 Generate Report Cards
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                        ➕ Create Exam
                    </button>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200 pb-4">
                {['marks', 'schedule', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? '#10b981' : 'white',
                            color: activeTab === tab ? 'white' : '#64748b',
                            border: activeTab === tab ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab === 'marks' ? 'Enter/Update Marks' : tab === 'schedule' ? 'Exam Schedules' : 'Subject Analytics'}
                    </button>
                ))}
            </div>

            {activeTab === 'marks' && (
                <div className="flex flex-col gap-6">
                    <div style={{ display: 'flex', gap: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                            <option>Class 10 - A</option>
                            <option>Class 9 - B</option>
                        </select>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                            <option>Unit Test 2</option>
                            <option>Half Yearly</option>
                        </select>
                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', minWidth: '150px' }}>
                            <option>Science</option>
                            <option>Physics</option>
                        </select>
                        <button style={{ padding: '10px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Fetch List</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Unit Test 2 - Science (Max Marks: 40)</h3>
                            <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Publish Results</button>
                        </div>
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Roll No</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Student Name</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Marks Obtained</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { roll: 1, name: 'Aarav Patel', marks: 38 },
                                    { roll: 2, name: 'Diya Sharma', marks: 35 },
                                    { roll: 3, name: 'Rohan Gupta', marks: '' }
                                ].map((student, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b' }}>{student.roll}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{student.name}</td>
                                        <td style={{ padding: '16px' }}>
                                            <input type="number" defaultValue={student.marks} placeholder="Enter marks" style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100px', outline: 'none' }} />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <input type="text" placeholder="Add remark..." style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', outline: 'none' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ padding: '4px 8px', background: '#eff6ff', color: '#3b82f6', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Upcoming</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>25-Oct-2026</span>
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Unit Test 2</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Class 10 - A • Science</p>
                    </div>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Draft</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>10-Nov-2026</span>
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Half Yearly</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Class 9 - B • Physics</p>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="mt-4">
                    <PlaceholderView title="Subject Analytics" />
                </div>
            )}

            {/* Create Exam Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="m-0 text-xl text-slate-900">Create Exam</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Exam Type</label>
                                <select className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                                    <option>Unit Test</option>
                                    <option>Half Yearly</option>
                                    <option>Final Exam</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Select Class</label>
                                <select className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none">
                                    <option>Class 10 - A</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Exam Date</label>
                                    <input type="date" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-slate-700">Max Marks</label>
                                    <input type="number" placeholder="e.g. 100" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Exam</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
