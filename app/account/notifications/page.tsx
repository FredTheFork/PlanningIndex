'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/lib/api/client';
import { Button, Toggle, Alert } from '@/components/ui';

export default function NotificationsPage() {
  const [notifNewApps, setNotifNewApps] = useState(true);
  const [notifLeadUpdates, setNotifLeadUpdates] = useState(true);
  const [notifProposalStatus, setNotifProposalStatus] = useState(true);
  const [notifFollowUpReminders, setNotifFollowUpReminders] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      if (profile) {
        setNotifNewApps(profile.notifNewApplications ?? true);
        setNotifLeadUpdates(profile.notifLeadUpdates ?? true);
        setNotifProposalStatus(profile.notifProposalStatus ?? true);
        setNotifFollowUpReminders(profile.notifFollowUpReminders ?? true);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updated = await updateProfile({
        notifNewApplications: notifNewApps,
        notifLeadUpdates: notifLeadUpdates,
        notifProposalStatus: notifProposalStatus,
        notifFollowUpReminders: notifFollowUpReminders,
      });

      if (!updated) {
        setError('Failed to save. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-sans font-semibold text-primary-900 text-lg mb-1">
        Notifications
      </h2>
      <p className="font-sans text-primary-500 text-sm mb-6">
        Choose which updates you want to receive.
      </p>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">Notification preferences updated.</Alert>}

      <form onSubmit={handleSave} className="max-w-md space-y-6">
        <div className="space-y-5">
          <Toggle
            checked={notifNewApps}
            onChange={setNotifNewApps}
            label="New applications"
            description="Get notified when new planning applications match your saved searches."
          />
          <Toggle
            checked={notifLeadUpdates}
            onChange={setNotifLeadUpdates}
            label="Lead updates"
            description="Get notified when leads are added, updated, or change status."
          />
          <Toggle
            checked={notifProposalStatus}
            onChange={setNotifProposalStatus}
            label="Proposal status"
            description="Get notified when proposals are sent, mailed, or delivered."
          />
          <Toggle
            checked={notifFollowUpReminders}
            onChange={setNotifFollowUpReminders}
            label="Follow-up reminders"
            description="Get reminders for upcoming follow-ups on your leads."
          />
        </div>

        <Button type="submit" loading={saving}>
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
