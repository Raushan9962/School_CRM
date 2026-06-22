import React from 'react';

const FilterBar = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            gap: '12px',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                {/* Filter Button */}
                <button style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    minWidth: '120px', padding: '10px 14px',
                    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px',
                    color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                    outline: 'none', transition: 'all 0.2s'
                }}>
                    <span>Filter</span>
                    <span style={{ fontSize: '12px' }}>▼</span>
                </button>

                {/* Date Picker (Mock) */}
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 14px',
                    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px',
                    color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                    outline: 'none', transition: 'all 0.2s'
                }}>
                    <span style={{ color: '#0ea5e9', fontSize: '16px' }}>📅</span>
                    <span>06/01/2026 - 06/22/2026</span>
                </button>

                {/* Default Dropdown */}
                <button style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    minWidth: '140px', padding: '10px 14px',
                    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px',
                    color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                    outline: 'none', transition: 'all 0.2s'
                }}>
                    <span>Default</span>
                    <span style={{ fontSize: '12px' }}>▼</span>
                </button>

                {/* Search Bar */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    padding: '10px 14px', flex: 1, minWidth: '200px', maxWidth: '300px',
                    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px'
                }}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        style={{
                            border: 'none', outline: 'none', width: '100%',
                            fontSize: '14px', color: '#1e293b', background: 'transparent'
                        }}
                    />
                </div>
            </div>

            {/* Export Button */}
            <button style={{
                padding: '10px 20px',
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px',
                color: '#0ea5e9', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                outline: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.borderColor = '#0ea5e9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
                Export
            </button>
        </div>
    );
};

export default FilterBar;
