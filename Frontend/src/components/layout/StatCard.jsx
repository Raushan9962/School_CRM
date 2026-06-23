import React from 'react';

const StatCard = ({ title, metrics, bottomComponent, extraHeaderIcon, value, icon, trend, trendUp, color }) => {
    if (metrics) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col gap-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-center">
                    <h3 className="m-0 text-xl font-medium text-slate-800">
                        {title}
                    </h3>
                    {extraHeaderIcon && (
                        <div className="text-sky-500 cursor-pointer text-xl">
                            {extraHeaderIcon}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-6">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="flex-[1_1_calc(50%-12px)]">
                            <div className="text-[13px] text-slate-600 mb-2 font-medium">
                                {metric.label}
                            </div>
                            <div className="text-[28px] text-sky-500 font-medium">
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>

                {(bottomComponent || extraHeaderIcon) && (
                    <div className="border-t border-slate-200 pt-4 mt-auto">
                        {bottomComponent}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15`, color: color }}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="m-0 mb-2 text-[15px] text-slate-500 font-medium">{title}</h3>
                <div className="flex items-end gap-3">
                    <span className="text-[28px] font-bold text-slate-800 leading-none">{value}</span>
                    {trend && (
                        <span className={`text-[13px] font-semibold flex items-center gap-1 mb-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
