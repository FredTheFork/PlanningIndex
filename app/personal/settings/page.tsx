'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { useClientProfile } from '@/hooks/useClientProfile';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, purchasedServiceIds } = useClientProfile();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('You must be signed in to delete your account.');
        setDeleting(false);
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ user_id: user?.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.push('/?deleted=true');
    } catch (err) {
      console.error('Delete account error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  };

  const serviceCount = purchasedServiceIds?.length || 0;

  return (
    <div className="max-w-2xl">
      <h1 className="font-inter font-bold text-navy text-2xl mb-6">Account Settings</h1>

      {/* Account Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-inter font-semibold text-navy text-lg mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <p className="font-inter text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
            <p className="font-inter text-dark-text">{user?.email}</p>
          </div>
          {serviceCount > 0 && (
            <div>
              <p className="font-inter text-xs text-gray-500 uppercase tracking-wider mb-1">Active Services</p>
              <p className="font-inter text-dark-text">{serviceCount} service{serviceCount !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="font-inter font-semibold text-red-600 text-lg mb-2">Delete Account</h2>
        <p className="font-inter text-secondary-text text-sm mb-4">
          This will permanently delete your account and all associated data, including:
        </p>
        <ul className="font-inter text-secondary-text text-sm mb-4 space-y-1 ml-4 list-disc">
          <li>Your profile and account information</li>
          <li>All intake form responses and uploads</li>
          <li>All generated documents and files</li>
          <li>Message history with our team</li>
          <li>Any active subscriptions or services</li>
        </ul>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          <Trash2 size={16} />
          Delete My Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-full bg-red-100 p-2 shrink-0">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-inter font-bold text-navy text-lg">Delete Account</h3>
                <p className="font-inter text-secondary-text text-sm mt-1">
                  This action cannot be undone. All your data will be permanently removed.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="font-inter text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                Type <span className="font-mono font-bold">DELETE MY ACCOUNT</span> to confirm
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-inter text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmationText('');
                  setError('');
                }}
                disabled={deleting}
                className="flex-1 font-inter font-semibold text-dark-text bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                style={{ padding: '10px 16px', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || confirmationText !== 'DELETE MY ACCOUNT'}
                className="flex-1 font-inter font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ padding: '10px 16px', fontSize: '0.9rem' }}
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
