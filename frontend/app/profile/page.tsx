'use client';

import React, { useEffect, useState } from 'react';
import AuthGuard from '../components/AuthGuard';

export default function ProfilePage() {
  const [userName, setUserName] = useState<string | null>('');
  const [userEmail, setUserEmail] = useState<string | null>('');

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
    setUserEmail(localStorage.getItem('userEmail'));
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="flex flex-col items-center">
            {/* profile icon */}
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-1">User Profile</h1>
            <p className="text-gray-500 mb-6 text-sm">Manage your account information</p>
            
            <div className="w-full space-y-4">
              {/* Full Name  */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Full Name</p>
                <p className="text-gray-800 font-medium">{userName || 'Not Available'}</p>
              </div>

              {/* Email Address Section */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email Address</p>
                <p className="text-gray-800 font-medium">{userEmail || 'Not Available'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Account Status</p>
                <p className="text-green-600 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active User
                </p>
              </div>
            </div>

            <button className="mt-8 w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
