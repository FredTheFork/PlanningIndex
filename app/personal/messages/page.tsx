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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="font-inter text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <MessageCircle size={40} className="text-blue-600" />
          </div>
          <h1 className="font-inter font-bold text-2xl text-gray-900 mb-3">
            Messaging & Support
          </h1>
          <p className="font-inter text-gray-600 mb-6 leading-relaxed">
            Use the chat bubble in the bottom right corner of your screen to message our team about your documents. We're always here to help!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="font-inter text-sm text-blue-900">
              Look for the message icon in the bottom right corner. You'll see unread message notifications pop up there.
            </p>
          </div>
          <button
            onClick={() => {
              const bubble = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
              bubble?.click();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-inter font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Open Chat
          </button>
        </div>
      </div>
    </div>
  );
}
