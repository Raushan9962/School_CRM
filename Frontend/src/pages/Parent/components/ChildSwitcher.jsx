import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';

const ChildSwitcher = ({ childrenList, selectedChildId, onChildSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Find selected child
    const selectedChild = childrenList.find(c => c.studentId === selectedChildId) || childrenList[0];

    if (!childrenList || childrenList.length === 0) {
        return null; // Don't render if no children
    }

    return (
        <div className="p-4 border-t border-slate-100 relative">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                Viewing Child
            </p>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Users size={16} />
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">
                            {selectedChild?.name || 'Select Child'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            Class {selectedChild?.class || '-'} | Sec {selectedChild?.section || '-'}
                        </p>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-50">
                        {childrenList.map((child) => (
                            <button
                                key={child.studentId}
                                onClick={() => {
                                    onChildSelect(child.studentId);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                            >
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-bold text-slate-800">{child.name}</span>
                                    <span className="text-xs text-slate-500">Class {child.class} | {child.admissionNo}</span>
                                </div>
                                {selectedChildId === child.studentId && (
                                    <Check size={16} className="text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChildSwitcher;
