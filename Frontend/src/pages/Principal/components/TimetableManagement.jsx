import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';
import { Calendar, Plus, Clock, FileText } from 'lucide-react';

const TimetableManagement = () => {
    const [timetables, setTimetables] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filtering state
    const [selectedClass, setSelectedClass] = useState('');

    const [formData, setFormData] = useState({
        classId: '',
        subjectId: '',
        teacherId: '',
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '08:45'
    });

    const fetchData = async () => {
        try {
            const [ttRes, clsRes, subRes, tchRes] = await Promise.all([
                apiFetch('/principal/timetables'),
                apiFetch('/principal/classes'),
                apiFetch('/principal/subjects'),
                apiFetch('/school-admin/teachers')
            ]);
            
            const ttData = await ttRes.json();
            const clsData = await clsRes.json();
            const subData = await subRes.json();
            const tchData = await tchRes.json();
            
            if (ttData.success) setTimetables(ttData.data);
            if (clsData.success) {
                setClasses(clsData.data);
                if (clsData.data.length > 0) setSelectedClass(clsData.data[0].id.toString());
            }
            if (subData.success) setSubjects(subData.data);
            if (tchData.success) setTeachers(tchData.data);
        } catch (err) {
            console.error("Failed to fetch timetable data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateNew = () => {
        setFormData({ ...formData, classId: selectedClass });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/principal/timetables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to save timetable", err);
        }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const filteredTimetables = timetables.filter(t => t.class_id.toString() === selectedClass.toString());

    if (loading) return <div className="p-8 text-center text-slate-500">Loading timetable...</div>;

    const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="animate-fade-in p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 m-0">Timetable Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Create and manage weekly schedules for classes.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
                        <FileText size={18} /> Export PDF
                    </button>
                    <button 
                        onClick={handleCreateNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 border-none cursor-pointer"
                    >
                        <Plus size={18} /> Add Period
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <label className="font-semibold text-slate-700">Select Class:</label>
                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 min-w-[200px]"
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-slate-200 bg-slate-50 p-3 text-left w-32 font-semibold text-slate-600">Day / Time</th>
                                {filteredTimetables.length > 0 ? 
                                    // Generate dynamic time slots headers
                                    [...new Set(filteredTimetables.map(t => `${t.start_time.substring(0,5)} - ${t.end_time.substring(0,5)}`))].sort().map(timeSlot => (
                                        <th key={timeSlot} className="border border-slate-200 bg-slate-50 p-3 text-center font-semibold text-slate-600">
                                            {timeSlot}
                                        </th>
                                    ))
                                    : <th className="border border-slate-200 bg-slate-50 p-3 text-center font-semibold text-slate-600">Periods</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => {
                                const dayPeriods = filteredTimetables.filter(t => t.day_of_week === day);
                                const uniqueTimeSlots = [...new Set(filteredTimetables.map(t => `${t.start_time.substring(0,5)} - ${t.end_time.substring(0,5)}`))].sort();
                                
                                return (
                                    <tr key={day}>
                                        <td className="border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-700">
                                            {day}
                                        </td>
                                        {uniqueTimeSlots.length > 0 ? (
                                            uniqueTimeSlots.map(timeSlot => {
                                                const period = dayPeriods.find(t => `${t.start_time.substring(0,5)} - ${t.end_time.substring(0,5)}` === timeSlot);
                                                return (
                                                    <td key={timeSlot} className="border border-slate-200 p-2 text-center align-top min-w-[150px]">
                                                        {period ? (
                                                            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-2 shadow-sm text-sm">
                                                                <div className="font-bold text-indigo-700">{period.subject_name || 'Free/Activity'}</div>
                                                                <div className="text-indigo-500 text-xs mt-1">{period.teacher_name || 'No Teacher'}</div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-300 text-sm italic">-</div>
                                                        )}
                                                    </td>
                                                );
                                            })
                                        ) : (
                                            <td className="border border-slate-200 p-6 text-center text-slate-400 italic">No periods scheduled</td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Add Timetable Period</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Class</label>
                                    <select name="classId" value={formData.classId} onChange={handleInputChange} className={inputClass} required>
                                        <option value="">Select...</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Day</label>
                                    <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} className={inputClass} required>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Start Time</label>
                                    <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>End Time</label>
                                    <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className={inputClass} required />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Subject (Optional)</label>
                                <select name="subjectId" value={formData.subjectId} onChange={handleInputChange} className={inputClass}>
                                    <option value="">Select Subject...</option>
                                    {subjects.filter(s => s.class_id.toString() === formData.classId.toString()).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Teacher (Optional)</label>
                                <select name="teacherId" value={formData.teacherId} onChange={handleInputChange} className={inputClass}>
                                    <option value="">Select Teacher...</option>
                                    {teachers.map(t => <option key={t.id} value={t.teacher_id}>{t.name}</option>)}
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg bg-white cursor-pointer hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium cursor-pointer hover:bg-indigo-700 border-none">Add Period</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableManagement;
