import React from 'react';
import { FileText, Download, ShieldCheck, FileCheck, FileSearch } from 'lucide-react';

const DocumentsDownload = () => {
    const documents = [
        { id: 1, name: 'Report Card - Mid Term', type: 'Academic', date: '10 Nov 2023', size: '1.2 MB', icon: <FileText size={24} /> },
        { id: 2, name: 'Fee Receipt - Term 1', type: 'Finance', date: '05 Apr 2023', size: '0.8 MB', icon: <FileCheck size={24} /> },
        { id: 3, name: 'Bonafide Certificate', type: 'Certificate', date: '12 Aug 2023', size: '0.5 MB', icon: <ShieldCheck size={24} /> },
        { id: 4, name: 'Medical Record Form', type: 'Form', date: '20 Mar 2023', size: '1.5 MB', icon: <FileSearch size={24} /> },
        { id: 5, name: 'Student ID Card Copy', type: 'Identity', date: '01 Apr 2023', size: '2.1 MB', icon: <FileCheck size={24} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Documents Download</h1>
                <p className="text-slate-500">Access and download official school documents and certificates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-200 transition-colors flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                                {doc.icon}
                            </div>
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 text-[9px] font-bold uppercase tracking-wider rounded">
                                {doc.type}
                            </span>
                        </div>
                        <h3 className="m-0 text-[14px] font-bold text-slate-800 mb-0.5">{doc.name}</h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4 font-medium">
                            <span>{doc.date}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{doc.size}</span>
                        </div>
                        <div className="mt-auto pt-3 border-t border-slate-100">
                            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-[12px] font-semibold transition-colors">
                                <Download size={14} /> Download PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentsDownload;
