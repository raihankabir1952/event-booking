// frontend/app/my-events/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiService from '../../../utils/apiService';
import AuthGuard from '../../components/AuthGuard';


interface Attendee {
  bookingId: number;
  userName: string;
  userEmail: string;
  bookedAt: string; 
}

export default function AttendeeListPage() {
  const params = useParams();
  const eventId = params.id;
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await apiService.get(`/events/${eventId}/attendees`);
        const data = response.data as any;

        if (data && data.attendees) {
          setAttendees(data.attendees as Attendee[]);
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  if (loading) return <div className="p-10 text-center text-black font-semibold">Loading attendee list...</div>;

  return (
    <AuthGuard>
      <div className="p-8 max-w-5xl mx-auto text-black">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Attendee List</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full">
            Total: {attendees.length}
          </span>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-5 py-4 border-b-2 text-left text-xs font-bold uppercase tracking-wider">
                  Attendee Name
                </th>
                <th className="px-5 py-4 border-b-2 text-left text-xs font-bold uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-5 py-4 border-b-2 text-left text-xs font-bold uppercase tracking-wider">
                  Booked At
                </th>
              </tr>
            </thead>
            <tbody>
              {attendees.length > 0 ? (
                attendees.map((attendee) => (
                  <tr key={attendee.bookingId} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="font-semibold text-gray-900">{attendee.userName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-600">{attendee.userEmail}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">
                      {/* date and time format: 22 Jan 2026, 03:20 PM */}
                      {attendee.bookedAt ? (
                        new Date(attendee.bookedAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-10 border-b border-gray-200 bg-white text-sm text-center text-gray-500 italic">
                    No bookings found for this event yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
