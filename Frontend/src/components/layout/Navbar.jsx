import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const links = [
    "SCHOOL INFORMATION",
    "RRS / RECRUITMENT",
    "PUBLIC CIRCULARS",
    "EXAM / RE-EXAM RESULT 2025-26",
    "INCLUSIVE EDUCATION",
    "AERU",
    "ABOUT US",
    "CONTACTS"
  ];

  return (
    <nav className="bg-[#B86B25] text-white">
      <ul className="flex flex-wrap justify-center sm:justify-start">
        {links.map((link, index) => (
          <li key={index} className="px-4 py-3 hover:bg-[#8e521b] transition-colors border-r border-[#cd8b51] last:border-r-0 cursor-pointer text-xs font-semibold tracking-wide">
            <Link to="/">{link}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
