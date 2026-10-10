import React, { useState } from 'react';
import { Search, CalendarDays } from 'lucide-react';

const ClassSchedule = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFilter = async () => {
        if (!selectedClass || !selectedSection) return;
        setLoading(true);
        try {
            // Mocking an API call, we can replace this with actual apiFetch when the backend is ready
            // const res = await apiFetch(`/academic/class-schedule?class=${selectedClass}&section=${selectedSection}`);
            // if(res.success) setSchedule(res.data); else setSchedule([]);
            setSchedule([]); // No data for now, remove hardcoded data
        } catch (error) {
            console.error("Error fetching schedule:", error);
            setSchedule([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
                <select 
                    className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    <option value="">Select Class</option>
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="8">Class 8</option>
                </select>

                <select 
                    className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                </select>

                <button 
                    onClick={handleFilter}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
                >
                    <Search size={18} />
                    Filter
                </button>
            </div>

            {schedule ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-700">
                                <th className="p-3 border-b border-slate-200 font-semibold">Day</th>
                                <th className="p-3 border-b border-slate-200 font-semibold">Period</th>
                                <th className="p-3 border-b border-slate-200 font-semibold">Time</th>
                                <th className="p-3 border-b border-slate-200 font-semibold">Subject</th>
                                <th className="p-3 border-b border-slate-200 font-semibold">Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
                            ) : schedule.length === 0 ? (
                                <tr><td colSpan="5" className="text-center p-4 text-slate-500">No schedule found for this class.</td></tr>
                            ) : schedule.map((item) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-3 text-slate-700">{item.day}</td>
                                    <td className="p-3 text-slate-700">{item.period}</td>
                                    <td className="p-3 text-slate-500 text-sm">{item.time}</td>
                                    <td className="p-3 text-slate-900 font-medium">{item.subject}</td>
                                    <td className="p-3 text-slate-700">{item.teacher}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a class and section to view the schedule.</p>
                </div>
            )}
        </div>
    );
};

export default ClassSchedule;
