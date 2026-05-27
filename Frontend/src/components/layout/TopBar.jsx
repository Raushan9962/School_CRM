import React from 'react';

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-white text-xs py-1 px-4 flex justify-between items-center flex-wrap">
      <div className="flex gap-4">
        <button className="hover:text-gray-300 transition-colors">Skip to Main Content</button>
        <button className="hover:text-gray-300 transition-colors">Screen Reader Access</button>
      </div>
      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <div className="flex items-center gap-2 border-r border-gray-600 pr-4">
            <span className="cursor-pointer hover:bg-gray-700 px-2 py-1 rounded">English</span>
            <span className="cursor-pointer hover:bg-gray-700 px-2 py-1 rounded">हिन्दी</span>
        </div>
        <div className="flex gap-1 border-r border-gray-600 pr-4">
            <button className="px-2 py-1 border border-gray-600 hover:bg-gray-700 rounded">A+</button>
            <button className="px-2 py-1 border border-gray-600 hover:bg-gray-700 rounded">A</button>
            <button className="px-2 py-1 border border-gray-600 hover:bg-gray-700 rounded">A-</button>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search site..." 
            className="text-black px-2 py-1 text-xs rounded outline-none w-32 sm:w-48"
          />
          <button className="absolute right-0 top-0 bottom-0 bg-yellow-500 text-black px-2 rounded-r flex items-center justify-center font-bold">
            Q
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
