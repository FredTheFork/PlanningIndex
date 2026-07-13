'use client';

import { useState } from 'react';
import { Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ClearTestClientsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (toast: { message: string; type: 'success' | 'error' | 'warning' }) => void;
}

export default function ClearTestClientsModal({ open, onClose, onSuccess, showToast }: ClearTestClientsModalProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  if (!open) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { data: testProfiles, error: profileError } = await supabase
        .from('client_profiles')
        .select('user_id')
        .eq('is_test_client', true);

      if (profileError) throw new Error(`Failed to fetch test clients: ${profileError.message}`);
      if (!testProfiles || testProfiles.length === 0) {
        showToast({ message: 'No test clients to delete.', type: 'warning' });
        setDeleting(false);
        onClose();
        return;
      }

      setProgress({ done: 0, total: testProfiles.length });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        showToast({ message: 'You must be signed in as an admin.', type: 'error' });
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const p of testProfiles) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ user_id: p.user_id }),
            }
          );
          if (response.ok) successCount++;
          else failCount++;
        } catch {
          failCount++;
        }
        setProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }

      if (failCount === 0) {
        showToast({ message: `All ${successCount} test clients deleted.`, type: 'success' });
      } else {
        showToast({ message: `Deleted ${successCount}. ${failCount} failed.`, type: 'warning' });
      }
      onSuccess();
    } catch (err: any) {
      showToast({ message: `Delete failed: ${err.message}`, type: 'error' });
    } finally {
      setDeleting(false);
      setConfirming(false);
      setProgress({ done: 0, total: 0 });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Trash2 size={20} className="text-red-600" />
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg">Clear All Test Clients</h2>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="font-inter text-sm text-amber-800">
              This will permanently delete all clients flagged as test clients, including their auth
              accounts, intake responses, briefs, and documents. This cannot be undone.
            </p>
          </div>

          {deleting && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Loader2 size={16} className="animate-spin text-blue-600 shrink-0" />
              <p className="font-inter text-sm text-blue-700">
                Deleting test clients... {progress.done} / {progress.total}
              </p>
            </div>
          )}

          {!deleting && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirming}
                onChange={e => setConfirming(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="font-inter text-sm text-gray-700">
                I understand this action is irreversible.
              </span>
            </label>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-inter text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirming || deleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-inter text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete All Test Clients
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
