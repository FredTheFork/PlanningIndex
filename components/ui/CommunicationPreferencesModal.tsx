'use client';

import { useState } from 'react';
import { Bell, MessageSquare, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface CommunicationPreferencesModalProps {
  userId: string;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommunicationPreferencesModal({
  userId,
  userEmail,
  isOpen,
  onClose,
}: CommunicationPreferencesModalProps) {
  const [step, setStep] = useState<'preferences' | 'phone' | 'complete'>('preferences');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validatePhoneNumber = (phone: string): boolean => {
    // E.164 format: +1234567890 (1-15 digits with +)
    const e164Regex = /^\+?[1-9]\d{1,14}$/;
    return e164Regex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 0) return '';

    if (!cleaned.startsWith('1') && cleaned.length === 10) {
      return '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '+' + cleaned;
    }

    return '+' + cleaned;
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError('');
  };

  const handleContinueFromPreferences = () => {
    if (pushNotifications) {
      setStep('phone');
    } else {
      handleSave('preferences');
    }
  };

  const handleSave = async (fromStep: string) => {
    setSaving(true);
    setError('');

    try {
      const formattedPhone = phoneNumber ? formatPhoneNumber(phoneNumber) : null;

      if (phoneNumber && !validatePhoneNumber(formattedPhone || '')) {
        setPhoneError('Please enter a valid phone number');
        setSaving(false);
        return;
      }

      const { error: prefError } = await supabase
        .from('client_communication_preferences')
        .upsert(
          {
            user_id: userId,
            email_notifications_enabled: emailNotifications,
            push_notifications_enabled: pushNotifications,
            phone_number: formattedPhone,
            consent_timestamp: new Date().toISOString(),
            consent_version: '1.0',
          },
          { onConflict: 'user_id' }
        );

      if (prefError) {
        setError('Failed to save preferences');
        console.error('Error saving preferences:', prefError);
        setSaving(false);
        return;
      }

      setStep('complete');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-blue-50 rounded-lg p-2 mt-1">
              {step === 'complete' ? (
                <CheckCircle2 size={24} className="text-success" />
              ) : (
                <MessageSquare size={24} className="text-medium-blue" />
              )}
            </div>
            <div>
              <h2 className="font-inter font-bold text-navy text-lg">
                {step === 'complete' ? 'All Set!' : 'Stay Connected'}
              </h2>
              <p className="font-inter text-secondary-text text-sm">
                {step === 'complete'
                  ? 'Your preferences have been saved.'
                  : "We'll use these to keep you updated on your documents."}
              </p>
            </div>
          </div>
          {step !== 'complete' && (
            <button
              onClick={onClose}
              className="text-secondary-text hover:text-navy transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="font-inter text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Preferences Step */}
        {step === 'preferences' && (
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="font-inter font-medium text-navy text-sm">Email notifications</p>
                <p className="font-inter text-secondary-text text-xs">
                  Get updates about your documents and clarification requests
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <div className="flex-1">
                <p className="font-inter font-medium text-navy text-sm">Browser notifications</p>
                <p className="font-inter text-secondary-text text-xs">
                  Get instant alerts when we message you
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Phone Step */}
        {step === 'phone' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-inter font-medium text-navy text-sm mb-2">
                Phone number (optional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue font-inter text-sm ${
                  phoneError ? 'border-danger' : 'border-gray-300'
                }`}
              />
              {phoneError && (
                <p className="font-inter text-xs text-danger mt-1">{phoneError}</p>
              )}
              <p className="font-inter text-secondary-text text-xs mt-2">
                We'll send you SMS updates about document clarifications (when we need more info).
              </p>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-success/10 rounded-full p-1">
                <CheckCircle2 size={16} className="text-success" />
              </div>
              <p className="font-inter text-sm text-navy">Email notifications enabled</p>
            </div>
            {pushNotifications && (
              <div className="flex items-center gap-2">
                <div className="bg-success/10 rounded-full p-1">
                  <CheckCircle2 size={16} className="text-success" />
                </div>
                <p className="font-inter text-sm text-navy">Browser notifications enabled</p>
              </div>
            )}
            {phoneNumber && (
              <div className="flex items-center gap-2">
                <div className="bg-success/10 rounded-full p-1">
                  <CheckCircle2 size={16} className="text-success" />
                </div>
                <p className="font-inter text-sm text-navy">Phone number saved</p>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {step === 'preferences' && (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md font-inter font-medium text-sm text-navy hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleContinueFromPreferences}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-navy rounded-md font-inter font-medium text-sm text-white hover:bg-medium-blue transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </>
          )}

          {step === 'phone' && (
            <>
              <button
                onClick={() => setStep('preferences')}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md font-inter font-medium text-sm text-navy hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleSave('phone')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-navy rounded-md font-inter font-medium text-sm text-white hover:bg-medium-blue transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}

          {step === 'complete' && (
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-navy rounded-md font-inter font-medium text-sm text-white hover:bg-medium-blue transition-colors"
            >
              Continue to Your Account
            </button>
          )}
        </div>

        <p className="font-inter text-secondary-text text-xs text-center mt-4">
          You can update these preferences anytime in your account settings.
        </p>
      </div>
    </div>
  );
}
