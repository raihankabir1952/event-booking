'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiService from '../../utils/apiService';
import AuthGuard from '../components/AuthGuard';
import { toast } from 'react-toastify';

const eventSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters long'),

  description: z
    .string()
    .min(
      20,
      'Description must be at least 20 characters long',
    ),

  date: z.string().min(1, 'Date is required'),

  location: z
    .string()
    .min(
      3,
      'Location must be at least 3 characters long',
    ),

  capacity: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, 'Capacity must be at least 1'),
  ),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema as any),

    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      capacity: 20,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      await apiService.post('/events', data);

      toast.success('Event created successfully!');

      router.push('/dashboard');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Failed to create event.',
      );
    }
  };

  return (
    <AuthGuard>
      <div
        className="relative flex min-h-screen items-center justify-center overflow-y-auto bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6 sm:py-10 md:px-8"
        style={{
          backgroundImage:
            "url('/create_a_event.jpg')",
        }}
      >
        {/* ================= BACKGROUND OVERLAY ================= */}
        <div className="absolute inset-0 bg-black/60" />

        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 w-full max-w-2xl">

          {/* ================= HEADER ================= */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Create New Event
            </h1>

            <p className="mt-2 px-2 text-sm leading-6 text-gray-300 sm:text-base">
              Fill in the details below to host your event
            </p>
          </div>

          {/* ================= FORM CARD ================= */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-lg sm:space-y-6 sm:rounded-3xl sm:p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">

              {/* ================= TITLE ================= */}
              <div className="md:col-span-2">
                <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-200">
                  Event Title
                </label>

                <input
                  {...register('title')}
                  placeholder="Enter a catchy title"
                  className={`w-full rounded-xl border bg-white/10 p-3 text-sm text-white outline-none transition-all placeholder:text-gray-400 focus:ring-2 sm:p-3.5 sm:text-base ${
                    errors.title
                      ? 'border-red-500 ring-red-200'
                      : 'border-white/20 focus:border-transparent focus:ring-blue-500'
                  }`}
                />

                {errors.title && (
                  <p className="mt-1 ml-1 text-xs text-red-400 sm:text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* ================= DESCRIPTION ================= */}
              <div className="md:col-span-2">
                <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-200">
                  Description
                </label>

                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="What is this event about?"
                  className={`w-full resize-none rounded-xl border bg-white/10 p-3 text-sm text-white outline-none transition-all placeholder:text-gray-400 focus:ring-2 sm:p-3.5 sm:text-base ${
                    errors.description
                      ? 'border-red-500 ring-red-200'
                      : 'border-white/20 focus:border-transparent focus:ring-blue-500'
                  }`}
                />

                {errors.description && (
                  <p className="mt-1 ml-1 text-xs text-red-400 sm:text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* ================= DATE ================= */}
              <div>
                <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-200">
                  Event Date
                </label>

                <input
                  type="date"
                  {...register('date')}
                  className={`w-full rounded-xl border bg-white/10 p-3 text-sm text-white outline-none transition-all focus:ring-2 sm:p-3.5 sm:text-base ${
                    errors.date
                      ? 'border-red-500 ring-red-200'
                      : 'border-white/20 focus:border-transparent focus:ring-blue-500'
                  } [color-scheme:dark]`}
                />

                {errors.date && (
                  <p className="mt-1 ml-1 text-xs text-red-400 sm:text-sm">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* ================= CAPACITY ================= */}
              <div>
                <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-200">
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  {...register('capacity')}
                  className={`w-full rounded-xl border bg-white/10 p-3 text-sm text-white outline-none transition-all focus:ring-2 sm:p-3.5 sm:text-base ${
                    errors.capacity
                      ? 'border-red-500 ring-red-200'
                      : 'border-white/20 focus:border-transparent focus:ring-blue-500'
                  }`}
                />

                {errors.capacity && (
                  <p className="mt-1 ml-1 text-xs text-red-400 sm:text-sm">
                    {errors.capacity.message}
                  </p>
                )}
              </div>

              {/* ================= LOCATION ================= */}
              <div className="md:col-span-2">
                <label className="mb-1.5 ml-1 block text-sm font-medium text-gray-200">
                  Location
                </label>

                <input
                  type="text"
                  {...register('location')}
                  placeholder="Dhaka, Bangladesh or Online"
                  className={`w-full rounded-xl border bg-white/10 p-3 text-sm text-white outline-none transition-all placeholder:text-gray-400 focus:ring-2 sm:p-3.5 sm:text-base ${
                    errors.location
                      ? 'border-red-500 ring-red-200'
                      : 'border-white/20 focus:border-transparent focus:ring-blue-500'
                  }`}
                />

                {errors.location && (
                  <p className="mt-1 ml-1 text-xs text-red-400 sm:text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* ================= SUBMIT BUTTON ================= */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 min-h-[50px] w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-500 sm:py-4 sm:text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>

                  Creating Event...
                </span>
              ) : (
                'Publish Event'
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
