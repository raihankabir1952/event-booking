'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService';
import AuthGuard from '../components/AuthGuard';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  RefreshCw,
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  attendeeCount: number;
  creator: {
    name: string;
  };
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);

  const router = useRouter();

  const fetchEvents = async (
    location = '',
    date = '',
  ) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('userToken')
        : null;

    if (!token) {
      router.push('/');
      return;
    }

    setLoading(true);

    try {
      let url = '/events';

      if (location || date) {
        url = `/events/search?location=${encodeURIComponent(
          location,
        )}&date=${encodeURIComponent(date)}`;
      }

      const response = await apiService.get<Event[]>(url);

      setEvents(response.data);
      setError('');
    } catch (err: any) {
      console.error('Fetch Events Error:', err);

      setError('Failed to fetch events.');

      if (err.response?.status === 401) {
        localStorage.clear();
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    fetchEvents(locationFilter, dateFilter);
  };

  const handleBooking = async (eventId: number) => {
    try {
      setBookingLoading(eventId);

      // Step 1: Create booking
      const bookingResponse = await apiService.post(
        '/bookings',
        {
          eventId,
        },
      );

      const bookingId = bookingResponse.data.id;

      console.log('Booking created:', bookingId);

      // Step 2: Initiate SSLCommerz payment
      const paymentResponse = await apiService.post(
        '/payments/initiate',
        {
          bookingId,
        },
      );

      console.log(
        'Payment Initiation Response:',
        paymentResponse.data,
      );

      // Step 3: Get SSLCommerz payment URL
      const paymentUrl =
        paymentResponse.data.GatewayPageURL;

      if (!paymentUrl) {
        throw new Error(
          'Payment URL was not received from SSLCommerz.',
        );
      }

      // Step 4: Redirect user to SSLCommerz
      window.location.href = paymentUrl;
    } catch (err: any) {
      console.error(
        'Booking/Payment Error:',
        err,
      );

      alert(
        err.response?.data?.message ||
          err.message ||
          'Booking or payment failed.',
      );
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Discover Events
          </h1>

          <p className="mt-2 text-slate-600">
            Find and book your favorite events.
          </p>
        </div>

        {/* Search Section */}
        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-2xl bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {/* Location */}
            <div className="relative">
              <MapPin
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by location"
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-purple-500"
              />
            </div>

            {/* Date */}
            <div className="relative">
              <Calendar
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-purple-500"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <RefreshCw
              size={28}
              className="animate-spin text-purple-600"
            />

            <span className="ml-3 text-slate-600">
              Loading events...
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-5 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Events */}
        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const seatsLeft =
                  event.capacity - event.attendeeCount;

                const isFull = seatsLeft <= 0;

                const isBooking =
                  bookingLoading === event.id;

                return (
                  <div
                    key={event.id}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Event Title */}
                    <h2 className="mb-3 text-xl font-bold text-slate-900">
                      {event.title}
                    </h2>

                    {/* Description */}
                    <p className="mb-5 line-clamp-3 text-sm text-slate-600">
                      {event.description}
                    </p>

                    {/* Event Info */}
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={18}
                          className="text-purple-600"
                        />
                        <span>{event.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin
                          size={18}
                          className="text-purple-600"
                        />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users
                          size={18}
                          className="text-purple-600"
                        />

                        {isFull ? (
                          <span className="font-semibold text-red-600">
                            Sold Out
                          </span>
                        ) : (
                          <span>
                            {seatsLeft} Seats Left
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="pt-2 text-lg font-bold text-slate-900">
                        {event.price} BDT
                      </div>
                    </div>

                    {/* Booking Button */}
                    <button
                      onClick={() =>
                        handleBooking(event.id)
                      }
                      disabled={isFull || isBooking}
                      className={`mt-6 w-full rounded-lg px-4 py-3 font-semibold text-white transition ${
                        isFull
                          ? 'cursor-not-allowed bg-slate-400'
                          : isBooking
                          ? 'cursor-not-allowed bg-purple-400'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {isBooking
                        ? 'Processing...'
                        : isFull
                        ? 'Full'
                        : 'Book & Pay'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        {/* No Events */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-600">
                No events found matching your criteria.
              </p>
            </div>
          )}
      </div>
    </AuthGuard>
  );
}