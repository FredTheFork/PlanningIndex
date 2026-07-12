import { supabase } from '@/lib/supabase/client';

export interface LogActivityParams {
  adminId: string;
  adminEmail: string;
  clientId?: string;
  actionType: string;
  actionLabel: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget audit log writer. Never throws — audit logging must not
 * block or break the primary admin operation.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await supabase.from('admin_activity_log').insert({
      admin_id: params.adminId,
      admin_email: params.adminEmail,
      client_id: params.clientId ?? null,
      action_type: params.actionType,
      action_label: params.actionLabel,
      metadata: params.metadata ?? {},
    });
  } catch {
    // Silently catch — audit logging is best-effort
  }
}

export interface ActivityLogEntry {
  id: string;
  admin_id: string;
  admin_email: string;
  client_id: string | null;
  action_type: string;
  action_label: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function fetchActivityLog(clientId: string, limit = 50): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from('admin_activity_log')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as ActivityLogEntry[];
}
