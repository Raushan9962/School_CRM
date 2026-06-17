import React from 'react';

const LibrarianOverview = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Total Books</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>4,520</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Across all categories</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Books Issued</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>342</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Currently borrowed</p>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Overdue Books</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>18</p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: 0.8 }}>Fines pending</p>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#1e293b' }}>Recent Library Activity</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>📖</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Harry Potter and the Sorcerer's Stone - Issued</p>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>To: Alice Smith (Grade 10)</span>
                        </div>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>🔙</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#334155' }}>Introduction to Algorithms - Returned</p>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>By: Bob Johnson (Grade 12)</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LibrarianOverview;
