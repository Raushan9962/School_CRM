import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-white px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-4 text-orange-500 font-bold text-3xl sm:text-4xl tracking-widest drop-shadow-md">
        VidyaSetu
      </Link>
      
      <div className="text-center mt-4 sm:mt-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-700 uppercase tracking-wide">VidyaSetu CRM</h1>
        <p className="text-gray-700 text-sm font-semibold">Comprehensive School Management System</p>
      </div>

      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        {/* Placeholder for emblems/logos seen in the design */}
        <div className="h-12 w-32 border border-gray-200 rounded flex items-center justify-center text-xs text-gray-500 overflow-hidden shadow-sm">
          National Emblem
        </div>
        <div className="h-10 w-16 border border-gray-200 shadow-sm flex flex-col rounded overflow-hidden">
           <div className="h-1/3 bg-orange-500"></div>
           <div className="h-1/3 bg-white flex items-center justify-center">
             <div className="h-2 w-2 rounded-full border border-blue-800"></div>
           </div>
           <div className="h-1/3 bg-green-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
