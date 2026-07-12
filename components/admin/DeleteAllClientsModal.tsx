'use client';

import { useState } from 'react';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

interface DeleteAllClientsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  totalCount: number;
}

export default function DeleteAllClientsModal({
  open,
  onClose,
  onConfirm,
  totalCount,
}: DeleteAllClientsModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const requiredText = 'DELETE ALL';

  const handleConfirm = async () => {
    if (confirmText !== requiredText) return;
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
      setConfirmText('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete all clients');
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
            <h2 className="font-inter font-bold text-gray-900 text-lg">Delete ALL Clients</h2>
          </div>
          <button onClick={handleClose} disabled={deleting} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          <p className="font-inter text-sm text-red-800">
            This will <strong>permanently delete all {totalCount} client accounts</strong> and all associated data:
          </p>
          <ul className="font-inter text-xs text-red-700 list-disc list-inside space-y-0.5">
            <li>Auth accounts</li>
            <li>Client profiles &amp; intake responses</li>
            <li>Generated briefs &amp; documents</li>
            <li>Messages &amp; conversations</li>
            <li>Stripe customers, orders &amp; subscriptions</li>
            <li>Services purchased</li>
            <li>Storage files</li>
          </ul>
          <p className="font-inter text-xs text-red-700 mt-2 font-medium">
            This action cannot be undone. Use this only to start fresh.
          </p>
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-gray-700 mb-1.5">
            Type <span className="font-mono font-bold text-red-600">{requiredText}</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Type ${requiredText}`}
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
            disabled={confirmText !== requiredText || deleting || totalCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-inter text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {deleting ? 'Deleting All...' : `Delete All ${totalCount} Clients`}
          </button>
        </div>
      </div>
    </div>
  );
}
