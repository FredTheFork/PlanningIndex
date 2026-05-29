'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  StickyNote, Plus, Clock, User, AlertTriangle, CheckCircle2,
  MessageSquare, DollarSign, FileText, Send, Tag, Calendar
} from 'lucide-react';

interface NotesTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

interface ActivityEvent {
  id: string;
  type: 'intake' | 'brief' | 'document' | 'delivery' | 'note' | 'payment' | 'contact';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export default function NotesTab({ userId, data, refreshData }: NotesTabProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('general');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildActivityTimeline();
  }, [userId, data]);

  const buildActivityTimeline = async () => {
    setLoading(true);
    const events: ActivityEvent[] = [];

    // Intake submission
    if (data.intakeMetadata?.submitted_at) {
      events.push({
        id: 'intake-submitted',
        type: 'intake',
        title: 'Intake Form Submitted',
        description: 'Client completed their intake questionnaire',
        timestamp: data.intakeMetadata.submitted_at,
      });
    }

    // Brief events
    const { data: brief } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId)
      .maybeSingle();

    if (brief) {
      events.push({
        id: 'brief-created',
        type: 'brief',
        title: 'Master Brief Created',
        description: brief.status === 'completed' ? 'AI-generated client brief' : `Brief ${brief.status}`,
        timestamp: brief.created_at,
        metadata: { status: brief.status, risk_level: brief.risk_level },
      });

      if (brief.generated_at) {
        events.push({
          id: 'brief-generated',
          type: 'brief',
          title: 'Brief Generated',
          description: `Generated using ${brief.model_used || 'AI'}`,
          timestamp: brief.generated_at,
          metadata: { model: brief.model_used },
        });
      }
    }

    // Document events
    const { data: documents } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (documents) {
      documents.forEach(doc => {
        events.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: `${doc.document_label} Generated`,
          description: `Status: ${doc.status}`,
          timestamp: doc.generated_at || doc.created_at,
          metadata: { status: doc.status },
        });

        if (doc.delivered_at) {
          events.push({
            id: `doc-delivered-${doc.id}`,
            type: 'delivery',
            title: `${doc.document_label} Delivered`,
            description: 'Marked as delivered to client',
            timestamp: doc.delivered_at,
          });
        }
      });
    }

    // Payment events
    const { data: orders } = await supabase
      .from('stripe_orders')
      .select('*')
      .eq('customer_id', userId);

    if (orders) {
      orders.forEach(order => {
        events.push({
          id: `order-${order.id}`,
          type: 'payment',
          title: 'Payment Received',
          description: `Order of £${(order.amount_total / 100).toFixed(2)}`,
          timestamp: order.created_at,
          metadata: { amount: order.amount_total, status: order.payment_status },
        });
      });
    }

    // Contact messages
    const { data: messages } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('email', data.email)
      .order('created_at', { ascending: false });

    if (messages) {
      messages.forEach(msg => {
        events.push({
          id: `msg-${msg.id}`,
          type: 'contact',
          title: 'Contact Message',
          description: msg.subject,
          timestamp: msg.created_at,
        });
      });
    }

    // Sort by timestamp descending
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setActivities(events);
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSaving(true);

    try {
      // For now, we'll use the admin_notes field in client_profiles
      // In a real app, you'd have a separate notes table
      const existingNotes = data.profile?.admin_notes || '';
      const timestamp = new Date().toISOString();
      const noteText = `[${timestamp}] [${noteCategory.toUpperCase()}] ${newNote}\n\n`;

      const { error } = await supabase
        .from('client_profiles')
        .update({
          admin_notes: existingNotes + noteText,
        })
        .eq('user_id', userId);

      if (!error) {
        setNewNote('');
        refreshData();

        // Add to activities
        const newActivity: ActivityEvent = {
          id: `note-${Date.now()}`,
          type: 'note',
          title: 'Admin Note Added',
          description: newNote.substring(0, 100) + (newNote.length > 100 ? '...' : ''),
          timestamp: timestamp,
          metadata: { category: noteCategory },
        };
        setActivities(prev => [newActivity, ...prev]);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'intake': return FileText;
      case 'brief': return StickyNote;
      case 'document': return FileText;
      case 'delivery': return Send;
      case 'payment': return DollarSign;
      case 'contact': return MessageSquare;
      case 'note': return StickyNote;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'intake': return 'text-blue-600 bg-blue-100';
      case 'brief': return 'text-purple-600 bg-purple-100';
      case 'document': return 'text-green-600 bg-green-100';
      case 'delivery': return 'text-amber-600 bg-amber-100';
      case 'payment': return 'text-emerald-600 bg-emerald-100';
      case 'contact': return 'text-gray-600 bg-gray-100';
      case 'note': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const existingNotes = data.profile?.admin_notes || '';

  return (
    <div className="space-y-6">
      {/* Add Note */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Add Admin Note
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-2">Category</label>
            <select
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm font-inter bg-white focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4]"
            >
              <option value="general">General</option>
              <option value="urgent">Urgent</option>
              <option value="payment">Payment Issue</option>
              <option value="technical">Technical</option>
              <option value="followup">Follow-up Required</option>
            </select>
          </div>
          <div>
            <label className="block font-inter text-gray-700 text-xs mb-2">Note</label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              placeholder="Add a note about this client..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-[#2C68C4]"
            />
          </div>
          <button
            onClick={handleAddNote}
            disabled={saving || !newNote.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Note
              </>
            )}
          </button>
        </div>
      </div>

      {/* Existing Admin Notes */}
      {existingNotes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
            Admin Notes History
          </h3>
          <div className="bg-[#FAFBFC] rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
            <pre className="font-inter text-gray-700 text-sm whitespace-pre-wrap">
              {existingNotes}
            </pre>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Activity Timeline
        </h3>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="font-inter text-gray-600 text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200" />

            {/* Events */}
            <div className="space-y-4">
              {activities.map((event, i) => {
                const Icon = getActivityIcon(event.type);
                const colorClass = getActivityColor(event.type);

                return (
                  <div key={event.id} className="relative flex gap-4 pl-10">
                    {/* Icon */}
                    <div className={`absolute left-0 top-0 rounded-full p-1.5 ${colorClass}`}>
                      <Icon size={14} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-[#FAFBFC] rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-inter font-semibold text-gray-900 text-sm">
                          {event.title}
                        </h4>
                        <p className="font-inter text-gray-500 text-xs">
                          {new Date(event.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="font-inter text-gray-600 text-xs">
                        {event.description}
                      </p>
                      {event.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            value && (
                              <span key={key} className="inline-flex items-center px-2 py-0.5 bg-white rounded text-xs font-inter text-gray-600 border border-gray-200">
                                {key}: {String(value)}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
