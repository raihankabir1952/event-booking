'use client';

import React, { useState } from 'react';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/auth/forgot-password', { email });
      toast.success('password reset link is sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password?</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">Enter your email and we'll send you a reset link.</p>
        
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email Address"
          required 
          className="w-full border p-3 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg w-full transition disabled:bg-gray-400"
        >
          {loading ? 'sending...' : 'send link'}
        </button>

        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-blue-600 hover:underline">Go back to login page</Link>
        </p>
      </form>
    </div>
  );
}
