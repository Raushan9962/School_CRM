import React from 'react';

const DataTable = ({ columns, data, showPagination = true }) => {
    return (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} style={{ borderBottom: '1px solid #e2e8f0', background: rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc'}
                            >
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showPagination && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '12px 24px', borderTop: '1px solid #e2e8f0', gap: '24px', fontSize: '13px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Rows per page:</span>
                        <select style={{ border: 'none', background: 'transparent', color: '#1e293b', outline: 'none', cursor: 'pointer', fontWeight: 500 }}>
                            <option>100</option>
                            <option>50</option>
                            <option>25</option>
                        </select>
                    </div>
                    <div>
                        1-{data.length} of {data.length}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <span style={{ cursor: 'pointer', color: '#94a3b8' }}>&lt;</span>
                        <span style={{ cursor: 'pointer', color: '#1e293b' }}>&gt;</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
