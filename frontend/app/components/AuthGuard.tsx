// frontend/components/AuthGuard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // শুধুমাত্র ক্লায়েন্ট সাইডে এই চেক করা হবে
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (!token) {
        // টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট করা
        router.push('/');
      }
    }
  }, [router]);

  return <>{children}</>;
}
