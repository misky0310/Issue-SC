'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      
      if (userString && userString !== 'undefined') {
        const userData = JSON.parse(userString);
        
        if (userData && userData.role) {
          if (userData.role === 'operator') {
            router.push('/operator');
          } else if (userData.role === 'faculty') {
            router.push('/faculty');
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}