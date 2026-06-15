import React from 'react';

const PlaceholderView = ({ title }) => {
    const lowerTitle = title.toLowerCase();
    
    // Determine category to show realistic dummy data
    let category = 'generic';
    if (lowerTitle.includes('attendance')) category = 'attendance';
    else if (lowerTitle.includes('teacher') || lowerTitle.includes('staff')) category = 'staff';
    else if (lowerTitle.includes('fee') || lowerTitle.includes('finance') || lowerTitle.includes('expense')) category = 'finance';
    else if (lowerTitle.includes('exam') || lowerTitle.includes('result') || lowerTitle.includes('performance')) category = 'academic';
    else if (lowerTitle.includes('leave')) category = 'leave';

    // Renders realistic dummy tables based on category
    const renderTable = () => {
        let headers = [];
        let rows = [];

        if (category === 'attendance') {
            headers = ['Date', 'Name/ID', 'Status', 'In Time', 'Remarks'];
            rows = [
                ['15 Jun 2026', 'Rahul Kumar', 'Present', '08:00 AM', 'On Time'],
                ['15 Jun 2026', 'Priya Singh', 'Absent', '-', 'Sick Leave'],
                ['15 Jun 2026', 'Amit Patel', 'Late', '08:45 AM', 'Traffic'],
                ['14 Jun 2026', 'Rahul Kumar', 'Present', '07:55 AM', 'On Time'],
            ];
        } else if (category === 'staff') {
            headers = ['Emp ID', 'Teacher Name', 'Department', 'Experience', 'Status'];
            rows = [
                ['EMP001', 'Anjali Sharma', 'Mathematics', '8 Years', 'Active'],
                ['EMP002', 'Vikram Singh', 'Science', '12 Years', 'Active'],
                ['EMP003', 'Neha Gupta', 'English', '5 Years', 'On Leave'],
                ['EMP004', 'Rajeev Kumar', 'Sports', '10 Years', 'Active'],
            ];
        } else if (category === 'finance') {
            headers = ['Receipt No', 'Student Name', 'Amount', 'Date', 'Payment Mode'];
            rows = [
                ['REC-1001', 'Aarav Sharma', '₹ 15,000', '10 Jun 2026', 'Online (UPI)'],
                ['REC-1002', 'Diya Patel', '₹ 12,500', '12 Jun 2026', 'Credit Card'],
                ['REC-1003', 'Rohan Das', '₹ 15,000', '14 Jun 2026', 'Cash'],
                ['REC-1004', 'Sneha Iyer', '₹ 8,000', '15 Jun 2026', 'Bank Transfer'],
            ];
        } else if (category === 'academic') {
            headers = ['Exam Name', 'Class', 'Subject', 'Highest Marks', 'Average Marks'];
            rows = [
                ['Unit Test 1', 'Class 10', 'Mathematics', '98/100', '76/100'],
                ['Unit Test 1', 'Class 10', 'Science', '95/100', '72/100'],
                ['Half Yearly', 'Class 9', 'English', '92/100', '68/100'],
                ['Final Exam', 'Class 12', 'Physics', '99/100', '81/100'],
            ];
        } else if (category === 'leave') {
            headers = ['Request ID', 'Applicant Name', 'Leave Type', 'Duration', 'Action'];
            rows = [
                ['LR-501', 'Anjali Sharma', 'Casual Leave', '2 Days (16-17 Jun)', 'Pending'],
                ['LR-502', 'Vikram Singh', 'Sick Leave', '1 Day (15 Jun)', 'Approved'],
                ['LR-503', 'Rohan Student', 'Medical', '5 Days (10-15 Jun)', 'Approved'],
            ];
        } else {
            headers = ['ID', 'Record Name', 'Category', 'Date Modified', 'Status'];
            rows = [
                ['#001', 'Sample Record A', 'General', '10 Jun 2026', 'Active'],
                ['#002', 'Sample Record B', 'General', '12 Jun 2026', 'Pending'],
                ['#003', 'Sample Record C', 'General', '14 Jun 2026', 'Active'],
                ['#004', 'Sample Record D', 'General', '15 Jun 2026', 'Archived'],
            ];
        }

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {headers.map((h, i) => (
                                    <th key={i} className="p-4 text-sm font-bold text-slate-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-4 text-sm text-slate-700 font-medium">
                                            {/* Style status badges dynamically */}
                                            {['Active', 'Present', 'Approved'].includes(cell) ? (
                                                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{cell}</span>
                                            ) : ['Pending', 'Late', 'On Leave'].includes(cell) ? (
                                                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{cell}</span>
                                            ) : ['Absent', 'Archived'].includes(cell) ? (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{cell}</span>
                                            ) : cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 animate-fade-in relative max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 m-0">{title}</h2>
                    <p className="text-slate-500 text-sm mt-1">Previewing mock structure for the {title} module.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-full text-xs tracking-wider">
                    <span className="text-lg">🏗️</span>
                    MOCKUP VIEW
                </div>
            </div>

            {/* Top KPI Cards (Common to almost all management screens) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Records</p>
                        <p className="text-2xl font-black text-slate-800">1,248</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Active / Success</p>
                        <p className="text-2xl font-black text-emerald-600">89%</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-500">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Pending Actions</p>
                        <p className="text-2xl font-black text-amber-600">24</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-purple-500">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">This Month</p>
                        <p className="text-2xl font-black text-purple-600">+12%</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    <input type="text" placeholder={`Search ${title}...`} className="p-2 border border-slate-300 rounded-lg text-sm w-64 outline-none focus:border-indigo-500" />
                    <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">Filter ⚙️</button>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-700">+ Add New Record</button>
            </div>

            {/* The Realistic Data Table */}
            {renderTable()}

            {/* Chart Area Preview */}
            {(category === 'finance' || category === 'academic' || category === 'attendance') && (
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-6">Trend Overview</h3>
                    <div className="flex items-end gap-2 h-48 border-b border-slate-100 pb-2">
                        {[40, 70, 45, 90, 65, 80, 55, 100, 30, 85, 60, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-indigo-200 to-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceholderView;
