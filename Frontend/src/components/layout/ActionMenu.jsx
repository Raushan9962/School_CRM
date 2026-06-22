import React, { useState, useEffect, useRef } from 'react';

const ActionMenu = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '4px 8px', borderRadius: '4px', color: '#64748b',
                    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                ⋮
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute', right: '0', top: '100%', zIndex: 50,
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    minWidth: '150px', padding: '4px', marginTop: '4px'
                }}>
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsOpen(false);
                                if (opt.onClick) opt.onClick();
                            }}
                            disabled={opt.disabled}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '8px 12px', background: 'transparent', border: 'none',
                                cursor: opt.disabled ? 'not-allowed' : 'pointer',
                                color: opt.disabled ? '#cbd5e1' : (opt.danger ? '#ef4444' : '#334155'),
                                fontSize: '13px', fontWeight: 500, borderRadius: '4px',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => !opt.disabled && (e.currentTarget.style.background = '#f8fafc')}
                            onMouseLeave={e => !opt.disabled && (e.currentTarget.style.background = 'transparent')}
                        >
                            {opt.icon && <span style={{ marginRight: '8px' }}>{opt.icon}</span>}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionMenu;
