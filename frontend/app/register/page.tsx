'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify'; 

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.post('/users/register', {
        name,
        email,
        password,
      });

     
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);

      toast.success('Registration Successful! Please login.');
      router.push('/login'); 

    } catch (err: any) {
      toast.error('Registration failed. Try again.');
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div 
      className="relative flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/login.jpg')" }} 
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <form 
        onSubmit={handleRegister} 
        className="relative z-10 p-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-md mx-4"
      >
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full border border-blue-400/30">
              <svg className="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-2 text-white tracking-tight">Create Account</h1>
        <p className="text-center text-gray-300 mb-8 font-light">Join EventFlow today</p>
        
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-medium mb-1 ml-1">Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all" 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-medium mb-1 ml-1">Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all" 
          />
        </div>
        
        <div className="mb-8 relative"> 
          <label className="block text-gray-200 text-sm font-medium mb-1 ml-1">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full bg-white/10 border border-white/20 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all pr-12" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[40px] text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl shadow-lg transition duration-300 transform active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Account...
            </span>
          ) : 'Register Account'}
        </button>

        <p className="mt-8 text-center text-gray-300 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
