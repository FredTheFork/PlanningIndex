'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { FormSection } from '@/lib/forms/intake-definition';
import { isSectionComplete } from '@/lib/forms/conditional-logic';

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
}

const SERVICE_NAMES: Record<string, string> = {
  business_foundations_pack: 'Business Foundations Pack',
  website_copy_pack: 'Website Copy Starter Pack',
  social_media_pack: 'Social Media Starter Pack',
};

export function useIntakeResponses() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<IntakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [purchasedServiceIds, setPurchasedServiceIds] = useState<string[]>([]);
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResponsesRef = useRef<Record<string, any> | null>(null);

  // Derive purchased service IDs from services_purchased table
  useEffect(() => {
    if (!user) return;

    const fetchServiceIds = async () => {
      const { data: services } = await supabase
        .from('services_purchased')
        .select('service_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      const activeIds = (services || []).map((s: any) => s.service_id);

      if (activeIds.length > 0) {
        setPurchasedServiceIds(activeIds);
      } else {
        // Backward compat: check client_profiles.purchased_upsells
        const { data: profile } = await supabase
          .from('client_profiles')
          .select('purchased_upsells, has_submitted_intake')
          .eq('user_id', user.id)
          .maybeSingle();

        const upsellIds = profile?.purchased_upsells || [];
        if (upsellIds.length > 0) {
          setPurchasedServiceIds(['business_foundations_pack', ...upsellIds]);
        } else if (profile?.has_submitted_intake) {
          // Legacy submissions without service tracking
          setPurchasedServiceIds(['business_foundations_pack']);
        } else {
          // Default for new users
          setPurchasedServiceIds(['business_foundations_pack']);
        }
      }
    };

    fetchServiceIds();
  }, [user]);

  // Build form sections when service IDs change
  useEffect(() => {
    if (purchasedServiceIds.length > 0) {
      setFormSections(buildIntakeForm(purchasedServiceIds));
    }
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
        setData({
          id: row.id,
          user_id: row.user_id,
          form_version: row.form_version || 'v4',
          responses: row.responses || {},
          current_section_id: row.current_section_id || 'intro',
          section_progress: row.section_progress || {},
          last_saved_at: row.last_saved_at,
          submitted_at: row.submitted_at,
          file_uploads: row.file_uploads || {},
          purchased_service_ids: row.purchased_service_ids || [],
          intake_complete_for_services: row.intake_complete_for_services || [],
          last_visited_at: row.last_visited_at,
        });
        setLastSaved(row.last_saved_at ? new Date(row.last_saved_at) : null);

        // If row has purchased_service_ids, prefer those over derived ones
        if (row.purchased_service_ids && row.purchased_service_ids.length > 0) {
          setPurchasedServiceIds(row.purchased_service_ids);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user, authLoading]);

  // Debounced save to database
  const saveToDatabase = useCallback(async (responses: Record<string, any>) => {
    if (!user) return;

    setSaving(true);
    try {
      const now = new Date().toISOString();

      // Compute section_progress from responses
      const sectionProgress: Record<string, boolean> = {};
      for (const section of formSections) {
        sectionProgress[section.id] = isSectionComplete(section.fields, responses);
      }

      const upsertData = {
        user_id: user.id,
        responses,
        form_version: 'v4',
        current_section_id: data?.current_section_id || 'intro',
        section_progress: sectionProgress,
        purchased_service_ids: purchasedServiceIds,
        last_saved_at: now,
      };

      const { error } = await supabase
        .from('intake_responses')
        .upsert(upsertData, { onConflict: 'user_id' });

      if (error) {
        console.error('Autosave error:', error);
      } else {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Autosave error:', err);
    } finally {
      setSaving(false);
    }
  }, [user, formSections, data?.current_section_id, purchasedServiceIds]);

  // Update a single field value and trigger debounced save
  const updateField = useCallback((fieldId: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const newResponses = { ...prev.responses, [fieldId]: value };
      pendingResponsesRef.current = newResponses;

      // Debounce save
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

  // Update current section
  const setCurrentSection = useCallback((sectionId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, current_section_id: sectionId };
    });

    // Also save to DB
    if (user) {
      supabase
        .from('intake_responses')
        .update({ current_section_id: sectionId })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error updating current section:', error);
        });
    }
  }, [user]);

  // Submit the form
  const submitForm = useCallback(async (responses: Record<string, any>) => {
    if (!user) return false;

    setSubmitting(true);
    try {
      const sectionProgress: Record<string, boolean> = {};
      for (const section of formSections) {
        sectionProgress[section.id] = isSectionComplete(section.fields, responses);
      }

      const now = new Date().toISOString();
      const { error } = await supabase
        .from('intake_responses')
        .update({
          responses,
          submitted_at: now,
          section_progress: sectionProgress,
          intake_complete_for_services: purchasedServiceIds,
          last_saved_at: now,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Submit error:', error);
        return false;
      }

      // Update client_profiles
      const { error: profileError } = await supabase
        .from('client_profiles')
        .update({
          has_submitted_intake: true,
          intake_submitted_at: now,
          intake_complete_for_services: purchasedServiceIds,
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      setData((prev) => prev ? {
        ...prev,
        responses,
        submitted_at: now,
        section_progress: sectionProgress,
        intake_complete_for_services: purchasedServiceIds,
      } : prev);

      return true;
    } catch (err) {
      console.error('Submit error:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, formSections, purchasedServiceIds]);

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

  // Get new sections (for users who already submitted but purchased additional services)
  const newSectionIds = (() => {
    if (!data?.submitted_at) return [];
    const completedFor = data.intake_complete_for_services || [];
    const missingServices = purchasedServiceIds.filter(
      (id) => !completedFor.includes(id)
    );
    if (missingServices.length === 0) return [];

    const existingSectionIds = new Set(
      buildIntakeForm(completedFor.length > 0 ? completedFor : ['business_foundations_pack'])
        .map((s) => s.id)
    );
    return formSections
      .filter((s) => !existingSectionIds.has(s.id))
      .map((s) => s.id);
  })();

  // Which sections are already completed (read-only for resubmissions)
  const completedSectionIds = (() => {
    if (!data?.submitted_at) return [];
    const progress = data.section_progress || {};
    return Object.entries(progress)
      .filter(([, complete]) => complete)
      .map(([id]) => id)
      .filter((id) => !newSectionIds.includes(id));
  })();

  return {
    data,
    loading: authLoading || loading,
    saving,
    lastSaved,
    purchasedServiceIds,
    formSections,
    submitting,
    newSectionIds,
    completedSectionIds,
    updateField,
    setCurrentSection,
    submitForm,
    uploadFile,
    removeFile,
  };
}
