'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/lib/api/client';
import { Button, Input, Alert } from '@/components/ui';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      if (profile) {
        setFullName(profile.fullName || '');
        setPhone(profile.phone || '');
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
      const updated = await updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
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
        Profile
      </h2>
      <p className="font-sans text-primary-500 text-sm mb-6">
        Update your personal details.
      </p>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">Your profile has been updated.</Alert>}

      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <Input
          label="Full name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />
        <Input
          label="Phone number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your phone number"
        />
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
