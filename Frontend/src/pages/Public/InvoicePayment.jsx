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
        fetch(`http://localhost:5000/api/admission/invoice/${id}`)
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
            const res = await fetch('http://localhost:5000/api/admission/pay', {
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Admission Fee Invoice</h2>
                        
                        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Student Name</p>
                                <p className="font-semibold">{invoice.student_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Class</p>
                                <p className="font-semibold">{invoice.class_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Invoice Status</p>
                                <p className={`font-bold ${invoice.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{invoice.status}</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-bold mb-4 border-b pb-2">Fee Breakdown</h3>
                            {breakdown.map((item, idx) => (
                                <div key={idx} className="flex justify-between py-2">
                                    <span className="text-gray-600">{item.type}</span>
                                    <span className="font-semibold">₹{parseFloat(item.amount).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-3 mt-2 border-t border-gray-300 font-bold text-lg">
                                <span>Total Amount</span>
                                <span className="text-orange-700">₹{parseFloat(invoice.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {invoice.status !== 'Paid' && (
                            <div className="flex justify-end pt-4">
                                <button 
                                    onClick={handlePayment}
                                    disabled={status === 'paying'}
                                    className="px-8 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {status === 'paying' ? 'Processing...' : `Pay ₹${parseFloat(invoice.total_amount).toFixed(2)}`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InvoicePayment;
