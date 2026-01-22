'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function NotFound() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/10 rounded-full filter blur-[100px] animate-pulse"></div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-[12rem] font-black text-red-600/10 leading-none select-none">404</h1>
        
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg mx-auto -mt-20">
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/20 rounded-full border border-red-500/30">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-red-500 uppercase tracking-tighter">
            Page Not Found
          </h2>
          
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 text-center"
              >
                Back to Dashboard
              </Link>
            ) : (
              
              <Link 
                href="/login" 
                className="px-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/25 active:scale-95 text-center"
              >
                Login to Account
              </Link>
            )}
            
            <Link 
              href="/" 
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-center"
            >
              Go Home
            </Link>
          </div>
        </div>

        <button 
          onClick={() => window.history.back()} 
          className="mt-8 text-gray-500 hover:text-red-400 transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
