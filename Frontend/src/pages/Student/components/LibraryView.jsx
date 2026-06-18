import React, { useState } from 'react';

const LibraryView = () => {
    const [activeTab, setActiveTab] = useState('issued');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Library Management</h2>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1, padding: '24px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '16px', opacity: 0.9 }}>Books Issued</p>
                    <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>2<span style={{ fontSize: '18px', fontWeight: 'normal', opacity: 0.8 }}>/4 Limit</span></p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>📚</span>
                </div>
                <div style={{ flex: 1, padding: '24px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '16px', opacity: 0.9 }}>Total Fine Due</p>
                    <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>₹ 15</p>
                    <span style={{ position: 'absolute', right: -10, bottom: -20, fontSize: '100px', opacity: 0.1 }}>💰</span>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                    <button onClick={() => setActiveTab('issued')} style={{ flex: 1, padding: '16px', background: activeTab === 'issued' ? '#f8fafc' : 'white', border: 'none', borderBottom: activeTab === 'issued' ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === 'issued' ? '#3b82f6' : '#64748b', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        📖 Currently Issued Books
                    </button>
                    <button onClick={() => setActiveTab('available')} style={{ flex: 1, padding: '16px', background: activeTab === 'available' ? '#f8fafc' : 'white', border: 'none', borderBottom: activeTab === 'available' ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === 'available' ? '#3b82f6' : '#64748b', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        🔍 Browse Available Books
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    {activeTab === 'issued' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { title: 'Advanced Engineering Mathematics', author: 'Erwin Kreyszig', issuedOn: '10 Oct 2026', dueOn: '25 Oct 2026', fine: 0, status: 'Normal' },
                                { title: 'Concepts of Physics - Vol 1', author: 'H.C. Verma', issuedOn: '01 Oct 2026', dueOn: '15 Oct 2026', fine: 15, status: 'Overdue' }
                            ].map((book, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: book.status === 'Overdue' ? '#fef2f2' : 'white' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>{book.title}</h4>
                                        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>By {book.author}</p>
                                        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#475569' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📅 Issued: {book.issuedOn}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: book.status === 'Overdue' ? '#dc2626' : '#475569', fontWeight: book.status === 'Overdue' ? '600' : 'normal' }}>
                                                ⏰ Due: {book.dueOn}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                        {book.fine > 0 && <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '14px', background: '#fee2e2', padding: '4px 12px', borderRadius: '12px' }}>Fine: ₹ {book.fine}</span>}
                                        <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            🔄 Request Renewal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <input type="text" placeholder="Search books by title, author, or ISBN..." style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }} />
                                <select style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                    <option>All Categories</option>
                                    <option>Science</option>
                                    <option>Mathematics</option>
                                    <option>Literature</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {[
                                    { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Literature', available: 3 },
                                    { title: 'Brief History of Time', author: 'Stephen Hawking', category: 'Science', available: 1 },
                                    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', available: 0 },
                                    { title: 'Fundamentals of Physics', author: 'Halliday & Resnick', category: 'Physics', available: 5 }
                                ].map((book, idx) => (
                                    <div key={idx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{book.category}</span>
                                            <h4 style={{ margin: '4px 0', fontSize: '16px', color: '#1e293b' }}>{book.title}</h4>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{book.author}</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: book.available > 0 ? '#10b981' : '#dc2626' }}>
                                                {book.available > 0 ? `${book.available} copies available` : 'Out of stock'}
                                            </span>
                                            <button disabled={book.available === 0} style={{ padding: '6px 12px', background: book.available > 0 ? '#3b82f6' : '#cbd5e1', border: 'none', color: 'white', borderRadius: '6px', fontWeight: '600', cursor: book.available > 0 ? 'pointer' : 'not-allowed' }}>
                                                {book.available > 0 ? 'Reserve' : 'Waitlist'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LibraryView;
