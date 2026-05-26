import React from 'react';
import { Link } from 'react-router-dom';
import { User, GraduationCap, Building2, PlusCircle, FileText } from 'lucide-react';

const LoginSidebar = () => {
  const loginOptions = [
    { name: "VidyaSetu Login", icon: <User size={20} className="text-orange-500" />, path: "/login/admin", color: "text-blue-900" },
    { name: "Student Login", icon: <GraduationCap size={20} className="text-blue-500" />, path: "/login/student", color: "text-orange-600" },
    { name: "Vidya Samiksha Kendra - VSK", icon: <Building2 size={20} className="text-green-600" />, path: "#", color: "text-blue-900" },
    { name: "UDISE", icon: <PlusCircle size={20} className="text-orange-500" />, path: "#", color: "text-blue-900" },
    { name: "CM SHRI Schools Admission Test - 2026", icon: <FileText size={20} className="text-blue-600" />, path: "#", color: "text-orange-700" }
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {loginOptions.map((option, index) => (
        <Link 
          to={option.path} 
          key={index}
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-full py-3 px-6 shadow-md hover:shadow-lg transition-shadow hover:bg-orange-50 cursor-pointer"
        >
          <div className="bg-gray-100 p-2 rounded-full shadow-inner border border-gray-200">
            {option.icon}
          </div>
          <span className={`font-bold text-sm ${option.color}`}>
            {option.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default LoginSidebar;
