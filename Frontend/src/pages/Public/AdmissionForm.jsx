import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';

const AdmissionForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_name: '', dob: '', gender: '', blood_group: '', category: '', aadhaar_number: '',
        father_name: '', father_occupation: '',
        mother_name: '', mother_occupation: '',
        phone: '', alternate_phone: '', email: '',
        class_applied_for: '',
        address: '', city: '', state: '', pincode: '',
        transport_required: false, previous_school: ''
    });

    const [classes, setClasses] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/classes')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setClasses(data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const res = await fetch('http://localhost:5000/api/admission/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf5eb]">
            <TopBar />
            <Header />
            <Navbar />
            
            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white p-8 rounded-xl shadow-md border border-orange-100">
                    <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center border-b pb-4">Student Admission Application</h2>
                    
                    {status === 'success' ? (
                        <div className="bg-green-100 text-green-800 p-8 rounded-lg text-center">
                            <h3 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h3>
                            <p className="text-lg">Your admission request has been sent to the school administration. We will review it and notify you via email/phone regarding the next steps and fee payment.</p>
                            <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 font-bold">Return to Home</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* SECTION 1: Personal Details */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">1. Student Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Full Name *</label>
                                        <input required type="text" name="student_name" value={formData.student_name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-orange-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                                        <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                        <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
                                            <option value="">Select...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full p-2 border rounded">
                                            <option value="">Select...</option>
                                            <option value="A+">A+</option><option value="A-">A-</option>
                                            <option value="B+">B+</option><option value="B-">B-</option>
                                            <option value="O+">O+</option><option value="O-">O-</option>
                                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                                            <option value="">Select...</option>
                                            <option value="General">General</option>
                                            <option value="OBC">OBC</option>
                                            <option value="SC">SC</option>
                                            <option value="ST">ST</option>
                                            <option value="EWS">EWS</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                                        <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} className="w-full p-2 border rounded" placeholder="12-digit Aadhaar" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Admission & Academic Details */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">2. Admission & Academic Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Applying For *</label>
                                        <select required name="class_applied_for" value={formData.class_applied_for} onChange={handleChange} className="w-full p-2 border rounded focus:ring-orange-500">
                                            <option value="">Select a class...</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Previous School Name</label>
                                        <input type="text" name="previous_school" value={formData.previous_school} onChange={handleChange} className="w-full p-2 border rounded" placeholder="If applicable" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Parent/Guardian Details */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">3. Parent/Guardian Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
                                        <input required type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                                        <input type="text" name="father_occupation" value={formData.father_occupation} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
                                        <input required type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                                        <input type="text" name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: Contact & Transport Details */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">4. Contact & Transport Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Primary Phone *</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Alternate Phone</label>
                                        <input type="tel" name="alternate_phone" value={formData.alternate_phone} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email Address *</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div className="flex items-center mt-6">
                                        <input type="checkbox" id="transport" name="transport_required" checked={formData.transport_required} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded border-gray-300" />
                                        <label htmlFor="transport" className="ml-2 text-sm font-bold text-gray-700">School Transport Required?</label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded mb-4" placeholder="Street Address / House No." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                        <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                                        <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                </div>
                            </div>
                            
                            {status === 'error' && (
                                <p className="text-red-600 text-center font-bold bg-red-50 p-3 rounded border border-red-200">There was an error submitting your application. Please try again.</p>
                            )}
                            
                            <div className="flex justify-end pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 mr-4 font-bold"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={status === 'submitting'}
                                    className="px-8 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 font-bold text-lg shadow-md"
                                >
                                    {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdmissionForm;
