'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-off-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
          <p className="font-inter text-secondary-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center justify-center h-screen bg-off-white">
      <div className="max-w-md mx-auto px-6 py-12 text-center">
        <div className="bg-blue-50 rounded-lg p-6 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <MessageCircle size={32} className="text-medium-blue" />
        </div>
        <h1 className="font-inter font-bold text-2xl text-navy mb-2">
          Messages with Our Team
        </h1>
        <p className="font-inter text-secondary-text mb-6">
          Use the chat bubble in the bottom right corner to message our team about your documents. We're here to help!
        </p>
        <div className="bg-blue-50 border border-medium-blue rounded-lg p-4">
          <p className="font-inter text-sm text-navy">
            Look for the message icon in the bottom right corner of your screen to start chatting with us.
          </p>
        </div>
      </div>
    </div>
  );
}
