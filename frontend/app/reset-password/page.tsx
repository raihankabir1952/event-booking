'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('password does not match');
    }

    setLoading(true);
    try {
      await apiService.post('/auth/reset-password', { token, password });
      toast.success('Password successfully changed! Please login.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form onSubmit={handleReset} className="p-8 bg-white rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">নতুন পাসওয়ার্ড সেট করুন</h1>
        
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="new password"
          required 
          className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="confirm password"
          required 
          className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button 
          type="submit" 
          disabled={loading || !token}
          className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg w-full transition disabled:bg-gray-400"
        >
          {loading ? 'updated...' : 'change password'}
        </button>
      </form>
    </div>
  );
}

// Wrap the ResetPasswordForm in Suspense for potential future data fetching
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>লোডিং...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
