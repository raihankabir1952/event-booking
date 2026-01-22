'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import apiService from '../../utils/apiService'; 
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify'; 
import { useRouter } from 'next/navigation'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter(); 

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
      toast.success('Login Successful!');
      router.push('/dashboard'); 

    } catch (err: any) {
      setError('Login failed. Check email and password.'); 
    }
  };

  return (
    <div 
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/login.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <form 
        onSubmit={handleLogin} 
        className="relative z-10 p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-md mx-4"
      >
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600/20 rounded-full border border-blue-400/30">
              <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-center mb-2 text-white">EventFlow</h1>
        <p className="text-center text-gray-300 mb-8">Welcome back! Please login.</p>
        
        {error && <p className="text-red-400 mb-4 text-center text-sm">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-200 font-medium mb-1">Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border border-white/20 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-2 relative"> 
          <label className="block text-gray-200 font-medium mb-1">Password:</label>
          <input
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/10 border border-white/20 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 pr-12"
            placeholder="Enter your password"
            required
          />
          {/* Eye Icon Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" title="Reset your password" className="text-sm text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg w-full shadow-lg transition duration-300 transform active:scale-95"
        >
          Login
        </button>

         <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-semibold">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}
