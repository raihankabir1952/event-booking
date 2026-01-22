// frontend/app/create-event/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService'; // 👈 এটি ইমপোর্ট করুন
import AuthGuard from '../components/AuthGuard';

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

    if (!token) {
      router.push('/');
      return;
    }

    try {
      // apiService ব্যবহার করে ইভেন্ট তৈরি API কল করা হচ্ছে
      await apiService.post('/events', 
        { title, description, date, location, capacity: Number(capacity) }
        // header will be added by interceptor
      );
      alert('Event created successfully!');
      router.push('/dashboard'); // সফল হলে ড্যাশবোর্ডে ফেরত যাওয়া
    } catch (err: any) {
      setError(`Failed to create event: ${err.response?.data?.message || 'Something went wrong.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Event</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* ফর্ম ফিল্ডগুলো */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border p-2 rounded"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Capacity</label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} required className="w-full border p-2 rounded" min="1" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded w-full disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
    </AuthGuard>
  );
}
