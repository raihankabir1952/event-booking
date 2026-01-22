// frontend/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify'; 

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [error, setError] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError('');

    try {
      await apiService.post('/users/register', {
        name,
        email,
        password,
      });

      toast.success('Registration Successful! Please login.');
      router.push('/login'); 

    } catch (err: any) {
      
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="p-8 bg-white rounded-lg shadow-xl w-96 text-black">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>
        {/* {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>} */}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Address:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg w-full transition duration-300 disabled:bg-gray-400"
        >
          {loading ? 'Signing Up...' : 'Register Account'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
