'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (!token) {
        
        router.push('/');
      }
    }
  }, [router]);

  return <>{children}</>;
}
