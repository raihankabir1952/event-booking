'use client';

import React, {
  useState,
  Suspense,
} from 'react';
import {
  useSearchParams,
  useRouter,
} from 'next/navigation';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error(
        'Password does not match',
      );
    }

    setLoading(true);

    try {
      await apiService.post(
        '/auth/reset-password',
        {
          token,
          password,
        },
      );

      toast.success(
        'Password successfully changed! Please login.',
      );

      router.push('/');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to reset password.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 text-black sm:px-6">

      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:rounded-3xl sm:p-8"
      >
        <h1 className="mb-5 text-center text-2xl font-bold leading-tight sm:mb-6 sm:text-3xl">
          নতুন পাসওয়ার্ড সেট করুন
        </h1>

        {/* New Password */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="New password"
            required
            className="min-h-[48px] w-full rounded-xl border border-gray-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-base"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-5 sm:mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value,
              )
            }
            placeholder="Confirm password"
            required
            className="min-h-[48px] w-full rounded-xl border border-gray-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="min-h-[48px] w-full rounded-xl bg-green-600 p-3 text-sm font-bold text-white transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
        >
          {loading
            ? 'Updating...'
            : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-gray-700">
          <p className="text-sm sm:text-base">
            লোডিং...
          </p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}