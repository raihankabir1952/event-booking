'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/my-bookings');
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

        {/* Success Icon */}
        <div className="mb-5 flex justify-center">
          <CheckCircle
            size={80}
            className="text-green-500"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="mt-3 text-slate-600">
          Your booking has been confirmed successfully.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          A confirmation email has been sent to you.
        </p>

        {/* Button */}
        <button
          onClick={() => router.push('/my-bookings')}
          className="mt-7 w-full rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
        >
          View My Bookings
        </button>

        {/* Countdown */}
        <p className="mt-4 text-sm text-slate-500">
          Redirecting to My Bookings in {countdown}s...
        </p>

      </div>
    </div>
  );
}
