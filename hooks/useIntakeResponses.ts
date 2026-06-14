'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import { useClientProfile } from './useClientProfile';
import { buildIntakeForm, isIntakeFullyComplete } from '@/lib/forms/build-intake-form';
import { FormSection } from '@/lib/forms/intake-definition';
import { isSectionComplete } from '@/lib/forms/conditional-logic';

const DEFAULT_SERVICE_IDS = ['business_foundations_pack'];
const DEFAULT_FORM_SECTIONS = buildIntakeForm(DEFAULT_SERVICE_IDS);

interface IntakeData {
  id: string;
  user_id: string;
  form_version: string;
  responses: Record<string, any>;
  current_section_id: string;
  section_progress: Record<string, boolean>;
  last_saved_at: string | null;
  submitted_at: string | null;
  file_uploads: Record<string, any>;
  purchased_service_ids: string[];
  intake_complete_for_services: string[];
  last_visited_at: string | null;
  edit_requested_at: string | null;
  edit_granted_at: string | null;
}

export function useIntakeResponses() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds: profileServiceIds } = useClientProfile();
  const [data, setData] = useState<IntakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [purchasedServiceIds, setPurchasedServiceIds] = useState<string[]>(DEFAULT_SERVICE_IDS);
  const [formSections, setFormSections] = useState<FormSection[]>(DEFAULT_FORM_SECTIONS);
  const [submitting, setSubmitting] = useState(false);
  const [conflictDetected, setConflictDetected] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResponsesRef = useRef<Record<string, any> | null>(null);
  const localLastSavedRef = useRef<string | null>(null);
  const lastVerifiedIdsRef = useRef<string>('');

  // Ensure arrays are always arrays (defensive against corrupted state)
  const safeServiceIds = Array.isArray(purchasedServiceIds) && purchasedServiceIds.length > 0
    ? purchasedServiceIds
    : DEFAULT_SERVICE_IDS;
  const safeFormSections = Array.isArray(formSections) && formSections.length > 0
    ? formSections
    : DEFAULT_FORM_SECTIONS;

  // Derive purchased service IDs — verify via server-side endpoint
  useEffect(() => {
    if (!user) return;

    const profileKey = JSON.stringify(profileServiceIds);
    if (lastVerifiedIdsRef.current === profileKey && purchasedServiceIds.length > 0) return;

    const verifyServices = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          const fallback = Array.isArray(profileServiceIds) && profileServiceIds.length > 0
            ? profileServiceIds
            : DEFAULT_SERVICE_IDS;
          setPurchasedServiceIds(fallback);
          lastVerifiedIdsRef.current = JSON.stringify(fallback);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/intake-auth`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const result = await res.json();
          const serverIds: unknown = result.purchased_service_ids;
          if (Array.isArray(serverIds) && serverIds.length > 0) {
            setPurchasedServiceIds(serverIds);
            lastVerifiedIdsRef.current = JSON.stringify(serverIds);
            return;
          }
        }
      } catch (err) {
        console.error('Server-side service verification failed, falling back to profile:', err);
      }

      const fallback = Array.isArray(profileServiceIds) && profileServiceIds.length > 0
        ? profileServiceIds
        : DEFAULT_SERVICE_IDS;
      setPurchasedServiceIds(fallback);
      lastVerifiedIdsRef.current = JSON.stringify(fallback);
    };

    verifyServices();
  }, [user, profileServiceIds]);

  // Build form sections when service IDs change
  useEffect(() => {
    const ids = Array.isArray(purchasedServiceIds) && purchasedServiceIds.length > 0
      ? purchasedServiceIds
      : DEFAULT_SERVICE_IDS;
    const sections = buildIntakeForm(ids);
    setFormSections(Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_FORM_SECTIONS);
  }, [purchasedServiceIds]);

  // Fetch existing intake data
  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      return;
    }

    const fetchData = async () => {
      const { data: row, error } = await supabase
        .from('intake_responses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching intake responses:', error);
        setLoading(false);
        return;
      }

      if (row) {
        const rowPsi = Array.isArray(row.purchased_service_ids) ? row.purchased_service_ids : [];
        const rowIcf = Array.isArray(row.intake_complete_for_services) ? row.intake_complete_for_services : [];
        const rowSp = row.section_progress && typeof row.section_progress === 'object' ? row.section_progress : {};
        const rowResp = row.responses && typeof row.responses === 'object' ? row.responses : {};

        setData({
          id: row.id,
          user_id: row.user_id,
          form_version: row.form_version || 'v4',
          responses: rowResp,
          current_section_id: row.current_section_id || 'intro',
          section_progress: rowSp,
          last_saved_at: row.last_saved_at,
          submitted_at: row.submitted_at,
          file_uploads: row.file_uploads || {},
          purchased_service_ids: rowPsi,
          intake_complete_for_services: rowIcf,
          last_visited_at: row.last_visited_at,
          edit_requested_at: row.edit_requested_at || null,
          edit_granted_at: row.edit_granted_at || null,
        });
        setLastSaved(row.last_saved_at ? new Date(row.last_saved_at) : null);
        localLastSavedRef.current = row.last_saved_at;

        // If row has purchased_service_ids, prefer those over derived ones
        if (rowPsi.length > 0) {
          setPurchasedServiceIds(rowPsi);
        }
      } else {
        // Initialize with defaults for new users so navigation works
        setData({
          id: '',
          user_id: user.id,
          form_version: 'v4',
          responses: {},
          current_section_id: 'intro',
          section_progress: {},
          last_saved_at: null,
          submitted_at: null,
          file_uploads: {},
          purchased_service_ids: [],
          intake_complete_for_services: [],
          last_visited_at: null,
          edit_requested_at: null,
          edit_granted_at: null,
        });
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to realtime changes on intake_responses (e.g., admin grants edit access)
    const channel = supabase
      .channel(`intake_responses:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'intake_responses',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow) {
            setData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                submitted_at: newRow.submitted_at ?? prev.submitted_at,
                edit_requested_at: newRow.edit_requested_at ?? prev.edit_requested_at,
                edit_granted_at: newRow.edit_granted_at ?? prev.edit_granted_at,
                intake_complete_for_services: Array.isArray(newRow.intake_complete_for_services)
                  ? newRow.intake_complete_for_services
                  : prev.intake_complete_for_services,
              };
            });
          }
        }
      )
      .subscribe();

    // Poll for edit status changes every 10 seconds (fallback for realtime)
    const editPollRef = setInterval(async () => {
      const { data: row } = await supabase
        .from('intake_responses')
        .select('edit_granted_at, edit_requested_at, submitted_at, intake_complete_for_services')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (row) {
        setData((prev) => {
          if (!prev) return prev;
          const newEditGranted = row.edit_granted_at || null;
          const newEditRequested = row.edit_requested_at || null;
          const newIcf = Array.isArray(row.intake_complete_for_services) ? row.intake_complete_for_services : prev.intake_complete_for_services;
          if (prev.edit_granted_at === newEditGranted && prev.edit_requested_at === newEditRequested && prev.intake_complete_for_services === newIcf) return prev;
          return { ...prev, edit_granted_at: newEditGranted, edit_requested_at: newEditRequested, intake_complete_for_services: newIcf };
        });
      }
    }, 10000);

    return () => {
      channel.unsubscribe();
      clearInterval(editPollRef);
    };
  }, [user, authLoading]);

  // Check for autosave conflicts before writing
  const checkForConflicts = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    const { data: row } = await supabase
      .from('intake_responses')
      .select('last_saved_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!row?.last_saved_at) return false;

    if (localLastSavedRef.current && row.last_saved_at > localLastSavedRef.current) {
      return true;
    }

    return false;
  }, [user]);

  // Debounced save to database — BLOCKED when form is locked (submitted + no edit access + no new sections)
  const saveToDatabase = useCallback(async (responses: Record<string, any>) => {
    if (!user) return;

    // BLOCK: Do not save if the form is submitted, no edit access, and no new sections to complete
    const hasNewSections = data?.submitted_at && !isIntakeFullyComplete(safeServiceIds, Array.isArray(data?.intake_complete_for_services) ? data.intake_complete_for_services : []);
    if (data?.submitted_at && !data?.edit_granted_at && !hasNewSections) return;

    setSaving(true);
    try {
      const hasConflict = await checkForConflicts();
      if (hasConflict) {
        setConflictDetected(true);
      }

      const now = new Date().toISOString();

      const sectionProgress: Record<string, boolean> = {};
      for (const section of safeFormSections) {
        sectionProgress[section.id] = isSectionComplete(section.fields, responses);
      }

      const upsertData = {
        user_id: user.id,
        responses,
        form_version: 'v4',
        current_section_id: data?.current_section_id || 'intro',
        section_progress: sectionProgress,
        purchased_service_ids: safeServiceIds,
        last_saved_at: now,
      };

      const { error } = await supabase
        .from('intake_responses')
        .upsert(upsertData, { onConflict: 'user_id' });

      if (error) {
        console.error('Autosave error:', error);
      } else {
        localLastSavedRef.current = now;
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Autosave error:', err);
    } finally {
      setSaving(false);
    }
  }, [user, safeFormSections, data?.current_section_id, safeServiceIds, checkForConflicts]);

  // Update a single field value and trigger debounced save
  const updateField = useCallback((fieldId: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const newResponses = { ...prev.responses, [fieldId]: value };
      pendingResponsesRef.current = newResponses;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        if (pendingResponsesRef.current) {
          saveToDatabase(pendingResponsesRef.current);
          pendingResponsesRef.current = null;
        }
      }, 300);

      return { ...prev, responses: newResponses };
    });
  }, [saveToDatabase]);

  // Update current section — BLOCKED when form is locked (no edit access, no new sections)
  const setCurrentSection = useCallback((sectionId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, current_section_id: sectionId };
    });

    // Only persist section changes when form is not locked
    const hasNewSections = data?.submitted_at && !isIntakeFullyComplete(safeServiceIds, Array.isArray(data?.intake_complete_for_services) ? data.intake_complete_for_services : []);
    if (user && !(data?.submitted_at && !data?.edit_granted_at && !hasNewSections)) {
      supabase
        .from('intake_responses')
        .update({ current_section_id: sectionId })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error updating current section:', error);
        });
    }
  }, [user, data?.submitted_at, data?.edit_granted_at]);

  // Submit the form via server-side endpoint for security
  const submitForm = useCallback(async (responses: Record<string, any>) => {
    if (!user) return false;

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session token for submission');
        setSubmitting(false);
        return false;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/intake-submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses,
          current_section_id: data?.current_section_id || 'intro',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Submit error:', errData.error || res.status);
        return false;
      }

      const result = await res.json();

      localLastSavedRef.current = result.submitted_at;

      const resultPsi = Array.isArray(result.purchased_service_ids) ? result.purchased_service_ids : safeServiceIds;
      const resultIcf = Array.isArray(result.intake_complete_for_services) ? result.intake_complete_for_services : [];

      setData((prev) => prev ? {
        ...prev,
        responses: result.rejected_fields
          ? Object.fromEntries(Object.entries(responses).filter(([k]) => !result.rejected_fields.includes(k)))
          : responses,
        submitted_at: result.submitted_at,
        purchased_service_ids: resultPsi,
        intake_complete_for_services: resultIcf,
        edit_granted_at: null,
        edit_requested_at: null,
      } : prev);

      if (resultPsi.length > 0) {
        setPurchasedServiceIds(resultPsi);
      }

      return true;
    } catch (err) {
      console.error('Submit error:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, data?.current_section_id, safeServiceIds]);

  // Upload a file to intake-uploads bucket
  const uploadFile = useCallback(async (fieldId: string, file: File) => {
    if (!user) return null;

    const filePath = `${user.id}/${fieldId}/${file.name}`;
    const { data: uploadData, error } = await supabase.storage
      .from('intake-uploads')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const fileMeta = {
      name: file.name,
      type: file.type,
      size: file.size,
      path: filePath,
    };

    return fileMeta;
  }, [user]);

  // Remove a file from intake-uploads bucket
  const removeFile = useCallback(async (fieldId: string, filePath: string) => {
    if (!user) return;

    const { error } = await supabase.storage
      .from('intake-uploads')
      .remove([filePath]);

    if (error) {
      console.error('Remove file error:', error);
    }
  }, [user]);

  const dismissConflict = useCallback(() => {
    setConflictDetected(false);
  }, []);

  // Get new sections (for users who already submitted but purchased additional services)
  const newSectionIds = (() => {
    if (!data?.submitted_at) return [];
    const completedFor = Array.isArray(data.intake_complete_for_services) ? data.intake_complete_for_services : [];
    // Legacy: submitted but no tracking data → assume all current services were completed already
    if (completedFor.length === 0) return [];
    if (isIntakeFullyComplete(safeServiceIds, completedFor)) return [];

    const existingSectionIds = new Set(
      buildIntakeForm(completedFor.length > 0 ? completedFor : DEFAULT_SERVICE_IDS)
        .map((s) => s.id)
    );
    return safeFormSections
      .filter((s) => !existingSectionIds.has(s.id))
      .map((s) => s.id);
  })();

  const intakeFullyComplete = (() => {
    if (!data?.submitted_at) return false;
    const icf = Array.isArray(data.intake_complete_for_services) ? data.intake_complete_for_services : [];
    // Legacy: submitted but intake_complete_for_services empty → treat as fully complete
    if (icf.length === 0) return true;
    return isIntakeFullyComplete(safeServiceIds, icf);
  })();

  const completedSectionIds = (() => {
    if (!data?.submitted_at) return [];
    const progress = (data.section_progress && typeof data.section_progress === 'object') ? data.section_progress : {};
    return Object.entries(progress)
      .filter(([, complete]) => complete)
      .map(([id]) => id)
      .filter((id) => !newSectionIds.includes(id));
  })();

  // Edit access logic
  const canRequestEdit = (() => {
    if (!data?.submitted_at) return false;
    if (data.edit_granted_at) return false; // already granted, no need to request again
    if (data.edit_requested_at) return false; // already requested
    const submittedAt = new Date(data.submitted_at);
    const oneHourAfter = new Date(submittedAt.getTime() + 60 * 60 * 1000);
    return new Date() < oneHourAfter; // within 1 hour of submission
  })();

  const hasEditAccess = (() => {
    if (!data?.submitted_at) return false;
    if (!data.edit_granted_at) return false;
    return true;
  })();

  const editRequested = !!data?.edit_requested_at;

  const requestEdit = useCallback(async () => {
    if (!user || !canRequestEdit) return false;

    const now = new Date().toISOString();

    // 1. Record the edit request in intake_responses
    const { error } = await supabase
      .from('intake_responses')
      .update({ edit_requested_at: now })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error requesting edit:', error);
      return false;
    }

    // 2. Find an admin to send the message to — try multiple approaches
    let adminId: string | null = null;

    // Try admin_users first
    const { data: admins } = await supabase
      .from('admin_users')
      .select('user_id')
      .limit(1);

    if (admins && admins.length > 0 && admins[0].user_id) {
      adminId = admins[0].user_id;
    }

    // Fallback: try finding admin from client_messages (admin who messaged this client before)
    if (!adminId) {
      const { data: existingMsgs } = await supabase
        .from('client_messages')
        .select('sender_id')
        .eq('recipient_id', user.id)
        .neq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingMsgs && existingMsgs.length > 0 && existingMsgs[0].sender_id) {
        adminId = existingMsgs[0].sender_id;
      }
    }

    if (!adminId) {
      console.error('Could not find an admin to send edit request message to');
      // Still update the local state since the DB write succeeded
      setData(prev => prev ? { ...prev, edit_requested_at: now } : prev);
      return true;
    }

    // 3. Send the message
    const conversationId = [user.id, adminId].sort().join('_');

    const { error: msgError } = await supabase
      .from('client_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: adminId,
        message_content: 'Could I please go back to the intake form and change something?',
        message_type: 'intake_edit_request',
      });

    if (msgError) {
      console.error('Error sending edit request message:', msgError);
      // Still return true since the DB edit_requested_at was set
    }

    setData(prev => prev ? { ...prev, edit_requested_at: now } : prev);
    return true;
  }, [user, canRequestEdit]);

  return {
    data,
    loading: authLoading || loading,
    saving,
    lastSaved,
    purchasedServiceIds: safeServiceIds,
    formSections: safeFormSections,
    submitting,
    newSectionIds,
    completedSectionIds,
    intakeFullyComplete,
    conflictDetected,
    dismissConflict,
    updateField,
    setCurrentSection,
    submitForm,
    uploadFile,
    removeFile,
    canRequestEdit,
    hasEditAccess,
    editRequested,
    requestEdit,
  };
}
