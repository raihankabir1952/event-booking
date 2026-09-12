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
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500/30 border-t-green-500 sm:h-12 sm:w-12" />
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 sm:py-12"
      style={{ backgroundImage: "url('/landing_page.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85" />

      {/* Background Glow */}
      <div className="absolute left-[-120px] top-1/4 h-56 w-56 rounded-full bg-green-600/20 blur-[100px] sm:h-72 sm:w-72" />

      <div className="absolute bottom-1/4 right-[-120px] h-56 w-56 rounded-full bg-blue-600/20 blur-[100px] sm:h-72 sm:w-72" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">

        {/* Logo / Icon */}
        <div className="mb-6 flex justify-center sm:mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-green-500 blur-xl opacity-40 transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl transition-transform duration-500 group-hover:scale-105 sm:rounded-3xl sm:p-5">
              <svg
                className="h-9 w-9 text-green-400 sm:h-12 sm:w-12"
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
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-7xl lg:text-8xl">
          Manage Your
          <br />

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 uppercase italic">
            Events
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-gray-300 sm:mt-6 sm:text-lg sm:leading-8 md:text-2xl">
          &quot;From Planning to Party – We&apos;ve Got You Covered.&quot;
        </p>

        <span className="mt-3 block text-xs font-normal uppercase tracking-[0.18em] text-gray-400 sm:mt-4 sm:text-sm sm:tracking-widest">
          Experience the future of event management
        </span>

        {/* Buttons */}
        <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-4 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5 md:mt-12">
          
          {/* Login */}
          <Link
            href="/login"
            className="w-full rounded-2xl border-b-4 border-green-800 bg-green-600 px-8 py-4 text-center text-lg font-black text-white shadow-[0_10px_25px_rgba(22,163,74,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-green-700 hover:bg-green-500 hover:shadow-[0_15px_35px_rgba(34,197,94,0.6)] active:scale-95 sm:w-auto sm:min-w-[170px] sm:px-10 sm:py-5 sm:text-xl"
          >
            Login
          </Link>

          {/* Register */}
          <Link
            href="/register"
            className="w-full rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-center text-lg font-black text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/10 active:scale-95 sm:w-auto sm:min-w-[170px] sm:px-10 sm:py-5 sm:text-xl"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
