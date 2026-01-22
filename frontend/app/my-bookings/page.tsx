// frontend/app/my-bookings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService'; 
import AuthGuard from '../components/AuthGuard';
import TicketModal from '../components/TicketModal'; 

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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); 
  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const response = await apiService.get('/bookings/my'); 
      setBookings(response.data as Booking[]); 
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await apiService.delete(`/bookings/${bookingId}`); 
        alert('Booking cancelled successfully!');
        fetchBookings(); 
      } catch (err: any) {
        alert(`Cancellation failed: ${err.response?.data?.message || 'Something went wrong.'}`);
      }
    }
  };

  if (loading) return <div className="p-4 text-center text-black">Loading bookings...</div>;

  return (
    <AuthGuard>
      <div className="p-8 max-w-7xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <p className="text-gray-500">You have no active bookings.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center border border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-blue-600">{booking.event.title}</h2>
                  <p className="text-gray-600 font-medium">{booking.event.location}</p>
                  <p className="text-gray-400 text-xs">
                    Date: {new Date(booking.event.date).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  {/* ticket button */}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  >
                    View Ticket
                  </button>

                  {/* cancel button */}
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-semibold transition duration-300 border border-red-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ticket modal rendering */}
        {selectedBooking && (
          <TicketModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
          />
        )}
      </div>
    </AuthGuard>
  );
}
