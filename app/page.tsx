'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Home from '@/components/Home';
import { Header } from '@/components/Header';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('auth');
    if (auth === 'true') {
      router.push('/dashboard');
    }
    // else {
    //   router.push('/auth/login');
    // }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Header />
      <Home />    </div>
  );
}