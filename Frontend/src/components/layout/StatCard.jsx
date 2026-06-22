import React from 'react';

const StatCard = ({ title, metrics, bottomComponent, extraHeaderIcon }) => {
    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 500, color: '#1e293b' }}>
                    {title}
                </h3>
                {extraHeaderIcon && (
                    <div style={{ color: '#0ea5e9', cursor: 'pointer', fontSize: '20px' }}>
                        {extraHeaderIcon}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {metrics.map((metric, idx) => (
                    <div key={idx} style={{ flex: '1 1 calc(50% - 12px)' }}>
                        <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>
                            {metric.label}
                        </div>
                        <div style={{ fontSize: '28px', color: '#0ea5e9', fontWeight: 500 }}>
                            {metric.value}
                        </div>
                    </div>
                ))}
            </div>

            {(bottomComponent || extraHeaderIcon) && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: 'auto' }}>
                    {bottomComponent}
                </div>
            )}
        </div>
    );
};

export default StatCard;
