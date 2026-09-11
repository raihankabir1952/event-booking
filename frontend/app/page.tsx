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
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/landing_page.jpg')" }}
    >
      {/* Background Overlay: টেক্সট স্পষ্ট করার জন্য ডার্ক গ্রাডিয়েন্ট */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85"></div>

      {/* Decorative Blur Elements: ব্যাকগ্রাউন্ডে আধুনিক লুকের জন্য */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-green-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Animated Icon Container */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl p-5 rounded-3xl border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
          Manage Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 uppercase italic">
            Events
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          "From Planning to Party – We’ve Got You Covered." <br />
          <span className="text-sm md:text-base text-gray-400 mt-4 block font-normal tracking-widest uppercase">Experience the future of event management</span>
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* Green Login Button with Hover Glow */}
          <Link 
            href="/login" 
            className="px-12 py-5 bg-green-600 text-white text-xl font-black rounded-2xl 
                       shadow-[0_10px_25px_rgba(22,163,74,0.4)] 
                       hover:shadow-[0_15px_35px_rgba(34,197,94,0.6)] 
                       hover:bg-green-500 hover:-translate-y-1.5 active:scale-95
                       transition-all duration-300 w-full sm:w-auto text-center border-b-4 border-green-800 hover:border-green-700"
          >
            Login
          </Link>
          
          {/* Transparent/Glass Register Button */}
          <Link 
            href="/register" 
            className="px-12 py-5 bg-white/5 backdrop-blur-md text-white text-xl font-black rounded-2xl 
                       border-2 border-white/20 hover:border-white/60 hover:bg-white/10 
                       hover:-translate-y-1.5 active:scale-95
                       transition-all duration-300 w-full sm:w-auto text-center"
          >
            Register Now
          </Link>
        </div>

      </div>
    </div>
  );
}
