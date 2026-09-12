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
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const response = await apiService.get('/bookings/my');

      setBookings(response.data as Booking[]);
      setError('');
    } catch (err) {
      console.error('Fetch Bookings Error:', err);
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    if (
      window.confirm(
        'Are you sure you want to cancel this booking?',
      )
    ) {
      try {
        await apiService.delete(`/bookings/${bookingId}`);

        alert('Booking cancelled successfully!');

        fetchBookings();
      } catch (err: any) {
        alert(
          `Cancellation failed: ${
            err.response?.data?.message ||
            'Something went wrong.'
          }`,
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-sm text-slate-600 sm:text-base">
        Loading bookings...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 px-4 py-6 text-black sm:px-6 sm:py-8 md:px-8">
        <div className="mx-auto w-full max-w-7xl">

          {/* ================= PAGE HEADER ================= */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your booked events and tickets.
            </p>
          </div>

          {/* ================= ERROR ================= */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600 sm:text-base">
              {error}
            </div>
          )}

          {/* ================= EMPTY STATE ================= */}
          {bookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
              <p className="text-sm text-gray-500 sm:text-base">
                You have no active bookings.
              </p>

              <button
                onClick={() => router.push('/dashboard')}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] sm:text-base"
              >
                Explore Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">

              {/* ================= BOOKING CARDS ================= */}
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    {/* ================= EVENT INFO ================= */}
                    <div className="min-w-0 flex-1">

                      <h2 className="break-words text-lg font-bold leading-snug text-blue-600 sm:text-xl">
                        {booking.event.title}
                      </h2>

                      <p className="mt-2 break-words text-sm font-medium text-gray-600 sm:text-base">
                        {booking.event.location}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Date:{' '}
                        {new Date(
                          booking.event.date,
                        ).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* ================= ACTION BUTTONS ================= */}
                    <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:shrink-0">

                      {/* View Ticket */}
                      <button
                        onClick={() =>
                          setSelectedBooking(booking)
                        }
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700 active:scale-[0.98] sm:w-auto sm:min-w-[130px] sm:py-2"
                      >
                        View Ticket
                      </button>

                      {/* Cancel */}
                      <button
                        onClick={() =>
                          handleCancel(booking.id)
                        }
                        className="w-full rounded-lg border border-red-200 bg-red-100 px-4 py-3 text-sm font-semibold text-red-600 transition duration-300 hover:bg-red-600 hover:text-white active:scale-[0.98] sm:w-auto sm:min-w-[100px] sm:py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= TICKET MODAL ================= */}
          {selectedBooking && (
            <TicketModal
              booking={selectedBooking}
              onClose={() =>
                setSelectedBooking(null)
              }
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
