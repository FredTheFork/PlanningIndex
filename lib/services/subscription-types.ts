// Type definitions for subscription and refresh job workflows
// Used by SubscriptionTab and related components

import { CarePlanTier } from './service-catalog-types';

/**
 * Subscription record from services_purchased table.
 * Represents an active or past subscription for a client.
 */
export interface SubscriptionRecord {
  id: string;
  service_id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  purchased_at: string;
  expires_at: string | null;
  stripe_subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  next_billing_date: string | null;
  subscription_period_start: string | null;
  subscription_period_end: string | null;
  created_at: string;
}

/**
 * Document refresh job record from document_refresh_jobs table.
 * Tracks the status of refresh operations requested by admin.
 */
export interface RefreshJob {
  id: string;
  client_id: string;
  subscription_id: string | null;
  service_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  document_types: string[];
  documents_completed: string[];
  documents_failed: string[];
  update_instructions: string;
  client_notes: string | null;
  admin_notes: string | null;
  admin_id: string | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

/**
 * Payload sent to initiate-document-refresh edge function.
 */
export interface RefreshJobPayload {
  clientId: string;
  subscriptionId: string | null;
  serviceId: string;
  documentTypes: string[];
  updateInstructions: string;
  clientNotes?: string;
  adminNotes?: string;
}

/**
 * Response from initiate-document-refresh edge function.
 */
export interface RefreshJobResponse {
  success: boolean;
  jobId: string;
  status: RefreshJob['status'];
  documentsCompleted: string[];
  documentsFailed: string[];
  errorMessage?: string;
}

/**
 * Care plan tier with detected subscription information.
 * Combines catalog tier data with client's subscription context.
 */
export interface DetectedTier {
  tier: CarePlanTier | null;
  subscriptionRecord: SubscriptionRecord | null;
  capabilities: {
    hasMonthlyUpdates: boolean;
    hasPrioritySupport: boolean;
    hasNewDocuments: boolean;
    hasSocialMediaRefresh: boolean;
    hasWebsiteRefresh: boolean;
  };
}

/**
 * Subscription status display configuration.
 * Maps status values to colors and labels.
 */
export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionRecord['status'],
  { label: string; color: string; bgColor: string; textColor: string }
> = {
  active: {
    label: 'Active',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  expired: {
    label: 'Expired',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    color: 'gray',
  },
  past_due: {
    label: 'Past Due',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
  },
};

/**
 * Refresh job status display configuration.
 * Maps status values to colors and labels.
 */
export const REFRESH_JOB_STATUS_CONFIG: Record<
  RefreshJob['status'],
  { label: string; bgColor: string; textColor: string }
> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
  in_progress: {
    label: 'In Progress',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  completed: {
    label: 'Completed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  failed: {
    label: 'Failed',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
};
