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
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location must be at least 3 characters long'),
  capacity: z.preprocess((val) => Number(val), z.number().min(1, 'Capacity must be at least 1')), 
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
    }
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      await apiService.post('/events', data);
      toast.success('Event created successfully!');
      router.push('/dashboard'); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create event.');
    }
  };

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
        style={{ backgroundImage: "url('/create_a_event.jpg')" }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Glassmorphism Form Card */}
        <div className="relative z-10 w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white mb-2">Create New Event</h1>
            <p className="text-gray-300">Fill in the details below to host your event</p>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-200 font-medium mb-1.5 ml-1">Event Title</label>
                <input 
                  {...register('title')} 
                  placeholder="Enter a catchy title"
                  className={`w-full bg-white/10 border p-3 rounded-xl focus:ring-2 outline-none text-white placeholder-gray-400 transition-all ${errors.title ? 'border-red-500 ring-red-200' : 'border-white/20 focus:ring-blue-500'}`} 
                />
                {errors.title && <p className="text-red-400 text-xs mt-1 ml-1">{errors.title?.message}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-200 font-medium mb-1.5 ml-1">Description</label>
                <textarea 
                  {...register('description')} 
                  rows={3}
                  placeholder="What is this event about?"
                  className={`w-full bg-white/10 border p-3 rounded-xl focus:ring-2 outline-none text-white placeholder-gray-400 transition-all ${errors.description ? 'border-red-500 ring-red-200' : 'border-white/20 focus:ring-blue-500'}`} 
                />
                {errors.description && <p className="text-red-400 text-xs mt-1 ml-1">{errors.description?.message}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-200 font-medium mb-1.5 ml-1">Event Date</label>
                <input 
                  type="date" 
                  {...register('date')} 
                  className={`w-full bg-white/10 border p-3 rounded-xl focus:ring-2 outline-none text-white transition-all ${errors.date ? 'border-red-500 ring-red-200' : 'border-white/20 focus:ring-blue-500'} [color-scheme:dark]`} 
                />
                {errors.date && <p className="text-red-400 text-xs mt-1 ml-1">{errors.date?.message}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-gray-200 font-medium mb-1.5 ml-1">Capacity</label>
                <input 
                  type="number" 
                  {...register('capacity')} 
                  className={`w-full bg-white/10 border p-3 rounded-xl focus:ring-2 outline-none text-white transition-all ${errors.capacity ? 'border-red-500 ring-red-200' : 'border-white/20 focus:ring-blue-500'}`} 
                />
                {errors.capacity && <p className="text-red-400 text-xs mt-1 ml-1">{errors.capacity?.message}</p>}
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-gray-200 font-medium mb-1.5 ml-1">Location</label>
                <input 
                  type="text" 
                  {...register('location')} 
                  placeholder="Dhaka, Bangladesh or Online"
                  className={`w-full bg-white/10 border p-3 rounded-xl focus:ring-2 outline-none text-white placeholder-gray-400 transition-all ${errors.location ? 'border-red-500 ring-red-200' : 'border-white/20 focus:ring-blue-500'}`} 
                />
                {errors.location && <p className="text-red-400 text-xs mt-1 ml-1">{errors.location?.message}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl w-full transition shadow-lg transform active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <span className="flex justify-center items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Event...
                </span>
              ) : 'Publish Event'}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
