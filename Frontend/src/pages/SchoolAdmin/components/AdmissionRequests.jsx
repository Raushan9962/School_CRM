import React, { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';

const AdmissionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [credentialsModal, setCredentialsModal] = useState(null);

    const fetchRequests = () => {
        fetch('http://localhost:5000/api/admission/requests')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRequests(data.requests);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admission/approve/${id}`, {
                method: 'POST'
            });
            const data = await res.json();
            if (data.success) {
                if (data.credentials) {
                    setCredentialsModal({
                        ...data.credentials,
                        student_name: requests.find(r => r.id === id)?.student_name || 'Student'
                    });
                } else {
                    alert('Request approved and Invoice Generated.');
                }
                fetchRequests();
            } else {
                alert('Failed to approve request');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Admission Requests</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-gray-600">Student Name</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Class</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Parent</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Contact</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                            <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">No requests found.</td>
                            </tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{req.student_name}</td>
                                    <td className="px-4 py-3">{req.class_name}</td>
                                    <td className="px-4 py-3">{req.father_name}</td>
                                    <td className="px-4 py-3">{req.phone}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold 
                                            ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${req.status === 'Approved' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${req.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                                        `}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        {req.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleApprove(req.id)}
                                                className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Approve & Generate Invoice"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        {req.status === 'Approved' && (
                                            <button 
                                                onClick={() => window.open('/invoice/' + req.id, '_blank')}
                                                className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="View Invoice"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Credentials Modal */}
            {credentialsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 text-lg">Admission Approved</h3>
                            <button onClick={() => setCredentialsModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="text-center text-sm text-green-600 font-semibold mb-4 bg-green-50 p-2 rounded">
                                User accounts successfully created! Notifications sent via Email/SMS.
                            </div>
                            
                            {/* Student Credentials */}
                            {credentialsModal.student && (
                            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
                                <h4 className="text-sm font-bold text-blue-800 uppercase mb-3">Student Login ({credentialsModal.student_name})</h4>
                                <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                                    <span className="text-gray-500 font-medium">User ID:</span>
                                    <span className="col-span-2 font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded border">{credentialsModal.student.username}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <span className="text-gray-500 font-medium">Password:</span>
                                    <span className="col-span-2 font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded border">{credentialsModal.student.password}</span>
                                </div>
                            </div>
                            )}

                            {/* Parent Credentials */}
                            {credentialsModal.parent && (
                            <div className="border border-purple-100 rounded-lg p-4 bg-purple-50/30">
                                <h4 className="text-sm font-bold text-purple-800 uppercase mb-3">Parent Login</h4>
                                <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                                    <span className="text-gray-500 font-medium">User ID:</span>
                                    <span className="col-span-2 font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded border">{credentialsModal.parent.username}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <span className="text-gray-500 font-medium">Password:</span>
                                    <span className="col-span-2 font-mono font-bold text-gray-800 bg-white px-2 py-1 rounded border">{credentialsModal.parent.password}</span>
                                </div>
                            </div>
                            )}

                            <div className="pt-2">
                                <p className="text-xs text-gray-500 italic text-center mb-4">Please ensure to note down these credentials. They have been sent to the parent's registered email and phone number.</p>
                                <button 
                                    onClick={() => setCredentialsModal(null)} 
                                    className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdmissionRequests;
