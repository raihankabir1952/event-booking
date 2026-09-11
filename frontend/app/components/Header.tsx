'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      if (isLoggedIn) {
        const savedName = localStorage.getItem('userName');
        const savedEmail = localStorage.getItem('userEmail');
        
        if (savedName && savedName !== 'undefined') {
          setUserName(savedName);
        } else if (savedEmail) {
          setUserName(savedEmail.split('@')[0]);
        }
      } else {
        setUserName(null);
      }
    };

    loadUserData();
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, [isLoggedIn]);

  
  const linkStyle = (path: string) => `
    px-4 py-2 rounded-xl text-sm font-extrabold transition-all duration-300
    ${pathname === path 
      ? 'bg-white text-blue-700 shadow-md scale-105' 
      : 'text-white hover:bg-white/15 hover:scale-105'}
  `;

  return (
    <header className="bg-blue-600 shadow-xl sticky top-0 z-50">
      <nav className="max-w-[100%] mx-auto px-6 md:px-12 lg:px-16"> 
        <div className="flex items-center justify-between h-20"> 
          
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-white p-1.5 rounded-xl group-hover:rotate-6 transition-transform">
                 <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">EventFlow</span>
            </Link>

            {isLoggedIn && (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/dashboard" className={linkStyle('/dashboard')}>Dashboard</Link>
                <Link href="/create-event" className={linkStyle('/create-event')}>Create Event</Link>
                <Link href="/my-bookings" className={linkStyle('/my-bookings')}>My Bookings</Link>
                <Link href="/my-events" className={linkStyle('/my-events')}>My Events</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 hover:bg-white/20 transition-all group"
                >
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-white text-sm font-black ml-3 hidden sm:block">
                    {userName || 'User'}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-red-600 transition-all shadow-lg active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-white font-black text-sm hover:text-blue-100 transition-colors">
                  LOGIN
                </Link>
                <Link href="/register" className="bg-white text-blue-600 px-7 py-2.5 rounded-xl font-black text-sm shadow-lg hover:bg-blue-50 hover:scale-105 transition-all">
                  GET STARTED
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}
