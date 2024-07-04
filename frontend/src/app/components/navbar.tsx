'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white p-4 shadow-lg top-0 z-50 fixed w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image src="/icon.ico" alt="VisionDeck Icon" width={40} height={40} />
          <Link href="/" className="text-blue-700 hover:text-blue-500 text-3xl font-bold">VisionDeck</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/pptx">
            <p className='px-4 py-2 bg-blue-700 text-xl text-white font-semibold rounded-md shadow-sm hover:bg-blue-500 transition duration-300 ease-in-out'>Get started</p> 
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-blue-700 hover:text-blue-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/pptx" className="text-blue-700 hover:text-blue-500 text-xl font-bold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
