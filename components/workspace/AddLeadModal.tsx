'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { useLeads } from '@/components/workspace/LeadsContext';
import { useAuth } from '@/hooks/useAuth';
import type { SearchApplication } from '@/lib/mock/applications';
import type { FollowUpType } from '@/lib/mock/leads';

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  application?: SearchApplication | null;
}

export function AddLeadModal({ open, onClose, application }: AddLeadModalProps) {
  const { addLead } = useLeads();
  const { user } = useAuth();
  const { toast } = useToast();

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [notes, setNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [nextFollowUpType, setNextFollowUpType] = useState<FollowUpType | ''>('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setEstimatedValue(application?.estimatedValue || '');
      setNotes('');
      setNextFollowUp('');
      setNextFollowUpType('');
      setAssignedTo(user?.email?.split('@')[0]?.split(/[.\s_-]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || '');
      setError('');
    }
  }, [open, application, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contactName.trim()) {
      setError('Please enter a contact name.');
      return;
    }

    if (!application) {
      setError('No application selected.');
      return;
    }

    addLead({
      propertyAddress: application.address,
      propertyPostcode: application.postcode,
      applicationId: application.id,
      applicationReference: application.reference,
      applicationTitle: application.title,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      status: 'New',
      notes: notes.trim(),
      nextFollowUp: nextFollowUp || null,
      nextFollowUpType: nextFollowUpType || null,
      assignedTo: assignedTo.trim() || 'Unassigned',
      estimatedValue: estimatedValue || application.estimatedValue,
      lat: application.lat,
      lng: application.lng,
    });

    toast({ variant: 'success', title: 'Lead added', message: `${application.title} has been added to your leads.` });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add to Leads"
      description={application ? `${application.address}, ${application.postcode}` : 'Create a new lead'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Lead</Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-danger-200 bg-danger-50 p-3">
          <p className="font-sans text-sm text-danger-700">{error}</p>
        </div>
      )}

      {application && (
        <div className="mb-5 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <p className="font-sans text-sm font-semibold text-primary-900">{application.title}</p>
          <p className="font-mono text-xs text-primary-400 mt-0.5">{application.reference}</p>
          <p className="font-sans text-xs text-primary-500 mt-1">{application.address}, {application.postcode}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact name"
            name="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="John Smith"
            required
            autoFocus
          />
          <Input
            label="Contact phone"
            name="contactPhone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="07700 900000"
          />
        </div>

        <Input
          label="Contact email"
          type="email"
          name="contactEmail"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="contact@example.com"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Estimated value"
            name="estimatedValue"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            placeholder="£5,000"
          />
          <Input
            label="Assigned to"
            name="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Next follow-up date"
            type="date"
            name="nextFollowUp"
            value={nextFollowUp}
            onChange={(e) => setNextFollowUp(e.target.value)}
          />
          <Select
            label="Follow-up type"
            name="nextFollowUpType"
            value={nextFollowUpType}
            onChange={(e) => setNextFollowUpType(e.target.value as FollowUpType | '')}
          >
            <option value="">Select type</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Visit">Visit</option>
            <option value="Proposal">Proposal</option>
          </Select>
        </div>

        <Textarea
          label="Notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this lead..."
          rows={3}
        />
      </form>
    </Modal>
  );
}
