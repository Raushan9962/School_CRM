import React from 'react';

const FinanceOverview = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Total Collections</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>$450K</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>This Academic Year</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Pending Dues</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>$52K</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>From 120 Students</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Total Expenses</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>$125K</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>This Quarter</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Recent Transactions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <th style={{ padding: '12px', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Description</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Type</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>Today, 10:30 AM</td>
                            <td style={{ padding: '12px' }}>Term 2 Fee - John Doe</td>
                            <td style={{ padding: '12px' }}><span style={{ color: '#10b981' }}>Income</span></td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>+$800.00</td>
                            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px' }}>Completed</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>Yesterday, 02:15 PM</td>
                            <td style={{ padding: '12px' }}>Vendor Payment - Office Supplies</td>
                            <td style={{ padding: '12px' }}><span style={{ color: '#ef4444' }}>Expense</span></td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>-$450.00</td>
                            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '12px' }}>Completed</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceOverview;
