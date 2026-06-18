import React, { useState } from 'react';

const StudyMaterials = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const materials = [
        { id: 1, title: 'Chapter 1 Notes', type: 'PDF', class: 'Class 10 - A', date: '20-Oct-2026', size: '2.4 MB' },
        { id: 2, title: 'Newton\'s Laws Explanation', type: 'Video', class: 'Class 10 - B', date: '18-Oct-2026', size: '150 MB' },
        { id: 3, title: 'Important Physics Formulas', type: 'External Link', class: 'Class 9 - A', date: '15-Oct-2026', size: '-' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Study Materials</h2>
                <button onClick={() => setIsUploadModalOpen(true)} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59,130,246,0.2)' }}>
                    📤 Upload Material
                </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                {['All Files', 'PDFs & Notes', 'Videos', 'External Links'].map((tab, idx) => (
                    <button
                        key={idx}
                        style={{
                            padding: '8px 16px',
                            background: idx === 0 ? '#10b981' : 'white',
                            color: idx === 0 ? 'white' : '#64748b',
                            border: idx === 0 ? 'none' : '1px solid #cbd5e1',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {materials.map(mat => (
                    <div key={mat.id} style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: mat.type === 'PDF' ? '#fee2e2' : (mat.type === 'Video' ? '#eff6ff' : '#fef3c7'), color: mat.type === 'PDF' ? '#dc2626' : (mat.type === 'Video' ? '#3b82f6' : '#d97706'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                            {mat.type === 'PDF' ? '📄' : (mat.type === 'Video' ? '🎥' : '🔗')}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>{mat.title}</h3>
                            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>{mat.class}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{mat.date} • {mat.size}</span>
                                <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Upload Study Material</h3>
                            <button onClick={() => setIsUploadModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Target Class</label>
                                <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                                    <option>Class 10 - A (Science)</option>
                                    <option>Class 9 - B (Physics)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Material Type</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {['PDF/Document', 'Video', 'External Link'].map(type => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569' }}>
                                            <input type="radio" name="materialType" defaultChecked={type === 'PDF/Document'} /> {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Title</label>
                                <input type="text" placeholder="e.g. Chapter 1 Notes" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>File / Link</label>
                                <input type="file" style={{ width: '100%', fontSize: '14px', color: '#64748b' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={() => setIsUploadModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={() => setIsUploadModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyMaterials;
