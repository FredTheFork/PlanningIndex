'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { FileText, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function PersonalIntake() {
  const { user } = useAuth();
  const { profile, loading } = useClientProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!profile) return null;

  // If already submitted, show completed state
  if (profile.has_submitted_intake) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
            Intake Form
          </h1>
          <p className="font-inter text-gray-600 text-sm">
            Your intake form has been submitted successfully.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-lg p-3 shrink-0">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
                Form Submitted
              </h2>
              <p className="font-inter text-gray-600 text-sm mb-4">
                Your intake form was submitted on{' '}
                {profile.intake_submitted_at
                  ? new Date(profile.intake_submitted_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'an unknown date'}
                . We're now preparing your bespoke business documents.
              </p>
              <Link
                href="/personal/status"
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                View Status
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder for intake form
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Intake Form
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Tell us about your business so we can create your bespoke documents.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-[#FAFBFC] rounded-lg p-3 shrink-0">
            <FileText size={24} className="text-[#1B3F7A]" />
          </div>
          <div>
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
              Business Information Form
            </h2>
            <p className="font-inter text-gray-600 text-sm">
              This form collects the information we need to personalize your business documents.
              We'll ask about your business name, services, clients, and branding preferences.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="font-inter text-gray-700 text-sm mb-6">
            The intake form is currently being updated to provide you with a better experience.
            In the meantime, please contact us at{' '}
            <a href="mailto:hello@foundationary.co.uk" className="text-[#2C68C4] hover:underline font-semibold">
              hello@foundationary.co.uk
            </a>{' '}
            to complete your intake form, and we'll prepare your documents right away.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-inter text-blue-900 text-sm">
              <strong>What to include in your email:</strong>
            </p>
            <ul className="mt-2 space-y-1 font-inter text-blue-800 text-sm">
              <li>Your business name (or your name if trading under your own name)</li>
              <li>The services you provide</li>
              <li>The types of clients you work with</li>
              <li>Any specific terms or clauses you need in your contract</li>
              <li>Your contact details for the documents</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Clock className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-inter font-semibold text-amber-900 text-sm mb-1">
              24-Hour Delivery Timer
            </p>
            <p className="font-inter text-amber-700 text-xs">
              Once we receive your information, the 24-hour countdown begins. You'll receive an email
              when your documents are ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
