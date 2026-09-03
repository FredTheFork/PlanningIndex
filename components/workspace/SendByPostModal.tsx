'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Mail, ArrowRight, ArrowLeft, Check, MapPin } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useToast } from '@/components/ui/Toast';
import { ProposalDocumentPreview } from '@/components/workspace/ProposalDocumentPreview';
import { useProposals } from '@/components/workspace/ProposalsContext';
import type { Proposal } from '@/lib/mock/proposals';

interface SendByPostModalProps {
  open: boolean;
  onClose: () => void;
  proposal: Proposal;
}

const stepLabels = ['Finalise', 'Preview', 'Address', 'Send', 'Done'];

export function SendByPostModal({ open, onClose, proposal }: SendByPostModalProps) {
  const [step, setStep] = useState(0);
  const [recipientName, setRecipientName] = useState(proposal.recipientName);
  const [recipientAddress, setRecipientAddress] = useState(proposal.recipientAddress);
  const [recipientPostcode, setRecipientPostcode] = useState(proposal.recipientPostcode);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const { updateProposalStatus } = useProposals();
  const { toast } = useToast();
  const router = useRouter();

  const handleReset = () => {
    setStep(0);
    setRecipientName(proposal.recipientName);
    setRecipientAddress(proposal.recipientAddress);
    setRecipientPostcode(proposal.recipientPostcode);
    setConfirmed(false);
    setSending(false);
    setTrackingNumber(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const checklist = [
    { label: 'Recipient confirmed', done: Boolean(proposal.recipientName) },
    { label: 'Delivery address confirmed', done: Boolean(proposal.recipientAddress) },
    { label: 'All sections complete', done: proposal.sections.every(s => s.content || (s.lineItems && s.lineItems.length > 0)) },
    { label: 'Pricing total confirmed', done: proposal.totalValue !== '\u00A30' },
  ];

  const allDone = checklist.every(c => c.done);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      updateProposalStatus(proposal.id, 'Sent');
      const trk = `RM-TRK-${Math.floor(Math.random() * 900000 + 100000)}`;
      setTrackingNumber(trk);
      setSending(false);
      setStep(4);
      toast({ variant: 'success', title: 'Proposal sent by post', message: `${proposal.reference} has been sent to ${recipientAddress}.` });
    }, 1500);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="xl"
      footer={
        step < 4 ? (
          <div className="flex items-center justify-between w-full">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              {step === 0 && (
                <Button onClick={() => setStep(1)} disabled={!allDone} rightIcon={<ArrowRight size={16} />}>
                  Continue to Preview
                </Button>
              )}
              {step === 1 && (
                <Button onClick={() => setStep(2)} rightIcon={<ArrowRight size={16} />}>
                  Continue to Address
                </Button>
              )}
              {step === 2 && (
                <Button onClick={() => setStep(3)} disabled={!confirmed} rightIcon={<ArrowRight size={16} />}>
                  Continue to Send
                </Button>
              )}
              {step === 3 && (
                <Button variant="secondary" onClick={handleSend} loading={sending} leftIcon={!sending ? <Mail size={16} /> : undefined}>
                  Send by Post
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => { handleClose(); router.push('/app/proposals'); }}>
              Back to Proposals
            </Button>
            <Button onClick={() => { handleClose(); router.push('/app/leads'); }}>
              View Lead
            </Button>
          </div>
        )
      }
    >
      <div className="flex items-center justify-between mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-accent-600' : 'text-primary-300'}`}>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i < step ? 'bg-accent-600 text-white' : i === step ? 'bg-accent-100 text-accent-700 border-2 border-accent-500' : 'bg-primary-100 text-primary-400'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="font-sans text-xs font-medium hidden sm:block">{label}</span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-accent-500' : 'bg-primary-200'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 className="font-sans font-semibold text-primary-900 text-lg mb-2">Finalise Document</h2>
          <p className="font-sans text-sm text-primary-500 mb-6">Review the checklist below before sending your proposal by post.</p>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.label} className={`flex items-center gap-3 rounded-lg border p-3 ${item.done ? 'border-success-200 bg-success-50' : 'border-danger-200 bg-danger-50'}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${item.done ? 'bg-success-600' : 'bg-danger-500'} text-white shrink-0`}>
                  {item.done ? <Check size={14} /> : <span className="text-xs">!</span>}
                </div>
                <span className={`font-sans text-sm font-medium ${item.done ? 'text-success-800' : 'text-danger-700'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {!allDone && (
            <p className="font-sans text-xs text-danger-600 mt-4">Please complete all sections before sending.</p>
          )}
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-sans font-semibold text-primary-900 text-lg mb-2">Preview Document</h2>
          <p className="font-sans text-sm text-primary-500 mb-4">This is exactly how your proposal will be printed and mailed.</p>
          <div className="max-h-[400px] overflow-y-auto">
            <ProposalDocumentPreview proposal={proposal} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-sans font-semibold text-primary-900 text-lg mb-2">Confirm Recipient & Address</h2>
          <p className="font-sans text-sm text-primary-500 mb-6">Verify the delivery details are correct before sending.</p>
          <div className="space-y-4 max-w-md">
            <Input label="Recipient name" name="recipientName" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
            <Input label="Delivery address" name="recipientAddress" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
            <Input label="Postcode" name="recipientPostcode" value={recipientPostcode} onChange={(e) => setRecipientPostcode(e.target.value)} />
            <div className="flex items-start gap-2 pt-2">
              <MapPin size={16} className="text-primary-400 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-primary-500">The proposal will be posted to this address. Make sure it is correct — you cannot change it after sending.</p>
            </div>
            <Checkbox
              label="I confirm the recipient name and delivery address are correct"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 mx-auto mb-6">
            <Mail size={32} className="text-accent-600" />
          </div>
          <h2 className="font-sans font-semibold text-primary-900 text-lg mb-3">Ready to Send by Post</h2>
          <p className="font-sans text-sm text-primary-500 max-w-md mx-auto mb-6">
            Your proposal will be printed, enveloped, and posted by first class to:
          </p>
          <div className="inline-block text-left rounded-xl border border-primary-200 bg-primary-50 p-4 mb-6">
            <p className="font-sans font-semibold text-primary-900 text-sm">{recipientName}</p>
            <p className="font-sans text-sm text-primary-600">{recipientAddress}</p>
            <p className="font-sans text-sm text-primary-600">{recipientPostcode}</p>
          </div>
          <p className="font-sans text-xs text-primary-400">Expected delivery: 2-3 working days</p>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100 mx-auto mb-6">
            <CheckCircle2 size={32} className="text-success-600" />
          </div>
          <h2 className="font-sans font-semibold text-primary-900 text-lg mb-2">Proposal Sent!</h2>
          <p className="font-sans text-sm text-primary-500 max-w-md mx-auto mb-4">
            Your proposal {proposal.reference} has been sent by post to {recipientName} at {recipientAddress}, {recipientPostcode}.
          </p>
          {trackingNumber && (
            <div className="inline-block rounded-lg border border-primary-200 bg-white px-4 py-2 mb-4">
              <p className="font-sans text-xs text-primary-400">Tracking number</p>
              <p className="font-mono text-sm font-semibold text-primary-900">{trackingNumber}</p>
            </div>
          )}
          <p className="font-sans text-xs text-primary-400">Expected delivery: 2-3 working days</p>
        </div>
      )}
    </Modal>
  );
}
