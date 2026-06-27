import React from 'react';

const ExpiringSoon = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-indigo-950 m-0">Expiring Soon</h2>
        <p className="text-slate-500 text-sm mt-1">Monitor school subscriptions expiring within 30 days.</p>
      </div>
      
      <div className="flex gap-3 mb-4 flex-wrap">
        <ActionBtn text="Send Reminders" icon="🔔" color="#f59e0b" />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', 
        borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', 
        border: '1px solid rgba(255,255,255,0.5)' 
      }}>
        <h3 className="m-0 mb-4 text-sm font-bold text-slate-800">Upcoming Expirations</h3>
        <p className="text-slate-500">List of expiring schools will be shown here.</p>
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

export default ExpiringSoon;
