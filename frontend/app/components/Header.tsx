'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();

  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

    return () =>
      window.removeEventListener('storage', loadUserData);
  }, [isLoggedIn]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const linkStyle = (path: string) => `
    px-4 py-2 rounded-xl text-sm font-extrabold
    transition-all duration-300
    ${
      pathname === path
        ? 'bg-white text-blue-700 shadow-md'
        : 'text-white hover:bg-white/15'
    }
  `;

  const mobileLinkStyle = (path: string) => `
    block w-full px-4 py-3 rounded-xl text-sm font-extrabold
    transition-all duration-200
    ${
      pathname === path
        ? 'bg-white text-blue-700'
        : 'text-white hover:bg-white/15'
    }
  `;

  return (
    <header className="sticky top-0 z-50 bg-blue-600 shadow-xl">
      <nav className="mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16">
        {/* ================= DESKTOP / MOBILE HEADER ================= */}
        <div className="flex h-20 items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="rounded-xl bg-white p-1.5 transition-transform group-hover:rotate-6">
              <svg
                className="h-7 w-7 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <span className="text-xl font-black tracking-tighter text-white sm:text-2xl">
              EventFlow
            </span>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          {isLoggedIn && (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/dashboard"
                className={linkStyle('/dashboard')}
              >
                Dashboard
              </Link>

              <Link
                href="/create-event"
                className={linkStyle('/create-event')}
              >
                Create Event
              </Link>

              <Link
                href="/my-bookings"
                className={linkStyle('/my-bookings')}
              >
                My Bookings
              </Link>

              <Link
                href="/my-events"
                className={linkStyle('/my-events')}
              >
                My Events
              </Link>
            </div>
          )}

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-2 sm:gap-4">

            {isLoggedIn ? (
              <>
                {/* Profile - Desktop */}
                <Link
                  href="/profile"
                  className="hidden items-center rounded-full border border-white/30 bg-white/10 px-3 py-2 backdrop-blur-md transition-all hover:bg-white/20 sm:flex sm:px-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-blue-600 shadow-sm">
                    {userName
                      ? userName.charAt(0).toUpperCase()
                      : 'U'}
                  </div>

                  <span className="ml-3 max-w-[120px] truncate text-sm font-black text-white">
                    {userName || 'User'}
                  </span>
                </Link>

                {/* Logout - Desktop */}
                <button
                  onClick={logout}
                  className="hidden rounded-xl bg-red-500 px-4 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:bg-red-600 active:scale-95 sm:block sm:px-6"
                >
                  Logout
                </button>
              </>
            ) : (
              /* ================= GUEST DESKTOP ================= */
              <div className="hidden items-center gap-4 sm:flex sm:gap-6">
                <Link
                  href="/login"
                  className="text-sm font-black text-white transition-colors hover:text-blue-100"
                >
                  LOGIN
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-black text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:scale-105 sm:px-7"
                >
                  GET STARTED
                </Link>
              </div>
            )}

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 sm:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                /* X Icon */
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                /* Hamburger Icon */
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="border-t border-white/20 py-4 sm:hidden">

            {isLoggedIn ? (
              <div className="space-y-2">

                {/* Mobile Profile */}
                <Link
                  href="/profile"
                  className="mb-3 flex items-center gap-3 rounded-xl bg-white/10 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-blue-600">
                    {userName
                      ? userName.charAt(0).toUpperCase()
                      : 'U'}
                  </div>

                  <div>
                    <p className="text-sm font-black text-white">
                      {userName || 'User'}
                    </p>

                    <p className="text-xs text-blue-100">
                      View Profile
                    </p>
                  </div>
                </Link>

                {/* Mobile Navigation */}
                <Link
                  href="/dashboard"
                  className={mobileLinkStyle('/dashboard')}
                >
                  Dashboard
                </Link>

                <Link
                  href="/create-event"
                  className={mobileLinkStyle('/create-event')}
                >
                  Create Event
                </Link>

                <Link
                  href="/my-bookings"
                  className={mobileLinkStyle('/my-bookings')}
                >
                  My Bookings
                </Link>

                <Link
                  href="/my-events"
                  className={mobileLinkStyle('/my-events')}
                >
                  My Events
                </Link>

                {/* Mobile Logout */}
                <button
                  onClick={logout}
                  className="mt-2 w-full rounded-xl bg-red-500 px-4 py-3 text-left text-sm font-black text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">

                {/* Mobile Login */}
                <Link
                  href="/login"
                  className={mobileLinkStyle('/login')}
                >
                  LOGIN
                </Link>

                {/* Mobile Register */}
                <Link
                  href="/register"
                  className="block w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-black text-blue-600 transition hover:bg-blue-50"
                >
                  GET STARTED
                </Link>

              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
