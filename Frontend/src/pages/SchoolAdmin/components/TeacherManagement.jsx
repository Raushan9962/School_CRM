import React, { useState } from 'react';
import TeacherList from './TeacherList';
import TeacherForm from './TeacherForm';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';

const TeacherManagement = () => {
    const [view, setView] = useState('list'); // 'list' | 'create'

    // Inline style objects mapping standard Tailwind
    const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' };
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' };
    const titleStyle = { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' };
    const subTitleStyle = { margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' };
    const btnPrimary = { padding: '8px 16px', background: '#1e293b', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
    const btnSecondary = { padding: '8px 16px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

    return (
        <div style={containerStyle} className="animate-fade-in">
            <div style={headerStyle}>
                <div>
                    <h2 style={titleStyle}>Teacher Management</h2>
                    <p style={subTitleStyle}>Manage teaching staff, subjects, and performance.</p>
                </div>
                <div>
                    {view === 'list' ? (
                        <button onClick={() => setView('create')} style={btnPrimary}>
                            <Plus size={16} /> Add New Teacher
                        </button>
                    ) : (
                        <button onClick={() => setView('list')} style={btnSecondary}>
                            <ArrowLeft size={16} /> Back to List
                        </button>
                    )}
                </div>
            </div>

            {view === 'list' ? <TeacherList /> : <TeacherForm onSave={() => setView('list')} onCancel={() => setView('list')} />}
        </div>
    );
};

export default TeacherManagement;
