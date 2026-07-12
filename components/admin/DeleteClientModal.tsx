'use client';

import { useState } from 'react';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

interface DeleteClientModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userId: string;
  email: string;
  businessName?: string;
}

export default function DeleteClientModal({
  open,
  onClose,
  onConfirm,
  userId,
  email,
  businessName,
}: DeleteClientModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const shortId = userId.slice(0, 8);

  const handleConfirm = async () => {
    if (confirmText !== shortId) return;
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
      setConfirmText('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete client');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setConfirmText('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="font-inter font-bold text-gray-900 text-lg">Delete Client Account</h2>
          </div>
          <button onClick={handleClose} disabled={deleting} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          <p className="font-inter text-sm text-red-800">
            This will <strong>permanently delete</strong> the account for:
          </p>
          <div className="font-inter text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">Email:</span> {email}</p>
            {businessName && <p><span className="font-medium">Business:</span> {businessName}</p>}
            <p className="font-mono text-xs text-gray-500">ID: {userId}</p>
          </div>
          <p className="font-inter text-xs text-red-700 mt-2">
            All intake data, briefs, documents, messages, subscriptions, and auth records will be removed.
            This action cannot be undone.
          </p>
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-gray-700 mb-1.5">
            Type <span className="font-mono font-bold text-red-600">{shortId}</span> to confirm deletion
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Type ${shortId}`}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-inter text-sm font-mono"
            disabled={deleting}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="font-inter text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            disabled={deleting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== shortId || deleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-inter text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {deleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
