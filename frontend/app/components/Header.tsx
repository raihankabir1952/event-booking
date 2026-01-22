// frontend/components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // লগইন স্টেট চেঞ্জ হলে ইমেল আপডেট করা
  useEffect(() => {
    if (isLoggedIn) {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    } else {
      setUserEmail(null);
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-blue-600 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl tracking-tight">
              EventFlow
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={`text-white hover:text-blue-200 text-sm ${pathname === '/dashboard' ? 'font-semibold underline' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/create-event" className={`text-white hover:text-blue-200 text-sm ${pathname === '/create-event' ? 'font-semibold underline' : ''}`}>
                  Create Event
                </Link>
                <Link href="/my-bookings" className={`text-white hover:text-blue-200 text-sm ${pathname === '/my-bookings' ? 'font-semibold underline' : ''}`}>
                  My Bookings
                </Link>
                <Link href="/my-events" className={`text-white hover:text-blue-200 text-sm ${pathname === '/my-events' ? 'font-semibold underline' : ''}`}>
                  My Events
                </Link>

                {/* ইউজার ইমেল এবং প্রোফাইল আইকন */}
                <div className="flex items-center bg-blue-700 px-3 py-1 rounded-full border border-blue-500 space-x-2 ml-2">
                  <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ring-2 ring-blue-400">
                    {userEmail ? userEmail.charAt(0) : 'U'}
                  </div>
                  <span className="text-white text-xs font-medium hidden md:block max-w-[150px] truncate">
                    {userEmail}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/" className={`text-white hover:text-blue-200 ${pathname === '/' ? 'font-semibold underline' : ''}`}>
                  Login
                </Link>
                <Link href="/register" className={`text-white hover:text-blue-200 ${pathname === '/register' ? 'font-semibold underline' : ''}`}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
