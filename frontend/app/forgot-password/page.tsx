'use client';

import React, { useState } from 'react';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.post(
        '/auth/forgot-password',
        { email },
      );

      toast.success(
        'Password reset link is sent to your email',
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to send reset link.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 text-black sm:px-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:rounded-3xl sm:p-8"
      >
        <h1 className="mb-4 text-center text-2xl font-bold sm:mb-6 sm:text-3xl">
          Forgot Password?
        </h1>

        <p className="mb-5 text-center text-sm leading-6 text-gray-600 sm:mb-6">
          Enter your email and we'll send you a
          reset link.
        </p>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email Address"
            required
            className="min-h-[48px] w-full rounded-xl border border-gray-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="min-h-[48px] w-full rounded-xl bg-blue-600 p-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
        >
          {loading
            ? 'Sending...'
            : 'Send Link'}
        </button>

        <p className="mt-5 text-center text-sm">
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Go back to login page
          </Link>
        </p>
      </form>
    </div>
  );
}