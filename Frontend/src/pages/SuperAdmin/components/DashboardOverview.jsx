import React from 'react';
import StatCard from '../../../components/layout/StatCard';

const DashboardOverview = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard 
            title="Schools Overview" 
            metrics={[
                { label: 'Total Schools', value: '48' },
                { label: 'Active Plans', value: '45' }
            ]}
        />
        <StatCard 
            title="Revenue Overview" 
            metrics={[
                { label: 'Monthly Revenue', value: '₹1.2M' }
            ]}
            bottomComponent={
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select style={{ padding: '6px 12px', border: 'none', background: 'transparent', color: '#475569', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>This Year</option>
                    </select>
                </div>
            }
        />
        <StatCard 
            title="Platform Usage" 
            extraHeaderIcon={<span className="material-icons">refresh</span>}
            metrics={[
                { label: 'Total Users', value: '12,540' },
                { label: 'New This Week', value: '350' }
            ]}
            bottomComponent={
                <div style={{ textAlign: 'right' }}>
                    <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>View Analytics</a>
                </div>
            }
        />
      </div>

      <div style={{ 
        background: '#ffffff', 
        borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', 
        border: '1px solid #e2e8f0' 
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>Platform Activity</h3>
        <p className="text-slate-500">Graphs and recent activity logs will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
