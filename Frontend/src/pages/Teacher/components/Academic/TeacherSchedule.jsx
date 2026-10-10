import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const TeacherSchedule = () => {
    const [mySchedule, setMySchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            // Mocking API call for now, replace with actual endpoint when ready
            // const res = await apiFetch('/academic/teacher-schedule');
            // if(res.success) setMySchedule(res.data);
            setMySchedule([]); // Removed hardcoded data
        } catch (error) {
            console.error("Error fetching schedule:", error);
            setMySchedule([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                    <Clock size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">My Schedule</h2>
                    <p className="text-sm text-slate-500">All classes assigned to you</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-700">
                            <th className="p-3 border-b border-slate-200 font-semibold">Day</th>
                            <th className="p-3 border-b border-slate-200 font-semibold">Class & Section</th>
                            <th className="p-3 border-b border-slate-200 font-semibold">Period</th>
                            <th className="p-3 border-b border-slate-200 font-semibold">Time</th>
                            <th className="p-3 border-b border-slate-200 font-semibold">Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
                        ) : mySchedule.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-4 text-slate-500">No schedule assigned to you.</td></tr>
                        ) : mySchedule.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-3 text-slate-800 font-medium">{item.day}</td>
                                <td className="p-3 text-slate-700">{item.class} - {item.section}</td>
                                <td className="p-3 text-slate-700">{item.period}</td>
                                <td className="p-3 text-slate-500 text-sm">{item.time}</td>
                                <td className="p-3 text-slate-900 font-medium">{item.subject}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherSchedule;
