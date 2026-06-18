import React from 'react';

const FeeCategories = () => {
    const categories = [
        { id: 1, name: 'Tuition Fee', type: 'Recurring', description: 'Monthly/Termly academic fee', status: 'Active' },
        { id: 2, name: 'Admission Fee', type: 'One-time', description: 'Charged at the time of new admission', status: 'Active' },
        { id: 3, name: 'Exam Fee', type: 'Recurring', description: 'Term examination charges', status: 'Active' },
        { id: 4, name: 'Transport Fee', type: 'Recurring', description: 'Monthly bus service charges', status: 'Active' },
        { id: 5, name: 'Hostel Fee', type: 'Recurring', description: 'Boarding and lodging charges', status: 'Active' },
        { id: 6, name: 'Library Fee', type: 'Annual', description: 'Yearly library maintenance', status: 'Active' },
        { id: 7, name: 'Activity Fee', type: 'Annual', description: 'Sports and co-curricular activities', status: 'Active' },
        { id: 8, name: 'Fine/Penalty', type: 'Conditional', description: 'Late fee or disciplinary fines', status: 'Active' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Fee Categories</h2>
                <button style={{ padding: '10px 20px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(14,165,233,0.2)' }}>
                    ➕ Add Category
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {categories.map((cat) => (
                    <div key={cat.id} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏷️</div>
                                <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{cat.name}</h3>
                            </div>
                            <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{cat.status}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{cat.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🗓️</span> {cat.type}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.6 }} title="Edit">✏️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeeCategories;
