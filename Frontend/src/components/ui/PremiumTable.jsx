import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const PremiumTable = ({ 
    columns, 
    data, 
    kpiCards = [], 
    onSearch, 
    onDateFilter,
    title = "",
    actions = null
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    
    // Simple pagination math
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="w-full animate-fade-in">
            {/* Title & Top Actions */}
            {(title || actions) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-xl font-bold text-slate-800">{title}</h2>}
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}

            {/* Top Toolbar (Addble Style) */}
            <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-t-xl border border-slate-200 border-b-0">
                {/* Filter Dropdown */}
                <button className="flex items-center justify-between w-full md:w-32 px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <span>Filter</span>
                    <ChevronDown size={14} />
                </button>
                
                {/* Date Picker (Mocked) */}
                <button className="flex items-center gap-2 w-full md:w-64 px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <Calendar size={14} className="text-blue-500" />
                    <span>06/01/2026 - 06/24/2026</span>
                </button>

                {/* Default Sort */}
                <button className="flex items-center justify-between w-full md:w-32 px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <span>Default</span>
                    <ChevronDown size={14} />
                </button>

                {/* Search Bar */}
                <div className="flex-1 relative w-full">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-slate-400 text-slate-700"
                    />
                </div>

                {/* Export Button */}
                <button className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-1.5 border border-slate-200 rounded text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors">
                    Export
                </button>
            </div>

            {/* KPI Segmented Cards */}
            {kpiCards && kpiCards.length > 0 && (
                <div className="flex overflow-x-auto border border-slate-200 bg-[#f8fafc] custom-scrollbar">
                    {kpiCards.map((kpi, idx) => (
                        <div 
                            key={idx} 
                            onClick={kpi.onClick}
                            className={`flex-1 min-w-[120px] p-3 border-r border-slate-200 cursor-pointer transition-colors ${kpi.active ? 'bg-[#eef6ff] border-t-2 border-t-blue-500' : 'bg-white border-t-2 border-t-transparent hover:bg-slate-50'}`}
                        >
                            <p className="text-[13px] font-medium text-slate-600">{kpi.label}</p>
                            <div className="flex items-end justify-between mt-1">
                                <span className={`text-2xl font-bold ${kpi.active ? 'text-slate-900' : 'text-slate-700'}`}>{kpi.value}</span>
                                {kpi.sublabel && <span className="text-[10px] text-slate-400">{kpi.sublabel}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Thick spacer below KPI cards like in screenshot */}
            {kpiCards && kpiCards.length > 0 && (
                <div className="h-1 bg-slate-200 w-full mb-1 rounded-full px-2 mt-2">
                    <div className="h-full bg-slate-300 w-[80%] rounded-full"></div>
                </div>
            )}

            {/* The Table */}
            <div className={`bg-white border border-slate-200 overflow-x-auto ${kpiCards && kpiCards.length > 0 ? '' : 'rounded-b-xl'}`}>
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-white border-b border-slate-100">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-3 text-[12px] font-bold text-slate-500 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-slate-800">
                                        {col.label}
                                        {col.sortable && <ArrowUpDown size={12} className="opacity-50" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-medium">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="p-3 text-[13px] text-slate-700 text-center relative group">
                                            {/* Specialized Ribbons for specific columns like 'Order ID' in screenshot */}
                                            {col.ribbonKey && row[col.ribbonKey] && (
                                                <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">
                                                    {row[col.ribbonKey]}
                                                </div>
                                            )}
                                            
                                            {/* Render Cell Value */}
                                            {col.render ? col.render(row) : (
                                                <span className={`${col.className || ''}`}>{row[col.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 border-t-0 rounded-b-xl">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Rows per page: </span>
                    <select className="border-none bg-transparent focus:outline-none font-medium cursor-pointer">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{data.length === 0 ? '0-0 of 0' : `${(currentPage-1)*rowsPerPage + 1}-${Math.min(currentPage*rowsPerPage, data.length)} of ${data.length}`}</span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Floating Action Button placeholder like the teal refresh button in screenshot */}
            <div className="fixed bottom-8 right-8 z-40 hidden md:block">
               {/* Could add a global FAB here if needed, but avoiding forcing it everywhere */}
            </div>
        </div>
    );
};

export default PremiumTable;
