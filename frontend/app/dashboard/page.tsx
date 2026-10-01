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

interface MyBooking {
  id: number;
  event: {
    id: number;
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

      const [eventsResponse, bookingsResponse] =
        await Promise.all([
          apiService.get<Event[]>(url),
          apiService.get<MyBooking[]>('/bookings/my'),
        ]);

      const bookedEventIds = new Set(
        bookingsResponse.data.map(
          (booking) => booking.event.id,
        ),
      );

      const availableEvents =
        eventsResponse.data.filter(
          (event) => !bookedEventIds.has(event.id),
        );

      setEvents(availableEvents);
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
        <div className="mx-auto mb-7 max-w-7xl sm:mb-9">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-600" />

            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 sm:text-sm">
              Event Discovery
            </span>
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Explore Events 2026
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover and book the best events happening
            around you.
          </p>
        </div>

        {/* ================= SEARCH SECTION ================= */}
        <div className="mx-auto max-w-7xl">
          <form
            onSubmit={handleSearch}
            className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-9 sm:p-5 lg:p-6"
          >
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Find your next event
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Search events by location or date.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">

              {/* Location */}
              <div className="relative">
                <MapPin
                  size={19}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by location"
                  value={locationFilter}
                  onChange={(e) =>
                    setLocationFilter(e.target.value)
                  }
                  className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 sm:text-base"
                />
              </div>

              {/* Date */}
              <div className="relative">
                <Calendar
                  size={19}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value)
                  }
                  className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 sm:text-base"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-md active:scale-[0.98] sm:text-base"
              >
                <Search size={19} />
                Search Events
              </button>
            </div>
          </form>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="mx-auto flex min-h-[300px] max-w-7xl items-center justify-center py-16">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 rounded-full bg-purple-50 p-4">
                <RefreshCw
                  size={28}
                  className="animate-spin text-purple-600"
                />
              </div>

              <p className="text-sm font-medium text-slate-600 sm:text-base">
                Loading events...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Please wait a moment.
              </p>
            </div>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="mx-auto max-w-7xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center sm:p-8">
            <p className="text-sm font-medium text-red-600 sm:text-base">
              {error}
            </p>

            <button
              onClick={() =>
                fetchEvents(locationFilter, dateFilter)
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= EVENTS ================= */}
        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="mx-auto max-w-7xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Available Events
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {events.length}{' '}
                    {events.length === 1
                      ? 'event'
                      : 'events'}{' '}
                    available
                  </p>
                </div>
              </div>

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
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
                    >
                      {/* Card Top Accent */}
                      <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />

                      <div className="flex flex-1 flex-col p-5 sm:p-6">

                        {/* Event Title */}
                        <div className="mb-3">
                          <h2 className="break-words text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-purple-700 sm:text-xl">
                            {event.title}
                          </h2>
                        </div>

                        {/* Description */}
                        <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                          {event.description}
                        </p>

                        {/* Event Info */}
                        <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

                          {/* Date */}
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-purple-100 p-1.5">
                              <Calendar
                                size={16}
                                className="text-purple-600"
                              />
                            </div>

                            <span className="break-words pt-1 font-medium">
                              {event.date}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-purple-100 p-1.5">
                              <MapPin
                                size={16}
                                className="text-purple-600"
                              />
                            </div>

                            <span className="break-words pt-1 font-medium">
                              {event.location}
                            </span>
                          </div>

                          {/* Availability */}
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-1.5">
                              <Users
                                size={16}
                                className="text-purple-600"
                              />
                            </div>

                            {isFull ? (
                              <span className="font-semibold text-red-600">
                                Sold Out
                              </span>
                            ) : (
                              <span className="font-medium text-slate-700">
                                {seatsLeft} Seats Left
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Ticket Price
                          </span>

                          <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                            {event.price}{' '}
                            <span className="text-sm font-semibold text-purple-600">
                              BDT
                            </span>
                          </span>
                        </div>

                        {/* Booking Button */}
                        <button
                          onClick={() =>
                            handleBooking(event.id)
                          }
                          disabled={isFull || isBooking}
                          className={`mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] sm:text-base ${
                            isFull
                              ? 'cursor-not-allowed bg-slate-400'
                              : isBooking
                              ? 'cursor-not-allowed bg-purple-400'
                              : 'bg-purple-600 hover:bg-purple-700 hover:shadow-md'
                          }`}
                        >
                          {isBooking
                            ? 'Processing...'
                            : isFull
                            ? 'Sold Out'
                            : 'Book & Pay'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* ================= NO EVENTS ================= */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
                  <Search
                    size={25}
                    className="text-purple-600"
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  No events found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                  No events match your current search criteria.
                  Try changing the location or date and search
                  again.
                </p>
              </div>
            </div>
          )}
      </div>
    </AuthGuard>
  );
}