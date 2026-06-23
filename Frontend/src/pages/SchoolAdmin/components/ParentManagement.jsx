import React from 'react';

const ParentManagement = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-indigo-950 m-0">Parent Management</h2>
        <p className="text-slate-500 text-sm mt-1">Manage parent accounts and link them to students.</p>
      </div>
      
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Add Parent" icon="➕" color="#ec4899" />
        <ActionBtn text="View All Parents" icon="👨‍👩‍👧" color="#8b5cf6" />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', 
        borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', 
        border: '1px solid rgba(255,255,255,0.5)' 
      }}>
        <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Parent Directory</h3>
        <p className="text-slate-500">List of parents and linked children will be displayed here.</p>
      </div>
    </div>
  );
};

const ActionBtn = ({ text, icon, color }) => (
  <button style={{
    padding: '12px 20px', borderRadius: '12px', border: 'none',
    background: `linear-gradient(135deg, ${color}, ${color}dd)`, color: 'white',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: `0 4px 12px ${color}40`, transition: 'all 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <span>{icon}</span> {text}
  </button>
);

export default ParentManagement;
