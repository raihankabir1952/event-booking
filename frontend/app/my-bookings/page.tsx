// frontend/app/my-bookings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService'; // 👈 এটি ইমপোর্ট করুন
import AuthGuard from '../components/AuthGuard';

interface Booking {
  id: number;
  event: {
    title: string;
    date: string;
    location: string;
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchBookings = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (!token) { router.push('/'); return; }

    try {
      // apiService ব্যবহার করে "My Bookings" API কল করা হচ্ছে
      const response = await apiService.get('/bookings/my'); 
      setBookings(response.data as Booking[]); 
    } catch (err) {
      setError('Failed to fetch bookings.');
      // error handling can be improved
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (!token) return;

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // apiService ব্যবহার করে বুকিং ক্যান্সেল API কল করা হচ্ছে
        await apiService.delete(`/bookings/${bookingId}`); 
        alert('Booking cancelled successfully!');
        fetchBookings(); // লিস্ট রিফ্রেশ করা
      } catch (err: any) {
        alert(`Cancellation failed: ${err.response?.data?.message || 'Something went wrong.'}`);
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Loading bookings...</div>;

  return (
     <AuthGuard>
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no active bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{booking.event.title}</h2>
                <p className="text-gray-600">{booking.event.location}</p>
                <p className="text-gray-500 text-sm">{new Date(booking.event.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleCancel(booking.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </AuthGuard>
  );
}
