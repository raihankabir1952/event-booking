'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useAuth } from './components/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 text-black">Redirecting...</div>;
  }

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/landing_page.jpg')" }}
    >
      {/* Background Overlay: যাতে পেছনের ইমেজের ওপর লেখাগুলো ক্লিয়ার দেখা যায় */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center px-4">
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Welcome to <span className="text-blue-400">EventFlow</span>
        </h1>
        
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          "From Planning to Party – We’ve Got You Covered."
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/login" className="px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-center">
            Login
          </Link>
          <Link href="/register" className="px-10 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-bold rounded-xl shadow-xl hover:bg-white hover:text-blue-600 transition duration-300 border border-white/50 text-center">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
