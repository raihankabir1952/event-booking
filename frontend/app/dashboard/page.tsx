'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../utils/apiService'; 
import AuthGuard from '../components/AuthGuard';
import { Calendar, MapPin, Users, Search, RefreshCw } from 'lucide-react'; // আইকনের জন্য

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
      await apiService.post('/bookings', { eventId });
      alert('Booking successful! Check your inbox.');
      fetchEvents(locationFilter, dateFilter); 
    } catch (err: any) {
        alert(`Booking failed: ${err.response?.data?.message || 'Something went wrong.'}`);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Hero Section */}
        <div className="bg-blue-600 pt-10 pb-24 px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-2">Explore Events 2026</h1>
            <p className="text-blue-100">Discover and book the best events happening around you.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 -mt-16">
          
          {/* Search Bar - Glassmorphism style */}
          <form onSubmit={handleSearch} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-wrap md:flex-nowrap gap-4 border border-white/20 mb-10">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by location..." 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 p-3 bg-white border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 p-3 bg-white border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center gap-2">
              <Search className="w-5 h-5" /> Search
            </button>
            <button 
              type="button" 
              onClick={() => { setLocationFilter(''); setDateFilter(''); fetchEvents(); }} 
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </form>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="h-3 bg-blue-600 w-full group-hover:h-4 transition-all"></div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">{event.description}</p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          By: <span className="ml-1 font-semibold text-gray-800">{event.creator.name}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Availability</p>
                          {event.attendeeCount < event.capacity ? (
                            <p className="text-green-600 font-bold">{event.capacity - event.attendeeCount} Seats Left</p>
                          ) : (
                            <p className="text-red-500 font-bold">Sold Out</p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleBooking(event.id)} 
                          disabled={event.attendeeCount >= event.capacity} 
                          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-md ${
                            event.attendeeCount >= event.capacity 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          }`}
                        >
                          {event.attendeeCount >= event.capacity ? 'Full' : 'Book Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner border border-dashed border-gray-300">
                  <p className="text-gray-400 text-lg font-medium">No events found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
