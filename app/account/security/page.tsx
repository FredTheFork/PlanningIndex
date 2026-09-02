'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button, Input, Alert } from '@/components/ui';

export default function SecurityPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email || '');
      }
    });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutAll = async () => {
    await supabase.auth.signOut({ scope: 'global' });
    router.push('/login');
  };

  return (
    <div>
      <h2 className="font-sans font-semibold text-primary-900 text-lg mb-1">
        Security
      </h2>
      <p className="font-sans text-primary-500 text-sm mb-6">
        Change your password and manage your sessions.
      </p>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">Your password has been changed.</Alert>}

      <div className="max-w-md space-y-6">
        <div>
          <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">
            Account email
          </h3>
          <Input
            label="Email address"
            value={email}
            disabled
          />
        </div>

        <div>
          <h3 className="font-sans font-semibold text-primary-900 text-sm mb-4">
            Change password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="New password"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary-400 hover:text-primary-900 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
            <Button type="submit" loading={saving} rightIcon={!saving ? <ArrowRight size={16} /> : undefined}>
              Update Password
            </Button>
          </form>
        </div>

        <div className="pt-6 border-t border-primary-200">
          <h3 className="font-sans font-semibold text-primary-900 text-sm mb-2">
            Sign out all devices
          </h3>
          <p className="font-sans text-sm text-primary-500 mb-4">
            Sign out of your account on every device, including this one.
          </p>
          <Button variant="danger" onClick={handleSignOutAll}>
            Sign Out Everywhere
          </Button>
        </div>
      </div>
    </div>
  );
}
