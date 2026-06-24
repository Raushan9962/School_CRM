import React, { useState } from 'react';
import TeacherList from './TeacherList';
import TeacherForm from './TeacherForm';

const TeacherManagement = () => {
    const [view, setView] = useState('list'); // 'list' | 'create'

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-indigo-950 m-0">Teacher Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage teaching staff, subjects, and performance.</p>
                </div>
                <div>
                    {view === 'list' ? (
                        <button 
                            onClick={() => setView('create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                        >
                            <span>➕</span> Add New Teacher
                        </button>
                    ) : (
                        <button 
                            onClick={() => setView('list')}
                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                        >
                            Back to List
                        </button>
                    )}
                </div>
            </div>

            {view === 'list' ? <TeacherList /> : <TeacherForm onSave={() => setView('list')} onCancel={() => setView('list')} />}
        </div>
    );
};

export default TeacherManagement;
