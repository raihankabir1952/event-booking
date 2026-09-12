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

interface BookingResponse {
  id: number;
  paymentStatus: string;
  transactionId: string | null;
}

interface PaymentResponse {
  GatewayPageURL: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [bookingLoading, setBookingLoading] = useState<number | null>(
    null,
  );

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
      const bookingResponse =
        await apiService.post<BookingResponse>(
          '/bookings',
          {
            eventId,
          },
        );

      const bookingId = bookingResponse.data.id;

      console.log('Booking created:', bookingId);

      // Step 2: Initiate SSLCommerz payment
      const paymentResponse =
        await apiService.post<PaymentResponse>(
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

      // Step 4: Redirect to SSLCommerz
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
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            Explore Events 2026
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover and book the best events happening
            around you.
          </p>
        </div>

        {/* ================= SEARCH SECTION ================= */}
        <form
          onSubmit={handleSearch}
          className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:mb-8 sm:p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">

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
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:text-base"
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
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:text-base"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-[0.98] sm:text-base"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </form>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex min-h-[250px] items-center justify-center py-16">
            <RefreshCw
              size={28}
              className="animate-spin text-purple-600"
            />

            <span className="ml-3 text-sm text-slate-600 sm:text-base">
              Loading events...
            </span>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-5 text-center text-sm text-red-600 sm:text-base">
            {error}
          </div>
        )}

        {/* ================= EVENTS ================= */}
        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {events.map((event) => {
                const seatsLeft =
                  event.capacity - event.attendeeCount;

                const isFull = seatsLeft <= 0;

                const isBooking =
                  bookingLoading === event.id;

                return (
                  <div
                    key={event.id}
                    className="flex min-w-0 flex-col rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
                  >
                    {/* Event Title */}
                    <h2 className="mb-3 break-words text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                      {event.title}
                    </h2>

                    {/* Description */}
                    <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                      {event.description}
                    </p>

                    {/* Event Info */}
                    <div className="space-y-3 text-sm text-slate-600">

                      {/* Date */}
                      <div className="flex min-w-0 items-start gap-2">
                        <Calendar
                          size={18}
                          className="mt-0.5 shrink-0 text-purple-600"
                        />

                        <span className="break-words">
                          {event.date}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex min-w-0 items-start gap-2">
                        <MapPin
                          size={18}
                          className="mt-0.5 shrink-0 text-purple-600"
                        />

                        <span className="break-words">
                          {event.location}
                        </span>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-2">
                        <Users
                          size={18}
                          className="shrink-0 text-purple-600"
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
                      <div className="pt-2 text-lg font-bold text-slate-900 sm:text-xl">
                        {event.price} BDT
                      </div>
                    </div>

                    {/* Booking Button */}
                    <button
                      onClick={() =>
                        handleBooking(event.id)
                      }
                      disabled={isFull || isBooking}
                      className={`mt-6 min-h-[48px] w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] sm:text-base ${
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

        {/* ================= NO EVENTS ================= */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm sm:p-10">
              <p className="text-sm text-slate-600 sm:text-base">
                No events found matching your criteria.
              </p>
            </div>
          )}
      </div>
    </AuthGuard>
  );
}
