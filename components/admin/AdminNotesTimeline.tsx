'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { StickyNote, Pin, Trash2, CreditCard as Edit3, X, Check, Clock } from 'lucide-react';

export interface NoteEntry {
  id: string;
  client_id: string;
  admin_id: string;
  admin_email: string;
  note_text: string;
  category: 'general' | 'billing' | 'intake' | 'delivery' | 'issue' | 'resolved';
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  general: { label: 'General', bg: 'bg-gray-100', text: 'text-gray-700' },
  billing: { label: 'Billing', bg: 'bg-blue-50', text: 'text-blue-700' },
  intake: { label: 'Intake', bg: 'bg-amber-50', text: 'text-amber-700' },
  delivery: { label: 'Delivery', bg: 'bg-green-50', text: 'text-green-700' },
  issue: { label: 'Issue', bg: 'bg-red-50', text: 'text-red-700' },
  resolved: { label: 'Resolved', bg: 'bg-teal-50', text: 'text-teal-700' },
};

function getInitials(email: string): string {
  if (!email) return '?';
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AdminNotesTimeline({
  clientId,
  adminId,
  adminEmail,
  showToast,
}: {
  clientId: string;
  adminId: string;
  adminEmail: string;
  showToast: (params: { message: string; type: 'success' | 'error' | 'info' | 'warning' }) => void;
}) {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<NoteEntry['category']>('general');
  const [newNotePinned, setNewNotePinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('admin_notes_entries')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      showToast({ message: 'Failed to load notes.', type: 'error' });
      setNotes([]);
    } else {
      setNotes((data as NoteEntry[]) || []);
    }
    setLoading(false);
  }, [clientId, showToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('admin_notes_entries')
      .insert({
        client_id: clientId,
        admin_id: adminId,
        admin_email: adminEmail,
        note_text: newNoteText.trim(),
        category: newNoteCategory,
        is_pinned: newNotePinned,
      })
      .select('*')
      .single();

    if (error) {
      showToast({ message: 'Failed to save note.', type: 'error' });
    } else if (data) {
      setNotes((prev) => [data as NoteEntry, ...prev]);
      setNewNoteText('');
      setNewNotePinned(false);
      setNewNoteCategory('general');
      showToast({ message: 'Note added.', type: 'success' });
    }
    setSaving(false);
  };

  const handleEditNote = async (noteId: string) => {
    if (!editingText.trim()) return;
    const { error } = await supabase
      .from('admin_notes_entries')
      .update({ note_text: editingText.trim(), updated_at: new Date().toISOString() })
      .eq('id', noteId);

    if (error) {
      showToast({ message: 'Failed to update note.', type: 'error' });
    } else {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, note_text: editingText.trim(), updated_at: new Date().toISOString() } : n
        )
      );
      setEditingId(null);
      setEditingText('');
      showToast({ message: 'Note updated.', type: 'success' });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('admin_notes_entries')
      .delete()
      .eq('id', noteId);

    if (error) {
      showToast({ message: 'Failed to delete note.', type: 'error' });
    } else {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setConfirmDeleteId(null);
      showToast({ message: 'Note deleted.', type: 'info' });
    }
  };

  const handleTogglePin = async (noteId: string, currentPinned: boolean) => {
    const { error } = await supabase
      .from('admin_notes_entries')
      .update({ is_pinned: !currentPinned })
      .eq('id', noteId);

    if (error) {
      showToast({ message: 'Failed to update pin.', type: 'error' });
    } else {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, is_pinned: !currentPinned } : n))
      );
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote size={18} className="text-[#1B3F7A]" />
        <h3 className="font-inter font-semibold text-gray-900 text-base">Admin Notes Timeline</h3>
        <span className="text-xs text-gray-400 font-inter">({notes.length})</span>
      </div>

      {/* Add note area */}
      <div className="mb-6 space-y-2">
        <textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          rows={3}
          placeholder="Add a note about this client..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-inter text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent resize-y"
        />
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={newNoteCategory}
            onChange={(e) => setNewNoteCategory(e.target.value as NoteEntry['category'])}
            className="px-3 py-1.5 border border-gray-300 rounded-lg font-inter text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B3F7A]"
          >
            <option value="general">General</option>
            <option value="billing">Billing</option>
            <option value="intake">Intake</option>
            <option value="delivery">Delivery</option>
            <option value="issue">Issue</option>
            <option value="resolved">Resolved</option>
          </select>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={newNotePinned}
              onChange={(e) => setNewNotePinned(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="font-inter text-xs text-gray-600">Pin this note</span>
          </label>
          <button
            onClick={handleAddNote}
            disabled={!newNoteText.trim() || saving}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-xs font-inter font-medium transition-colors"
          >
            {saving ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <StickyNote size={13} />
            )}
            Add Note
          </button>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded mb-1" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : sortedNotes.length === 0 ? (
        <div className="text-center py-8">
          <StickyNote size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="font-inter text-sm text-gray-500">No notes yet. Add the first note above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((note) => {
            const cat = CATEGORY_CONFIG[note.category] || CATEGORY_CONFIG.general;
            const isEditing = editingId === note.id;
            const isConfirmingDelete = confirmDeleteId === note.id;
            const isEdited = note.updated_at !== note.created_at;

            return (
              <div
                key={note.id}
                className={`p-3 rounded-lg border ${
                  note.is_pinned ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#1B3F7A] text-white flex items-center justify-center text-xs font-inter font-semibold shrink-0">
                    {getInitials(note.admin_email)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-inter text-xs font-medium text-gray-700">{note.admin_email}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${cat.bg} ${cat.text}`}>
                        {cat.label}
                      </span>
                      {note.is_pinned && (
                        <Pin size={11} className="text-amber-500" />
                      )}
                      <span
                        className="font-inter text-xs text-gray-400 ml-auto"
                        title={new Date(note.created_at).toLocaleString('en-GB')}
                      >
                        {getRelativeTime(note.created_at)}
                        {isEdited && ' (edited)'}
                      </span>
                    </div>

                    {/* Note text or edit input */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={3}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded font-inter text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] resize-y"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditNote(note.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
                          >
                            <Check size={12} />
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditingText(''); }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
                          >
                            <X size={12} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : isConfirmingDelete ? (
                      <div className="flex items-center gap-2 py-1">
                        <span className="font-inter text-xs text-gray-600">Delete this note?</span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-inter font-medium transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="font-inter text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {note.note_text}
                      </p>
                    )}

                    {/* Action buttons */}
                    {!isEditing && !isConfirmingDelete && (
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleTogglePin(note.id, note.is_pinned)}
                          title={note.is_pinned ? 'Unpin note' : 'Pin note'}
                          className={`p-1 rounded transition-colors ${
                            note.is_pinned ? 'text-amber-500 hover:bg-amber-100' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                          }`}
                        >
                          <Pin size={12} />
                        </button>
                        <button
                          onClick={() => { setEditingId(note.id); setEditingText(note.note_text); }}
                          title="Edit note"
                          className="p-1 text-gray-400 hover:text-[#1B3F7A] hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(note.id)}
                          title="Delete note"
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
