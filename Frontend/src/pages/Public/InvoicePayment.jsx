import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';
import { CheckCircle } from 'lucide-react';

const InvoicePayment = () => {
    const { id } = useParams(); // admission_request_id
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [status, setStatus] = useState('loading'); // loading, ready, paying, success, error
    const [credentials, setCredentials] = useState(null);

    useEffect(() => {
        fetch(`\${import.meta.env.VITE_API_BASE_URL}/admission/invoice/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.invoice) {
                    setInvoice(data.invoice);
                    setStatus('ready');
                } else {
                    setStatus('error');
                }
            })
            .catch(err => {
                console.error(err);
                setStatus('error');
            });
    }, [id]);

    const handlePayment = async () => {
        setStatus('paying');
        try {
            // MOCK PAYMENT PROCESS
            const res = await fetch(`\${import.meta.env.VITE_API_BASE_URL}/admission/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admission_request_id: id })
            });
            const data = await res.json();
            
            if (data.success) {
                setCredentials(data.credentials);
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'loading') return <div className="text-center mt-20">Loading invoice...</div>;
    if (status === 'error') return <div className="text-center mt-20 text-red-500">Error loading invoice or processing payment.</div>;

    const breakdown = typeof invoice.breakdown === 'string' ? JSON.parse(invoice.breakdown) : invoice.breakdown;

    return (
        <div className="min-h-screen bg-[#fdf5eb]">
            <TopBar />
            <Header />
            <Navbar />
            
            <main className="max-w-3xl mx-auto px-4 py-8">
                {status === 'success' ? (
                    <div className="bg-white p-8 rounded-xl shadow-md border border-green-200 text-center">
                        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
                        <h2 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h2>
                        <p className="mb-6 text-gray-600">Your admission has been confirmed and accounts have been created.</p>
                        
                        <div className="bg-orange-50 p-6 rounded-lg text-left mb-6 border border-orange-100">
                            <h3 className="font-bold text-lg mb-4 text-orange-800">Your Login Credentials</h3>
                            <p className="text-sm text-gray-500 mb-4">(These have also been sent to {invoice.phone} via SMS)</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <h4 className="font-bold border-b pb-2 mb-2">Student Login</h4>
                                    <p><span className="text-gray-500">Username:</span> {credentials.student.username}</p>
                                    <p><span className="text-gray-500">Password:</span> {credentials.student.password}</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <h4 className="font-bold border-b pb-2 mb-2">Parent Login</h4>
                                    <p><span className="text-gray-500">Username:</span> {credentials.parent.username}</p>
                                    <p><span className="text-gray-500">Password:</span> {credentials.parent.password}</p>
                                </div>
                            </div>
                        </div>
                        
                        <button onClick={() => navigate('/login/student')} className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                        <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');`}</style>
                        <div className="overflow-auto pb-4 mb-4">
                            <div className="bg-white font-mono text-[11px] text-black mx-auto shadow-sm"
                                style={{ width: '384px', border: '2px solid black', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                
                                {/* Top header — full width */}
                                <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>VidyaSetu School</div>
                                        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px', color: '#555' }}>ADMISSION INVOICE</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '28px', fontFamily: '"Libre Barcode 39", monospace', lineHeight: 1 }}>*ADM-{id}*</div>
                                        <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>ID: ADM-{id}</div>
                                    </div>
                                </div>

                                {/* Billed To */}
                                <div style={{ borderRight: '1px solid black', borderBottom: '1px solid black', padding: '12px 14px' }}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#888' }}>Billed To</div>
                                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{invoice.student_name || 'Student'}</div>
                                    <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Class: {invoice.class_name || 'N/A'}</div>
                                </div>

                                {/* Payment Info */}
                                <div style={{ borderBottom: '1px solid black', padding: '12px 14px', background: '#f9fafb' }}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', color: '#888' }}>Payment Info</div>
                                    <div style={{ fontSize: '10px' }}>Date: {new Date().toLocaleDateString()}</div>
                                    <div style={{ fontWeight: 700, fontSize: '12px', marginTop: '4px', color: invoice.status === 'Paid' ? '#16a34a' : '#dc2626' }}>
                                        STATUS: {invoice.status.toUpperCase()}
                                    </div>
                                </div>

                                {/* Issuer — full width */}
                                <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid black', padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '10px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#888', marginRight: '4px' }}>Issuer:</span>
                                    <span style={{ fontWeight: 700 }}>VidyaSetu School</span>
                                    <span style={{ color: '#555' }}>· 123 Education Lane, Learning City · Delhi 110001</span>
                                </div>

                                {/* Fee Table — full width */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                        <thead>
                                            <tr style={{ background: '#f3f4f6', borderBottom: '2px solid black' }}>
                                                <th style={{ padding: '6px 10px', textAlign: 'left', borderRight: '1px solid black', fontWeight: 700 }}>Description</th>
                                                <th style={{ padding: '6px 10px', borderRight: '1px solid black', width: '70px', fontWeight: 700 }}>Status</th>
                                                <th style={{ padding: '6px 10px', textAlign: 'right', width: '80px', fontWeight: 700 }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {breakdown.map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid black' }}>
                                                    <td style={{ padding: '8px 10px', borderRight: '1px solid black' }}>
                                                        <div style={{ fontWeight: 700 }}>{item.type}</div>
                                                    </td>
                                                    <td style={{ padding: '8px 10px', borderRight: '1px solid black', fontWeight: 700, fontSize: '10px' }}>
                                                        {invoice.status.toUpperCase()}
                                                    </td>
                                                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                                                        ₹{parseFloat(item.amount).toLocaleString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals Summary */}
                                <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', borderBottom: '2px solid black' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '11px' }}>
                                        <span>Total Amount:</span>
                                        <span>₹{parseFloat(invoice.total_amount).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '14px', fontWeight: 900, marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #ccc' }}>
                                        <span>Balance Due:</span>
                                        <span>₹{(invoice.status === 'Paid' ? 0 : parseFloat(invoice.total_amount)).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* Footer Barcode */}
                                <div style={{ gridColumn: '1 / -1', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div style={{ fontSize: '32px', fontFamily: '"Libre Barcode 39", monospace', lineHeight: 1 }}>*ADM-{id}*</div>
                                    <div style={{ textAlign: 'right', fontSize: '9px', color: '#666' }}>
                                        <div style={{ fontWeight: 700, color: '#000', marginBottom: '2px' }}>VidyaSetu School</div>
                                        <div>123 Education Lane</div>
                                        <div>Thank you!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {invoice.status !== 'Paid' && (() => {
                            const user = JSON.parse(localStorage.getItem('user') || 'null');
                            const isAdmin = user && (user.role === 'School Admin' || user.role === 'Admin');
                            if (isAdmin) {
                                return (
                                    <div className="flex justify-end pt-4">
                                        <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded font-semibold border border-gray-200">
                                            Waiting for parent to complete payment online...
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={handlePayment}
                                        disabled={status === 'paying'}
                                        className="px-8 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {status === 'paying' ? 'Processing...' : `Pay ₹${parseFloat(invoice.total_amount).toFixed(2)}`}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InvoicePayment;
