import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Download, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';

const ExaminationResults = ({ childId }) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`\${import.meta.env.VITE_API_BASE_URL}/parent/children/${childId}/results`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching examination results", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) fetchResults();
    }, [childId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading result data...</div>;
    if (!results) return <div className="p-8 text-center text-rose-500">Failed to load result data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Examination Results</h1>
                    <p className="text-slate-500">Academic performance and marks for {results.recentExam || 'Recent Exam'}.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={18} />
                    Download Report Card
                </button>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Overall Percentage</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{results.percentage}%</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">
                        <Award size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Final Grade</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{results.grade}</h3>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 shrink-0">
                        <Award size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Class Rank</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">#{results.rank}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 shrink-0">
                        <BookOpen size={18} />
                    </div>
                    <div>
                        <p className="m-0 mb-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Subjects</p>
                        <h3 className="m-0 text-base font-bold text-slate-800">{results.subjects ? results.subjects.length : 0}</h3>
                    </div>
                </div>
            </div>

            {/* Subject Marks Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-slate-500" />
                        <h3 className="m-0 text-sm font-bold text-slate-800">Subject-wise Performance</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Obtained Marks</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Maximum Marks</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Percentage</th>
                                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-1/4">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.subjects && results.subjects.map((subject, index) => {
                                const subjectPercent = Math.round((subject.marks / subject.maxMarks) * 100);
                                let progressColor = 'bg-blue-500';
                                if (subjectPercent < 40) progressColor = 'bg-rose-500';
                                else if (subjectPercent >= 80) progressColor = 'bg-emerald-500';
                                else if (subjectPercent >= 60) progressColor = 'bg-amber-500';

                                return (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-[13px] font-bold text-slate-800">{subject.name}</td>
                                        <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{subject.marks}</td>
                                        <td className="px-4 py-3 text-[13px] text-slate-500">{subject.maxMarks}</td>
                                        <td className="px-4 py-3 text-[13px] font-bold text-slate-800">{subjectPercent}%</td>
                                        <td className="px-4 py-3">
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div 
                                                    className={`${progressColor} h-1.5 rounded-full`} 
                                                    style={{ width: `${subjectPercent}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Teacher Remarks Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4 flex items-start gap-3">
                <div className="mt-1 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
                        <AlertTriangle size={14} />
                    </div>
                </div>
                <div>
                    <h4 className="m-0 mb-1 text-[13px] font-bold text-blue-900">Class Teacher Remarks</h4>
                    <p className="m-0 text-[12px] text-blue-800 leading-relaxed">
                        "Rahul has shown excellent progress in Mathematics and Science this term. He needs to participate more actively in class discussions to improve his English scores. Keep up the good work!"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExaminationResults;
