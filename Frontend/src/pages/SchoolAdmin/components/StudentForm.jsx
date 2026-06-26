import React, { useState } from 'react';
import apiFetch from '../../../services/api';

const StudentForm = ({ onSave, onCancel }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    
    // Massive state object for all fields
    const [formData, setFormData] = useState({
        // Core
        roleName: 'Student',
        password: 'studentpassword', // Default
        // Personal
        name: '', dob: '', gender: '', bloodGroup: '', aadhaarNumber: '', religion: '', category: '',
        // Contact
        address: '', city: '', state: '', pincode: '', phone: '', email: '', password: '',
        // Parent
        fatherName: '', motherName: '', guardianName: '', parentOccupation: '', parentIncome: '', parentPhone: '', parentEmail: '',
        // Academic
        classId: '', section: '', rollNumber: '', admissionNo: '', admissionDate: '', board: '', previousSchool: '',
        // Medical
        medicalAllergies: '', medicalDisabilities: '', bloodGroup: '', medicalDoctorName: '', emergencyContact: '',
        // Transport
        transportRequired: false, transportRouteId: '', transportStop: '', transportPassNumber: '',
        // Hostel
        hostelRequired: false, hostelBlock: '', hostelRoom: '', hostelBed: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Manual validation since hidden tabs break HTML5 required validation
        if (!formData.name || !formData.parentPhone || !formData.classId || !formData.admissionNo || !formData.emergencyContact) {
            alert('Please fill in all required fields: Full Name, Parent Phone, Class ID, Admission No, and Emergency Contact.');
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/users/create', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('Student created successfully!');
                onSave();
            } else {
                alert(data.message || 'Failed to create student');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info' },
        { id: 'contact', label: 'Contact Info' },
        { id: 'parent', label: 'Parent Info' },
        { id: 'academic', label: 'Academic Info' },
        { id: 'medical', label: 'Medical Info' },
        { id: 'transport', label: 'Transport & Hostel' }
    ];

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex gap-4 overflow-x-auto rounded-t-2xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6" noValidate>
                
                {/* Personal Tab */}
                <div className={activeTab === 'personal' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label className={labelClass}>Full Name *</label><input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} /></div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                        </div>
                        <div><label className={labelClass}>Blood Group</label><input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Aadhaar Number</label><input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Religion</label><input type="text" name="religion" value={formData.religion} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Category (Gen/SC/ST/OBC)</label><input type="text" name="category" value={formData.category} onChange={handleChange} className={inputClass} /></div>
                    </div>
                </div>

                {/* Contact Tab */}
                <div className={activeTab === 'contact' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2"><label className={labelClass}>Residential Address</label><textarea name="address" value={formData.address} onChange={handleChange} className={inputClass} rows="2"></textarea></div>
                        <div><label className={labelClass}>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Student Phone (Optional)</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Student Email (Optional)</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Student Password</label><input type="text" name="password" placeholder="Defaults to 123456" value={formData.password} onChange={handleChange} className={inputClass} /></div>
                    </div>
                </div>

                {/* Parent Tab */}
                <div className={activeTab === 'parent' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className={labelClass}>Father's Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Mother's Name</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Guardian Name (If applicable)</label><input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Parent Occupation</label><input type="text" name="parentOccupation" value={formData.parentOccupation} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Annual Income</label><input type="text" name="parentIncome" value={formData.parentIncome} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Parent Phone *</label><input required type="text" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Parent Email</label><input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className={inputClass} /></div>
                    </div>
                </div>

                {/* Academic Tab */}
                <div className={activeTab === 'academic' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label className={labelClass}>Class ID *</label><input required type="number" name="classId" value={formData.classId} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Section</label><input type="text" name="section" value={formData.section} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Roll Number</label><input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Admission Number *</label><input required type="text" name="admissionNo" value={formData.admissionNo} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Admission Date</label><input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Board</label><input type="text" name="board" value={formData.board} onChange={handleChange} className={inputClass} /></div>
                        <div className="md:col-span-3"><label className={labelClass}>Previous School</label><input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} className={inputClass} /></div>
                    </div>
                </div>

                {/* Medical Tab */}
                <div className={activeTab === 'medical' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className={labelClass}>Allergies</label><textarea name="medicalAllergies" value={formData.medicalAllergies} onChange={handleChange} className={inputClass} rows="2"></textarea></div>
                        <div><label className={labelClass}>Disabilities / Health Issues</label><textarea name="medicalDisabilities" value={formData.medicalDisabilities} onChange={handleChange} className={inputClass} rows="2"></textarea></div>
                        <div><label className={labelClass}>Family Doctor Name</label><input type="text" name="medicalDoctorName" value={formData.medicalDoctorName} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Emergency Contact Number *</label><input required type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className={inputClass} /></div>
                    </div>
                </div>

                {/* Transport & Hostel Tab */}
                <div className={activeTab === 'transport' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Transport Allocation</h3>
                            <label className="flex items-center gap-2 mb-4 cursor-pointer">
                                <input type="checkbox" name="transportRequired" checked={formData.transportRequired} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded border-slate-300" />
                                <span className="font-medium text-slate-700">School Transport Required</span>
                            </label>
                            {formData.transportRequired && (
                                <div className="space-y-4">
                                    <div><label className={labelClass}>Bus Route ID</label><input type="text" name="transportRouteId" value={formData.transportRouteId} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Pickup Stop</label><input type="text" name="transportStop" value={formData.transportStop} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Bus Pass Number</label><input type="text" name="transportPassNumber" value={formData.transportPassNumber} onChange={handleChange} className={inputClass} /></div>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Hostel Allocation</h3>
                            <label className="flex items-center gap-2 mb-4 cursor-pointer">
                                <input type="checkbox" name="hostelRequired" checked={formData.hostelRequired} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded border-slate-300" />
                                <span className="font-medium text-slate-700">Hostel Resident</span>
                            </label>
                            {formData.hostelRequired && (
                                <div className="space-y-4">
                                    <div><label className={labelClass}>Hostel Block</label><input type="text" name="hostelBlock" value={formData.hostelBlock} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Room Number</label><input type="text" name="hostelRoom" value={formData.hostelRoom} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Bed Number</label><input type="text" name="hostelBed" value={formData.hostelBed} onChange={handleChange} className={inputClass} /></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50">
                        {loading ? 'Creating...' : 'Save Student Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
