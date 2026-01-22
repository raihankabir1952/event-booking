// frontend/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import apiService from '../utils/apiService';
import { useAuth } from './components/AuthContext';
import { toast } from 'react-toastify'; // 👈 এটি ইমপোর্ট করুন

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiService.post('/auth/login', {
        email,
        password,
      });

      const token = (response.data as any).access_token;
      
      login(token, email);

      // alert('Login Successful!'); // 👈 এটি সরিয়ে নিচের Toast যোগ করা হয়েছে
      toast.success('Login Successful!');

    } catch (err: any) {
      setError('Login failed. Check your email and password.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">EventFlow</h1>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg w-full transition duration-300"
        >
          Login
        </button>

         <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}
