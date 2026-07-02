import React, { useState } from 'react';
import { Send, Image as ImageIcon, Paperclip, Search, User } from 'lucide-react';

const CommunicationCenter = ({ childId }) => {
    const [activeChat, setActiveChat] = useState('teacher');
    const [message, setMessage] = useState('');

    const contacts = [
        { id: 'teacher', name: 'Mr. Rajesh Sharma', role: 'Class Teacher', lastMessage: 'Please check the homework.', time: '10:30 AM', unread: 2 },
        { id: 'principal', name: 'Dr. Anita Desai', role: 'Principal', lastMessage: 'Holiday circular sent.', time: 'Yesterday', unread: 0 },
        { id: 'admin', name: 'School Admin', role: 'Administration', lastMessage: 'Fee receipt generated.', time: 'Mon', unread: 0 },
        { id: 'transport', name: 'Transport Dept', role: 'Bus Co-ordinator', lastMessage: 'Bus will be delayed by 10 mins.', time: '2 Nov', unread: 0 },
    ];

    const activeContact = contacts.find(c => c.id === activeChat);

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">
            {/* Contacts Sidebar */}
            <div className="w-80 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col hidden lg:flex">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Messages</h2>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search contacts..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {contacts.map(contact => (
                        <button
                            key={contact.id}
                            onClick={() => setActiveChat(contact.id)}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${
                                activeChat === contact.id ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50 border-transparent'
                            } border`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 relative">
                                <User size={20} />
                                {contact.unread > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                                        {contact.unread}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{contact.name}</h4>
                                    <span className="text-[10px] text-slate-500">{contact.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{contact.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">{activeContact?.name}</h3>
                            <p className="text-xs text-slate-500">{activeContact?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 custom-scrollbar">
                    {/* Simulated Messages */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                            <p className="text-sm text-slate-700">Dear Parent, {activeContact?.lastMessage}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">10:30 AM</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                            <p className="text-sm text-blue-50">Noted, thank you for the update.</p>
                            <span className="text-[10px] text-blue-200 mt-2 block text-right">10:35 AM</span>
                        </div>
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                            <ImageIcon size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationCenter;
