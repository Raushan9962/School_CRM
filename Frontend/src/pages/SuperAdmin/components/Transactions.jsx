import React from 'react';

const Transactions = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-indigo-950 m-0">Transactions</h2>
        <p className="text-slate-500 text-sm mt-1">Manage and track all payment transactions across schools.</p>
      </div>
      
      <div className="flex gap-3 mb-6 flex-wrap">
        <ActionBtn text="Add Transaction" icon="➕" color="#3b82f6" />
        <ActionBtn text="Export Report" icon="⬇️" color="#10b981" />
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', 
        borderRadius: '16px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', 
        border: '1px solid rgba(255,255,255,0.5)' 
      }}>
        <h3 className="m-0 mb-4 text-base font-bold text-slate-800">Transaction History</h3>
        <p className="text-slate-500">A detailed ledger of all platform transactions will be displayed here.</p>
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

export default Transactions;
