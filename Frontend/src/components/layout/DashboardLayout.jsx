import React, { useState, useEffect } from 'react';
import { Bell, Menu, X, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardLayout = ({ 
    navItems, 
    activeTab, 
    setActiveTab, 
    userInfo, 
    handleLogout, 
    sidebarBottomContent,
    children 
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getActiveTitle = () => {
        let currentTitle = 'Dashboard Overview';
        const searchItems = (items) => {
            for (const item of items) {
                if (item.id === activeTab) {
                    currentTitle = item.label;
                    return true;
                }
                if (item.subItems && searchItems(item.subItems)) {
                    currentTitle = `${item.label} / ${currentTitle}`;
                    return true;
                }
            }
            return false;
        };
        searchItems(navItems);
        return currentTitle;
    };

    const renderNavItems = (items) => {
        return items.map(item => {
            const isSelected = activeTab === item.id;
            
            return (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        if (isMobile) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 mb-1 rounded-xl font-medium text-[14px] transition-all duration-200 ${
                        isSelected 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    {item.icon && <span className={`flex items-center justify-center ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>{item.icon}</span>}
                    {!item.icon && <span className="w-5"></span>}
                    <span className="truncate">{item.label}</span>
                </button>
            );
        });
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f4f7f6] font-inter">
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:relative top-0 bottom-0 left-0 z-50 w-[260px] min-w-[260px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:ml-[-260px]'
            }`}>
                {/* Brand / Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {userInfo?.schoolName ? userInfo.schoolName.substring(0,1).toUpperCase() : 'S'}
                        </div>
                        <h2 className="text-slate-800 font-bold text-[15px] truncate max-w-[170px]">
                            {userInfo?.schoolName || 'School CRM'}
                        </h2>
                    </div>
                </div>

                {/* User Profile Mini */}
                <div className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                        {userInfo?.name ? userInfo.name.substring(0, 2).toUpperCase() : 'AD'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                            {userInfo?.name || 'Admin User'}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
                            {userInfo?.role || 'Administrator'}
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                    {renderNavItems(navItems)}
                    {sidebarBottomContent}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-100">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl font-semibold text-sm transition-colors border border-transparent hover:border-rose-100"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
                        >
                            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                        </button>
                        <h1 className="text-[18px] font-bold text-slate-800 tracking-tight m-0 hidden sm:block">
                            {getActiveTitle().split(' / ').pop()}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell size={20} strokeWidth={2} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#f4f7f6] px-4 lg:px-8 pb-4 lg:pb-8 pt-4 relative">
                    <div className="mx-auto max-w-[1600px] h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
