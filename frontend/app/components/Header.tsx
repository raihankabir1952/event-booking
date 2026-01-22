// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from './AuthContext';
// import { useEffect, useState } from 'react';

// export default function Header() {
//   const pathname = usePathname();
//   const { isLoggedIn, logout } = useAuth();
//   const [userName, setUserName] = useState<string | null>(null);

//   useEffect(() => {
//     if (isLoggedIn) {
//       // localStorage থেকে নাম নিয়ে আসা হচ্ছে
//       const name = localStorage.getItem('userName');
//       setUserName(name);
//     } else {
//       setUserName(null);
//     }
//   }, [isLoggedIn]);

//   return (
//     <header className="bg-blue-600 shadow-lg sticky top-0 z-50">
//       <nav className="max-w-[100%] mx-auto px-4 md:px-10 lg:px-16"> 
//         <div className="flex items-center justify-between h-20"> 
          
//           {/* Left Side: Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-white font-black text-2xl tracking-tighter flex items-center gap-2 group">
//               <div className="bg-white p-1 rounded-lg group-hover:scale-110 transition-transform">
//                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <span className="hidden sm:block">EventFlow</span>
//             </Link>
//           </div>

//           {/* Right Side: Navigation Links */}
//           <div className="flex items-center space-x-2 md:space-x-6">
//             {isLoggedIn ? (
//               <>
//                 <div className="hidden lg:flex items-center space-x-6 mr-4">
//                   <Link href="/dashboard" className={`text-white/90 hover:text-white text-sm font-medium transition-all ${pathname === '/dashboard' ? 'bg-white/20 px-3 py-2 rounded-lg text-white font-bold' : ''}`}>
//                     Dashboard
//                   </Link>
//                   <Link href="/create-event" className={`text-white/90 hover:text-white text-sm font-medium transition-all ${pathname === '/create-event' ? 'bg-white/20 px-3 py-2 rounded-lg text-white font-bold' : ''}`}>
//                     Create Event
//                   </Link>
//                   <Link href="/my-bookings" className={`text-white/90 hover:text-white text-sm font-medium transition-all ${pathname === '/my-bookings' ? 'bg-white/20 px-3 py-2 rounded-lg text-white font-bold' : ''}`}>
//                     My Bookings
//                   </Link>
//                   <Link href="/my-events" className={`text-white/90 hover:text-white text-sm font-medium transition-all ${pathname === '/my-events' ? 'bg-white/20 px-3 py-2 rounded-lg text-white font-bold' : ''}`}>
//                     My Events
//                   </Link>
//                 </div>

//                 {/* User Profile Link - এখন এখানে ইউজারের নাম দেখাবে */}
//                 <Link 
//                   href="/profile" 
//                   className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 space-x-2 hover:bg-white/20 transition-all cursor-pointer group/user"
//                   title="View Profile"
//                 >
//                   <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-bold uppercase shadow-sm group-hover/user:scale-110 transition-transform">
//                     {userName ? userName.charAt(0) : 'U'}
//                   </div>
//                   <span className="text-white text-xs font-semibold hidden md:block max-w-[120px] truncate">
//                     {userName ? userName : 'User'}
//                   </span>
//                 </Link>

//                 <button
//                   onClick={logout}
//                   className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all shadow-md active:scale-95"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <div className="space-x-4">
//                 <Link href="/login" className="text-white font-medium hover:text-blue-100">
//                   Login
//                 </Link>
//                 <Link href="/register" className="bg-white text-blue-600 px-5 py-2 rounded-xl font-bold shadow-md hover:bg-blue-50 transition-all">
//                   Get Started
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }



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

  return (
    <header className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <nav className="max-w-[100%] mx-auto px-4 md:px-10 lg:px-16"> 
        <div className="flex items-center justify-between h-20"> 
          
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-black text-2xl tracking-tighter flex items-center gap-2 group">
              <div className="bg-white p-1 rounded-lg group-hover:scale-110 transition-transform">
                 <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden sm:block">EventFlow</span>
            </Link>
          </div>

          {/* Right Side: Navigation Links */}
          <div className="flex items-center space-x-2 md:space-x-6">
            {isLoggedIn ? (
              <>
                <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 mr-4">
                  <Link href="/dashboard" className={`text-white/90 hover:text-white text-sm font-medium transition-all py-2 px-3 rounded-lg ${pathname === '/dashboard' ? 'bg-white/20 text-white font-bold' : ''}`}>
                    Dashboard
                  </Link>
                  <Link href="/create-event" className={`text-white/90 hover:text-white text-sm font-medium transition-all py-2 px-3 rounded-lg ${pathname === '/create-event' ? 'bg-white/20 text-white font-bold' : ''}`}>
                    Create Event
                  </Link>
                  <Link href="/my-bookings" className={`text-white/90 hover:text-white text-sm font-medium transition-all py-2 px-3 rounded-lg ${pathname === '/my-bookings' ? 'bg-white/20 text-white font-bold' : ''}`}>
                    My Bookings
                  </Link>
                  <Link href="/my-events" className={`text-white/90 hover:text-white text-sm font-medium transition-all py-2 px-3 rounded-lg ${pathname === '/my-events' ? 'bg-white/20 text-white font-bold' : ''}`}>
                    My Events
                  </Link>
                </div>

                {/* User Profile Capsule */}
                <Link 
                  href="/profile" 
                  className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 space-x-2 hover:bg-white/20 transition-all cursor-pointer group/user"
                  title="View Profile"
                >
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-bold uppercase shadow-sm group-hover/user:scale-110 transition-transform">
                    {userName ? userName.charAt(0) : 'U'}
                  </div>
                  <span className="text-white text-xs font-semibold hidden md:block max-w-[100px] lg:max-w-[150px] truncate">
                    {userName || 'User'}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-white font-medium hover:text-blue-100">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-blue-600 px-5 py-2 rounded-xl font-bold shadow-md hover:bg-blue-50 transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
