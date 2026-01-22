// frontend/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService'; 
import AuthGuard from '../components/AuthGuard';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
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
  const router = useRouter();

  const fetchEvents = async (location = '', date = '') => {
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (!token) {
      router.push('/');
      return;
    }

    setLoading(true);
    try {
      let url = '/events';
      
      if (location || date) {
        url = `/events/search?location=${location}&date=${date}`;
      }

      
      const response = await apiService.get<Event[]>(url);
      setEvents(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch events.');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('userToken'); 
        localStorage.removeItem('userEmail');
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (!token) {
      alert('You need to be logged in to book an event.');
      router.push('/');
      return;
    }

    try {
      
      await apiService.post('/bookings', { eventId });
      alert('Booking successful! Check your Mailtrap inbox for confirmation.');
      fetchEvents(locationFilter, dateFilter); 
    } catch (err: any) {
        alert(`Booking failed: ${err.response?.data?.message || 'Something went wrong.'}`);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading events...</div>;
  
  return (
     <AuthGuard>
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Events</h1>
      
      
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow-md flex gap-4">
        <input 
          type="text" 
          placeholder="Search by location..." 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <input 
          type="date" 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
        <button type="button" onClick={() => { setLocationFilter(''); setDateFilter(''); fetchEvents(); }} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
          Reset
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-gray-500">{event.location}</span>
                <span className="text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">By: {event.creator.name}</span>
                  {event.attendeeCount < event.capacity ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {event.capacity - event.attendeeCount} seats left
                      </span>
                  ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Sold Out
                      </span>
                  )}
              </div>
              <button 
                  onClick={() => handleBooking(event.id)} 
                  disabled={event.attendeeCount >= event.capacity} 
                  className={`mt-4 w-full p-2 rounded-lg font-semibold transition duration-300 ${
                      event.attendeeCount >= event.capacity 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                  {event.attendeeCount >= event.capacity ? 'Full' : 'Book Now'}
              </button>
            </div>
          ))
        ) : (
            <p className="col-span-3 text-center">No events found matching your criteria.</p>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
