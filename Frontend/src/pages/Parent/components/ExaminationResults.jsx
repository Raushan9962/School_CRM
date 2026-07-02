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
                const response = await axios.get(`http://localhost:5000/api/parent/children/${childId}/results`, {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Overall Percentage</p>
                        <h3 className="text-2xl font-bold text-slate-800">{results.percentage}%</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Final Grade</p>
                        <h3 className="text-2xl font-bold text-slate-800">{results.grade}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Class Rank</p>
                        <h3 className="text-2xl font-bold text-slate-800">#{results.rank}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Subjects</p>
                        <h3 className="text-2xl font-bold text-slate-800">{results.subjects ? results.subjects.length : 0}</h3>
                    </div>
                </div>
            </div>

            {/* Subject Marks Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen size={18} className="text-slate-500" />
                        Subject-wise Performance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Obtained Marks</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Maximum Marks</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Percentage</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase w-1/4">Progress</th>
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
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{subject.name}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{subject.marks}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{subject.maxMarks}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{subjectPercent}%</td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div 
                                                    className={`${progressColor} h-2 rounded-full`} 
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
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-6 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm shrink-0">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">Class Teacher Remarks</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        "Rahul has shown excellent progress in Mathematics and Science this term. He needs to participate more actively in class discussions to improve his English scores. Keep up the good work!"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExaminationResults;
