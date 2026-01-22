// frontend/app/page.tsx
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">EventFlow</span>
        </h1>
        
        <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
          Manage your events effortlessly. Book tickets, track attendees, and create memorable experiences all in one place.
        </p>
        
        <div className="flex justify-center space-x-6">
          <Link href="/login" className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            Login
          </Link>
          <Link href="/register" className="px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 border border-blue-600">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
