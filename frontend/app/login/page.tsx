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

      console.log('LOGIN RESPONSE:', response.data);

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
      className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6 sm:py-10"
      style={{ backgroundImage: "url('/login.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-8"
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center sm:mb-5">
          <div className="rounded-full border border-blue-400/30 bg-blue-600/20 p-3 sm:p-4">
            <svg
              className="h-8 w-8 text-blue-400 sm:h-10 sm:w-10"
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

        {/* Heading */}
        <h1 className="mb-2 text-center text-2xl font-extrabold text-white sm:text-3xl">
          EventFlow
        </h1>

        <p className="mb-6 text-center text-sm text-gray-300 sm:mb-8 sm:text-base">
          Welcome back! Please login.
        </p>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-400 sm:text-sm">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-200">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[48px] w-full rounded-lg border border-white/20 bg-white/10 p-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-blue-500 sm:text-base"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-200">
            Password
          </label>

          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[48px] w-full rounded-lg border border-white/20 bg-white/10 p-3 pr-12 text-sm text-white outline-none transition focus:ring-2 focus:ring-blue-500 sm:text-base"
            placeholder="Enter your password"
            required
          />

          {/* Eye Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[37px] flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:text-white"
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="mb-6 flex justify-end">
          <Link
            href="/forgot-password"
            title="Reset your password"
            className="text-xs text-blue-400 hover:underline sm:text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="min-h-[48px] w-full rounded-lg bg-blue-600 p-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:bg-blue-700 active:scale-[0.98] sm:text-base"
        >
          Login
        </button>

        {/* Register */}
        <p className="mt-5 text-center text-xs text-gray-300 sm:mt-6 sm:text-sm">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-400 hover:underline"
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}