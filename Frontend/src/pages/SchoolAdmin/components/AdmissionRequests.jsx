import React, { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';

const AdmissionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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
                alert('Request approved and Invoice Generated. Link: http://localhost:5173/invoice/' + id);
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
        </div>
    );
};

export default AdmissionRequests;
