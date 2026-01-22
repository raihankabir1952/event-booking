// frontend/app/my-events/page.tsx
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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); 
  const router = useRouter();

  const fetchMyEvents = async () => {
    try {
      const response = await apiService.get('/events');
      const allEvents = response.data as Event[];
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      const myEvents = allEvents.filter((event: Event) => event.creator.email === userEmail);
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

  // delete function
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiService.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      fetchMyEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  // update function 
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await apiService.patch(`/events/${editingEvent.id}`, {
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        capacity: Number(editingEvent.capacity),
      });
      toast.success('Event updated successfully');
      setEditingEvent(null);
      fetchMyEvents();
    } catch (err) {
      toast.error('Failed to update event');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading your events...</div>;

  return (
    <AuthGuard>
      <div className="p-8 max-w-7xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Events I Organize</h1>
        
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-10">You haven't created any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <p className="text-sm text-gray-500 mb-1">📍 {event.location}</p>
                  <p className="text-sm text-gray-500 mb-4">📅 {new Date(event.date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-3 border-t pt-4">
                  <button 
                    onClick={() => setEditingEvent(event)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button 
  onClick={() => router.push(`/my-events/${event.id}`)}
  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
>
  View Attendees
</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Event</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingEvent.description} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} rows={3} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingEvent.location} onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingEvent.capacity} onChange={(e) => setEditingEvent({...editingEvent, capacity: Number(e.target.value)})} required />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Save Changes</button>
                <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
