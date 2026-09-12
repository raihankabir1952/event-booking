'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService';
import AuthGuard from '../components/AuthGuard';
import { toast } from 'react-toastify';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  attendeeCount: number;
  creator: {
    email: string;
  };
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null);

  const router = useRouter();

  const fetchMyEvents = async () => {
    try {
      const response = await apiService.get('/events');

      const allEvents = response.data as Event[];

      const userEmail =
        typeof window !== 'undefined'
          ? localStorage.getItem('userEmail')
          : null;

      const myEvents = allEvents.filter(
        (event: Event) =>
          event.creator.email === userEmail,
      );

      setEvents(myEvents);
    } catch (err) {
      toast.error('Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Delete function
  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this event?',
      )
    ) {
      return;
    }

    try {
      await apiService.delete(`/events/${id}`);

      toast.success('Event deleted successfully');

      fetchMyEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  // Update function
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEvent) return;

    try {
      await apiService.patch(
        `/events/${editingEvent.id}`,
        {
          title: editingEvent.title,
          description: editingEvent.description,
          location: editingEvent.location,
          capacity: Number(editingEvent.capacity),
        },
      );

      toast.success('Event updated successfully');

      setEditingEvent(null);

      fetchMyEvents();
    } catch (err) {
      toast.error('Failed to update event');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-sm text-gray-600 sm:text-base">
        Loading your events...
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
              Events I Organize
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage the events you have created.
            </p>
          </div>

          {/* ================= EMPTY STATE ================= */}
          {events.length === 0 ? (
            <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:px-8 sm:py-12">
              <p className="text-sm text-gray-500 sm:text-base">
                You haven&apos;t created any events yet.
              </p>

              <button
                onClick={() => router.push('/create-event')}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] sm:text-base"
              >
                Create an Event
              </button>
            </div>
          ) : (
            /* ================= EVENTS GRID ================= */
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
                >
                  {/* ================= EVENT INFO ================= */}
                  <div className="flex-1">

                    {/* Title */}
                    <h2 className="mb-2 break-words text-lg font-semibold leading-snug text-blue-600 sm:text-xl">
                      {event.title}
                    </h2>

                    {/* Description */}
                    <p className="mb-4 line-clamp-4 break-words text-sm leading-6 text-gray-600 sm:text-base">
                      {event.description}
                    </p>

                    {/* Location */}
                    <p className="mb-2 break-words text-sm text-gray-500">
                      📍 {event.location}
                    </p>

                    {/* Date */}
                    <p className="mb-4 text-sm text-gray-500">
                      📅{' '}
                      {new Date(
                        event.date,
                      ).toLocaleDateString()}
                    </p>

                    {/* Capacity */}
                    <div className="mb-5 rounded-lg bg-slate-50 px-3 py-2 text-sm text-gray-600">
                      <span className="font-medium">
                        Capacity:
                      </span>{' '}
                      {event.capacity}
                    </div>
                  </div>

                  {/* ================= ACTION BUTTONS ================= */}
                  <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">

                    {/* Edit */}
                    <button
                      onClick={() =>
                        setEditingEvent(event)
                      }
                      className="w-full rounded-lg bg-yellow-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600 active:scale-[0.98] sm:flex-1 sm:py-2"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        handleDelete(event.id)
                      }
                      className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.98] sm:flex-1 sm:py-2"
                    >
                      Delete
                    </button>

                    {/* View Attendees */}
                    <button
                      onClick={() =>
                        router.push(
                          `/my-events/${event.id}`,
                        )
                      }
                      className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.98] sm:flex-1 sm:py-2"
                    >
                      View Attendees
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= EDIT MODAL ================= */}
          {editingEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">

              <form
                onSubmit={handleUpdate}
                className="my-6 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
              >
                {/* Modal Header */}
                <h2 className="mb-5 border-b pb-3 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">
                  Edit Event
                </h2>

                <div className="space-y-4">

                  {/* Title */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title
                    </label>

                    <input
                      className="w-full rounded-lg border p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                      value={editingEvent.title}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      className="w-full resize-none rounded-lg border p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                      value={
                        editingEvent.description
                      }
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          description:
                            e.target.value,
                        })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Location
                    </label>

                    <input
                      className="w-full rounded-lg border p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                      value={editingEvent.location}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Capacity
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="w-full rounded-lg border p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                      value={editingEvent.capacity}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          capacity: Number(
                            e.target.value,
                          ),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] sm:flex-1"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingEvent(null)
                    }
                    className="w-full rounded-lg bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-400 active:scale-[0.98] sm:flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
