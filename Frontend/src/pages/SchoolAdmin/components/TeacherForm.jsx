import React, { useState } from 'react';
import apiFetch from '../../../services/api';

const TeacherForm = ({ onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        roleName: 'Teacher',
        name: '', email: '', password: '', phone: '', gender: '', dob: '', address: '',
        employeeId: '', qualification: '', experience: '', subject: '', classAssigned: '', joiningDate: '', basicSalary: '',
        employmentType: 'Regular', bankAccount: '', ifscCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('/users/create', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('Teacher created successfully!');
                onSave();
            } else {
                alert(data.message || 'Failed to create teacher');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Add New Teacher</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-slate-700 mb-2">Personal Details</h4>
                    </div>
                    <div><label className={labelClass}>Full Name *</label><input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Email *</label><input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Password</label><input type="text" name="password" placeholder="Defaults to 123456" value={formData.password} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Phone *</label><input required type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
                    <div>
                        <label className={labelClass}>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                            <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option>
                        </select>
                    </div>
                    <div><label className={labelClass}>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} /></div>
                    <div className="md:col-span-3"><label className={labelClass}>Address</label><textarea name="address" value={formData.address} onChange={handleChange} className={inputClass} rows="2"></textarea></div>

                    <div className="md:col-span-3 mt-4">
                        <h4 className="font-semibold text-slate-700 mb-2 border-t pt-4">Professional Details</h4>
                    </div>
                    <div><label className={labelClass}>Employee ID</label><input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} placeholder="Leave blank to auto-generate" /></div>
                    <div><label className={labelClass}>Qualification</label><input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Experience (Years)</label><input type="number" name="experience" value={formData.experience} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Primary Subject</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Class Assigned</label><input type="text" name="classAssigned" value={formData.classAssigned} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Joining Date</label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className={inputClass} /></div>
                    
                    <div className="md:col-span-3 mt-4">
                        <h4 className="font-semibold text-slate-700 mb-2 border-t pt-4">Payroll Details</h4>
                    </div>
                    <div><label className={labelClass}>Employment Type</label>
                        <select name="employmentType" value={formData.employmentType} onChange={handleChange} className={inputClass}>
                            <option value="Regular">Regular</option><option value="Contract">Contract</option><option value="Guest">Guest</option>
                        </select>
                    </div>
                    <div><label className={labelClass}>Basic Salary (₹)</label><input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Bank Account No.</label><input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>IFSC Code</label><input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className={inputClass} /></div>
                </div>

                <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
                    <button type="button" onClick={onCancel} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Teacher'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeacherForm;
