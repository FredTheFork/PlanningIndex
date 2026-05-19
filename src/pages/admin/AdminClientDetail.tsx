import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { intakeFormSections, upsellFormSections, FormField } from '../../lib/intakeFormDefinition';
import { ArrowLeft, FileText, Upload, X, Save, AlertCircle, FolderOpen, Download, ExternalLink, Copy, RefreshCw, FileSearch, FileOutput, Eye, CreditCard as Edit3, Check, Send } from 'lucide-react';

interface ClientData {
  profile: {
    user_id: string;
    has_submitted_intake: boolean;
    intake_submitted_at: string | null;
    delivery_status: 'not_started' | 'in_progress' | 'delivered';
    delivery_link: string | null;
    created_at: string;
    admin_notes: string;
    purchased_upsells: string[];
  } | null;
  intakeResponses: Record<string, any> | null;
  additionalNotes: Record<string, string> | null;
  fileUploads: Record<string, any[]>;
  intakeUploads: { id: string; question_id: string; file_name: string; file_path: string; file_size: number; file_type: string }[];
  clientDocuments: { id: string; file_name: string; file_path: string; file_size: number; file_type: string; created_at: string }[];
  orders: any[];
}

export default function AdminClientDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { user: adminUser } = useAuth();
  const [data, setData] = useState<ClientData>({
    profile: null,
    intakeResponses: null,
    additionalNotes: null,
    fileUploads: {},
    intakeUploads: [],
    clientDocuments: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'intake' | 'documents' | 'uploads' | 'brief' | 'generated'>('overview');
  const [briefData, setBriefData] = useState<{
    id: string;
    status: string;
    brief_content: string | null;
    risk_level: string | null;
    error_message: string | null;
    generated_at: string | null;
  } | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefTriggering, setBriefTriggering] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [deliveryLink, setDeliveryLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Generated Documents State ──
  const [generatedDocs, setGeneratedDocs] = useState<Record<string, {
    id: string;
    status: string;
    content_text: string | null;
    content_html: string | null;
    error_message: string | null;
    generated_at: string | null;
    admin_edited: boolean;
    delivered_to_client: boolean;
    pdf_path: string | null;
    docx_path: string | null;
    files_generated_at: string | null;
  }>>({});
  const [docsLoading, setDocsLoading] = useState(false);
  const [generatingDoc, setGeneratingDoc] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [deliveringDoc, setDeliveringDoc] = useState<string | null>(null);
  const [docsPollingActive, setDocsPollingActive] = useState(false);
  const [generatingFiles, setGeneratingFiles] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchClientData();
  }, [userId]);

  const fetchClientData = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: intakeResult } = await supabase
        .from('intake_responses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: uploadsData } = await supabase
        .from('intake_uploads')
        .select('*')
        .eq('user_id', userId);

      const { data: docsData } = await supabase
        .from('client_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      setData({
        profile,
        intakeResponses: intakeResult?.responses || null,
        additionalNotes: intakeResult?.additional_notes || null,
        fileUploads: intakeResult?.file_uploads || {},
        intakeUploads: uploadsData || [],
        clientDocuments: docsData || [],
        orders: ordersData || [],
      });

      if (profile) {
        setDeliveryStatus(profile.delivery_status);
        setDeliveryLink(profile.delivery_link || '');
        setAdminNotes(profile.admin_notes || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBrief = async () => {
    if (!userId) return;
    setBriefLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .select('id, status, brief_content, risk_level, error_message, generated_at')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching brief:', error);
      } else {
        setBriefData(data);
        if (data?.status === 'completed' || data?.status === 'failed') {
          setPollingActive(false);
        }
      }
    } finally {
      setBriefLoading(false);
    }
  };

  const handleTriggerBrief = async () => {
    if (!userId) return;
    setBriefTriggering(true);
    setBriefError(null);

    // Set status to 'generating' immediately so UI updates instantly
    setBriefData(prev => prev
      ? { ...prev, status: 'generating' }
      : { id: '', status: 'generating', brief_content: null, risk_level: null, error_message: null, generated_at: null }
    );
    setPollingActive(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBriefError(data.error || 'Failed to trigger brief generation');
        setBriefData(prev => prev ? { ...prev, status: 'failed' } : null);
        setPollingActive(false);
        return;
      }
    } catch (err: any) {
      setBriefError(err.message || 'Network error triggering brief');
      setBriefData(prev => prev ? { ...prev, status: 'failed' } : null);
      setPollingActive(false);
    } finally {
      setBriefTriggering(false);
    }
  };

  const handleCopyBrief = () => {
    if (briefData?.brief_content) {
      navigator.clipboard.writeText(briefData.brief_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Generated Documents Functions ──

  const DOCUMENT_TYPES = [
    { key: 'terms_and_conditions', label: 'Terms and Conditions', icon: FileText },
    { key: 'bespoke_client_contract', label: 'Bespoke Client Contract', icon: FileText },
    { key: 'gdpr_privacy_policy', label: 'GDPR Privacy Policy', icon: FileText },
    { key: 'professional_bio', label: 'Professional Bio', icon: FileText },
    { key: 'linkedin_script', label: 'LinkedIn Script', icon: FileText },
    { key: 'elevator_pitch', label: 'Elevator Pitch - 3 Versions', icon: FileText },
    { key: 'professional_invoice_template', label: 'Professional Invoice Template', icon: FileText },
    { key: 'welcome_email', label: 'New Client Welcome Email - 3', icon: FileText },
    { key: 'late_payment_letters', label: 'Late Payment Letters - 3', icon: FileText },
  ];

  const fetchGeneratedDocs = async () => {
    if (!userId) return;
    setDocsLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('id, document_type, status, content_text, content_html, error_message, generated_at, admin_edited, delivered_to_client, pdf_path, docx_path, files_generated_at')
        .eq('client_id', userId);

      if (error) {
        console.error('Error fetching generated docs:', error);
      } else {
        const map: Record<string, any> = {};
        (data || []).forEach((d: any) => {
          map[d.document_type] = d;
        });
        setGeneratedDocs(map);

        // Stop polling if all generating docs are done
        const anyGenerating = (data || []).some((d: any) => d.status === 'generating');
        if (!anyGenerating) {
          setDocsPollingActive(false);
        }
      }
    } finally {
      setDocsLoading(false);
    }
  };

  const handleGenerateDocument = async (docType: string) => {
    if (!userId) return;
    setGeneratingDoc(docType);

    // Optimistically set status
    setGeneratedDocs(prev => ({
      ...prev,
      [docType]: {
        ...(prev[docType] || { id: '', admin_edited: false, delivered_to_client: false, content_text: null, content_html: null, error_message: null, generated_at: null }),
        status: 'generating',
        error_message: null,
      }
    }));
    setDocsPollingActive(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: userId, document_type: docType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneratedDocs(prev => ({
          ...prev,
          [docType]: { ...prev[docType], status: 'failed', error_message: data.error || 'Generation failed' }
        }));
        setDocsPollingActive(false);
      }
    } catch (err: any) {
      setGeneratedDocs(prev => ({
        ...prev,
        [docType]: { ...prev[docType], status: 'failed', error_message: err.message || 'Network error' }
      }));
      setDocsPollingActive(false);
    } finally {
      setGeneratingDoc(null);
    }
  };

  const handleEditDocument = (docType: string) => {
    const doc = generatedDocs[docType];
    if (doc?.content_text) {
      setEditingDoc(docType);
      setEditContent(doc.content_text);
    }
  };

  const handleSaveEdit = async () => {
    if (!userId || !editingDoc) return;
    setEditSaving(true);
    try {
      const businessName = data.intakeResponses?.q2_business_name || 'Unknown Business';
      const label = DOCUMENT_TYPES.find(d => d.key === editingDoc)?.label || editingDoc;

      // Re-render HTML from edited text
      const htmlContent = textToSimpleHtml(editContent, label, businessName);

      const { error } = await supabase
        .from('generated_documents')
        .update({
          content_text: editContent,
          content_html: htmlContent,
          admin_edited: true,
          admin_edited_at: new Date().toISOString(),
        })
        .eq('client_id', userId)
        .eq('document_type', editingDoc);

      if (error) throw error;

      setGeneratedDocs(prev => ({
        ...prev,
        [editingDoc!]: {
          ...prev[editingDoc!],
          content_text: editContent,
          content_html: htmlContent,
          admin_edited: true,
        }
      }));
      setEditingDoc(null);
    } catch (err) {
      console.error('Save edit error:', err);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeliverDocument = async (docType: string) => {
    if (!userId) return;
    setDeliveringDoc(docType);
    try {
      const autoDeleteAt = new Date();
      autoDeleteAt.setDate(autoDeleteAt.getDate() + 14);

      const { error } = await supabase
        .from('generated_documents')
        .update({
          delivered_to_client: true,
          delivered_at: new Date().toISOString(),
          auto_delete_at: autoDeleteAt.toISOString(),
        })
        .eq('client_id', userId)
        .eq('document_type', docType);

      if (error) throw error;

      setGeneratedDocs(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          delivered_to_client: true,
        }
      }));
    } catch (err) {
      console.error('Deliver error:', err);
    } finally {
      setDeliveringDoc(null);
    }
  };

  const handleDeliverAll = async () => {
    if (!userId) return;
    const completedDocs = DOCUMENT_TYPES.filter(d => {
      const doc = generatedDocs[d.key];
      return doc?.status === 'completed' && !doc.delivered_to_client;
    });
    for (const d of completedDocs) {
      await handleDeliverDocument(d.key);
    }
  };

  const handleGenerateFiles = async (docType: string) => {
    if (!userId) return;
    setGeneratingFiles(docType);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: userId, document_type: docType, generate_files: true }),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh docs to get updated paths
        await fetchGeneratedDocs();
      } else {
        console.error('Generate files error:', result.error);
      }
    } catch (err: any) {
      console.error('Generate files network error:', err.message);
    } finally {
      setGeneratingFiles(null);
    }
  };

  const getFileDownloadUrl = async (filePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .createSignedUrl(filePath, 3600);
    if (error || !data) return null;
    return data.signedUrl;
  };

  // Strip markdown artifacts from text
  function stripMarkdown(text: string): string {
    return text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/~~(.+?)~~/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^[-]{3,}$/gm, '')
      .replace(/^[*]{3,}$/gm, '')
      .replace(/^>\s+/gm, '');
  }

  // Parse brand colours from intake response
  function parseBrandColours(colourInput: string): { primary: string; secondary: string; accent: string } {
    if (!colourInput) return { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };
    const lower = colourInput.toLowerCase();
    const colourMap: Record<string, { primary: string; secondary: string; accent: string }> = {
      navy: { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
      blue: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#93C5FD' },
      green: { primary: '#166534', secondary: '#22C55E', accent: '#86EFAC' },
      sage: { primary: '#4A6741', secondary: '#7C9A6E', accent: '#A8C49A' },
      gold: { primary: '#92400E', secondary: '#D97706', accent: '#FCD34D' },
      red: { primary: '#991B1B', secondary: '#DC2626', accent: '#FCA5A5' },
      black: { primary: '#1A1A2E', secondary: '#374151', accent: '#6B7280' },
      teal: { primary: '#0F766E', secondary: '#14B8A6', accent: '#5EEAD4' },
      burgundy: { primary: '#7F1D1D', secondary: '#B91C1C', accent: '#E879A0' },
      charcoal: { primary: '#1F2937', secondary: '#4B5563', accent: '#9CA3AF' },
    };
    for (const [key, val] of Object.entries(colourMap)) {
      if (lower.includes(key)) return val;
    }
    const hexMatch = colourInput.match(/#[0-9a-fA-F]{6}/);
    if (hexMatch) {
      const h = hexMatch[0];
      return { primary: h, secondary: '#2C68C4', accent: '#4A90E2' };
    }
    return { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };
  }

  // Get visual style config from intake response
  function getVisualStyleConfig(style: string): { headerFont: string; bodyFont: string; borderStyle: string } {
    const s = (style || '').toLowerCase();
    if (s.includes('corporate') || s.includes('formal'))
      return { headerFont: "'Times New Roman', Georgia, serif", bodyFont: "'Times New Roman', Georgia, serif", borderStyle: 'double' };
    if (s.includes('warm') || s.includes('friendly'))
      return { headerFont: "Georgia, 'Palatino Linotype', serif", bodyFont: "Georgia, 'Palatino Linotype', serif", borderStyle: 'accent' };
    if (s.includes('premium') || s.includes('luxury'))
      return { headerFont: "'Playfair Display', Georgia, serif", bodyFont: "Georgia, 'Palatino Linotype', serif", borderStyle: 'solid' };
    if (s.includes('simple'))
      return { headerFont: "Georgia, serif", bodyFont: "Georgia, serif", borderStyle: 'minimal' };
    return { headerFont: "Georgia, 'Palatino Linotype', serif", bodyFont: "Georgia, 'Palatino Linotype', serif", borderStyle: 'solid' };
  }

  // HTML conversion for edited content — mirrors edge function with client design
  function textToSimpleHtml(text: string, label: string, businessName: string): string {
    const r = data.intakeResponses || {};
    const colours = parseBrandColours(r.q67_brand_colours || '');
    const styleConfig = getVisualStyleConfig(r.q68_visual_style || '');
    const firstName = r.q55_first_name || '';
    const brandIdentity = r.q64_brand_identity || '';
    const subtitleName = brandIdentity.includes('personal') && firstName
      ? firstName
      : brandIdentity.includes('business') && businessName
      ? businessName
      : businessName;

    const stripped = stripMarkdown(text);
    const escaped = stripped
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const borderCSS = styleConfig.borderStyle === 'double'
      ? `border-bottom:4px double ${colours.primary};`
      : styleConfig.borderStyle === 'accent'
      ? `border-bottom:3px solid ${colours.accent};`
      : styleConfig.borderStyle === 'solid'
      ? `border-bottom:3px solid ${colours.primary};`
      : `border-bottom:1px solid ${colours.primary}40;`;

    const formatted = escaped
      .replace(/===\s*(.+?)\s*===/g, `<h2 style="font-size:16px;font-weight:700;margin:28px 0 12px;color:${colours.primary};${borderCSS}padding-bottom:8px;letter-spacing:0.02em;">$1</h2>`)
      .replace(/^(\d+(?:\.\d+)*)\.\s+(.+)$/gm, `<p style="margin:8px 0;padding-left:28px;text-indent:-28px;"><strong style="color:${colours.primary};">$1.</strong> $2</p>`)
      .replace(/^[-•]\s+(.+)$/gm, `<p style="margin:4px 0 4px 28px;"><span style="color:${colours.secondary};font-weight:bold;">&#8226;</span> $1</p>`)
      .replace(/\n\n/g, '</p><p style="margin:8px 0;">')
      .replace(/\n/g, '<br>');

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{margin:2.5cm;size:A4;}body{font-family:${styleConfig.bodyFont};font-size:12pt;line-height:1.6;color:#1a1a2e;max-width:700px;margin:0 auto;padding:40px 0;}h1{font-size:22pt;font-weight:700;margin:0 0 8px;color:${colours.primary};}h2{font-size:14pt;font-weight:700;margin:24px 0 12px;${borderCSS}padding-bottom:6px;color:${colours.primary};}p{margin:8px 0;}.header{text-align:center;margin-bottom:40px;${borderCSS}padding-bottom:24px;}.footer{margin-top:60px;padding-top:16px;border-top:1px solid #ccc;font-size:9pt;color:#888;text-align:center;}</style></head><body><div style="width:100%;height:4px;background:linear-gradient(90deg,${colours.primary},${colours.secondary},${colours.accent});margin-bottom:32px;border-radius:2px;"></div><div class="header"><h1>${label}</h1><div style="font-size:10pt;color:${colours.secondary};">Prepared for ${subtitleName} | Foundationary</div></div><div style="margin-top:20px;">${formatted}</div><div class="footer">Generated by Foundationary | ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}<br>This document was AI-generated and should be reviewed by a qualified professional before use.</div></body></html>`;
  }

  // Fetch brief when the brief tab is active
  useEffect(() => {
    if (activeTab === 'brief' && userId) {
      fetchBrief();
    }
  }, [activeTab, userId]);

  // Fetch generated docs when the generated tab is active
  useEffect(() => {
    if (activeTab === 'generated' && userId) {
      fetchGeneratedDocs();
    }
  }, [activeTab, userId]);

  // Poll for generated doc updates when any are generating
  useEffect(() => {
    if (!docsPollingActive) return;
    const interval = setInterval(async () => {
      await fetchGeneratedDocs();
    }, 5000);
    return () => clearInterval(interval);
  }, [docsPollingActive]);

  // Poll for brief updates when generating
  useEffect(() => {
    if (!pollingActive) return;
    if (briefData?.status === 'completed' || briefData?.status === 'failed') {
      setPollingActive(false);
      return;
    }

    const interval = setInterval(async () => {
      await fetchBrief();
    }, 5000);
    return () => clearInterval(interval);
  }, [pollingActive, briefData?.status]);

  const generateSignedUrls = async () => {
    const urls: Record<string, string> = {};
    const paths: string[] = [];

    data.intakeUploads.forEach(f => paths.push(f.file_path));
    Object.values(data.fileUploads).flat().forEach((f: any) => {
      if (f.path) paths.push(f.path);
    });
    data.clientDocuments.forEach(d => paths.push(d.file_path));

    for (const path of paths) {
      const { data: urlData } = await supabase.storage
        .from(path.startsWith(userId! + '/') && data.intakeUploads.some(f => f.file_path === path) ? 'intake-uploads' : 'client-documents')
        .createSignedUrl(path, 3600);
      if (urlData?.signedUrl) {
        urls[path] = urlData.signedUrl;
      }
    }

    setSignedUrls(urls);
  };

  useEffect(() => {
    if (!loading && (data.intakeUploads.length > 0 || Object.keys(data.fileUploads).length > 0 || data.clientDocuments.length > 0)) {
      generateSignedUrls();
    }
  }, [loading, data.intakeUploads.length, data.clientDocuments.length]);

  const handleSaveProfile = async () => {
    if (!userId) return;

    setSaving(true);
    setSaveMessage('');

    try {
      const { error } = await supabase
        .from('client_profiles')
        .update({
          delivery_status: deliveryStatus,
          delivery_link: deliveryLink || null,
          admin_notes: adminNotes,
        })
        .eq('user_id', userId);

      if (error) throw error;

      setSaveMessage('Saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async (files: FileList) => {
    if (!userId || !adminUser) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${userId}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('client-documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { error: dbError } = await supabase.from('client_documents').insert({
          user_id: userId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: adminUser.id,
        });
        if (dbError) {
          console.error('Failed to record document in database:', dbError);
        }
      }

      fetchClientData();
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string, filePath: string) => {
    if (!confirm('Delete this document?')) return;

    try {
      await supabase.storage.from('client-documents').remove([filePath]);
      const { error: dbError } = await supabase.from('client_documents').delete().eq('id', docId);
      if (dbError) {
        console.error('Failed to delete document record:', dbError);
      }
      fetchClientData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (!data.profile) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={40} className="text-secondary-text mx-auto mb-4" />
        <p className="font-inter text-secondary-text">Client not found.</p>
        <Link to="/personal/admin" className="font-inter text-medium-blue text-sm hover:underline mt-4 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const allSections = [...intakeFormSections, ...upsellFormSections];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/personal/admin"
          className="font-inter text-sm text-medium-blue hover:underline flex items-center gap-1 mb-3"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Client Management
        </h1>
        <p className="font-inter text-secondary-text text-sm font-mono">
          {userId}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {(['overview', 'intake', 'documents', 'uploads', 'brief', 'generated'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-inter text-sm px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-navy text-navy font-semibold'
                : 'border-transparent text-secondary-text hover:text-navy'
            }`}
          >
            {tab === 'uploads' ? 'Client Uploads' : tab === 'brief' ? 'Master Brief' : tab === 'generated' ? 'Generated Documents' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status & Controls */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="font-inter font-semibold text-navy text-sm mb-4">Delivery Status & Controls</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                  Delivery Status
                </label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm bg-white"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                  Delivery Link (folder URL)
                </label>
                <input
                  type="url"
                  value={deliveryLink}
                  onChange={(e) => setDeliveryLink(e.target.value)}
                  placeholder="e.g. Google Drive or Dropbox folder link"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes about this client..."
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors flex items-center gap-2 disabled:opacity-50"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
              {saveMessage && (
                <span className={`font-inter text-sm ${saveMessage.includes('Error') ? 'text-danger' : 'text-success'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>

          {/* Quick info */}
          <div className="grid md:grid-cols-3 gap-4">
            <InfoCard
              label="Intake Form"
              value={data.profile.has_submitted_intake ? 'Submitted' : 'Not Submitted'}
              detail={data.profile.intake_submitted_at
                ? new Date(data.profile.intake_submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'Waiting for client'}
              status={data.profile.has_submitted_intake ? 'success' : 'pending'}
            />
            <InfoCard
              label="Document Status"
              value={data.profile.delivery_status === 'delivered' ? 'Delivered' : data.profile.delivery_status === 'in_progress' ? 'In Progress' : 'Not Started'}
              detail={data.profile.delivery_link ? 'Delivery link set' : 'No delivery link'}
              status={data.profile.delivery_status === 'delivered' ? 'success' : data.profile.delivery_status === 'in_progress' ? 'warning' : 'pending'}
            />
            <InfoCard
              label="Documents Uploaded"
              value={`${data.clientDocuments.length} files`}
              detail={data.clientDocuments.length > 0 ? 'Ready for client' : 'No documents uploaded yet'}
              status={data.clientDocuments.length > 0 ? 'success' : 'pending'}
            />
          </div>

          {/* Orders */}
          {data.orders.length > 0 && (
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-inter font-semibold text-navy text-sm mb-4">Orders</h3>
              <div className="flex flex-col gap-2">
                {data.orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between bg-off-white rounded-md px-4 py-3">
                    <div>
                      <span className="font-inter text-sm text-dark-text font-medium">{order.status}</span>
                      <span className="font-inter text-xs text-secondary-text ml-3">
                        {new Date(order.created_at).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <span className="font-inter text-xs text-secondary-text font-mono">
                      {order.stripe_checkout_session_id?.substring(0, 20)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Intake Tab */}
      {activeTab === 'intake' && (
        <div>
          {!data.intakeResponses ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <FileText size={40} className="text-secondary-text mx-auto mb-4" />
              <p className="font-inter text-secondary-text">Client has not submitted their intake form yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {allSections.filter(s => s.fields.length > 0 && s.id !== 'intro').map(section => {
                const sectionResponses = section.fields
                  .filter(f => {
                    const val = data.intakeResponses?.[f.id];
                    const otherVal = data.intakeResponses?.[f.id + '_other'];
                    const noteVal = data.additionalNotes?.[f.id];
                    if (f.type === 'repeating_section') {
                      return val && Array.isArray(val) && val.length > 0;
                    }
                    const hasMain = val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
                    const hasOther = otherVal && otherVal.trim() !== '';
                    const hasNote = noteVal && noteVal.trim() !== '';
                    return hasMain || hasOther || hasNote;
                  });

                if (sectionResponses.length === 0) return null;

                return (
                  <div key={section.id} className="bg-white rounded-lg border border-border p-6">
                    <h3 className="font-inter font-semibold text-navy text-sm mb-1">{section.title}</h3>
                    {section.usedIn && (
                      <p className="font-inter text-xs text-medium-blue mb-4 italic">Used in: {section.usedIn}</p>
                    )}
                    <div className="flex flex-col gap-4">
                      {section.fields.map(field => {
                        const val = data.intakeResponses?.[field.id];
                        const otherVal = data.intakeResponses?.[field.id + '_other'];
                        const noteVal = data.additionalNotes?.[field.id];
                        const hasMain = val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
                        const hasOther = otherVal && otherVal.trim() !== '';
                        const hasNote = noteVal && noteVal.trim() !== '';
                        if (!hasMain && !hasOther && !hasNote) return null;

                        return (
                          <div key={field.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                            <div className="font-inter font-medium text-dark-text text-sm mb-1">
                              {field.questionNumber}. {field.label}
                            </div>
                            {hasMain && <FieldValue field={field} value={val} />}
                            {field.hasOtherOption && hasOther && (
                              <div className="mt-2 ml-2 pl-3 border-l-2 border-medium-blue">
                                <span className="font-inter text-xs text-medium-blue font-semibold">Other (specified):</span>
                                <p className="font-inter text-secondary-text text-sm mt-0.5">{String(otherVal)}</p>
                              </div>
                            )}
                            {hasNote && (
                              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md p-3">
                                <span className="font-inter text-xs text-amber-700 font-semibold">Additional note:</span>
                                <p className="font-inter text-secondary-text text-sm mt-0.5 whitespace-pre-line">{String(noteVal)}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Documents Tab - Upload delivery documents */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="font-inter font-semibold text-navy text-sm mb-4">
              Upload Delivery Documents
            </h3>
            <p className="font-inter text-secondary-text text-xs mb-4">
              Upload the completed business foundations pack documents here. The client will be able to download them from their documents page.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleDocumentUpload(e.target.files);
              }}
              multiple
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-inter text-sm font-medium text-navy border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 w-full hover:border-medium-blue hover:bg-off-white transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy" />
              ) : (
                <Upload size={24} className="text-medium-blue" />
              )}
              <span>{uploading ? 'Uploading...' : 'Click to upload delivery documents'}</span>
              <span className="text-xs text-secondary-text">PDF, Word, ZIP files accepted</span>
            </button>

            {data.clientDocuments.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <h4 className="font-inter font-semibold text-navy text-xs uppercase tracking-wider mb-2">
                  Uploaded Documents ({data.clientDocuments.length})
                </h4>
                {data.clientDocuments.map(doc => {
                  const url = signedUrls[doc.file_path];
                  return (
                    <div key={doc.id} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                      <FolderOpen size={18} className="text-medium-blue shrink-0" />
                      <span className="font-inter text-sm text-dark-text flex-1 truncate">{doc.file_name}</span>
                      <span className="font-inter text-xs text-secondary-text">
                        {(doc.file_size / 1024).toFixed(1)} KB
                      </span>
                      <span className="font-inter text-xs text-secondary-text">
                        {new Date(doc.created_at).toLocaleDateString('en-GB')}
                      </span>
                      {url && (
                        <>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-medium-blue hover:text-navy transition-colors"
                            title="View file"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <a
                            href={url}
                            download={doc.file_name}
                            className="text-medium-blue hover:text-navy transition-colors"
                            title="Download file"
                          >
                            <Download size={16} />
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                        className="text-secondary-text hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Client Uploads Tab - Files the client uploaded during intake */}
      {activeTab === 'uploads' && (
        <div className="space-y-6">
          {data.intakeUploads.length === 0 && Object.keys(data.fileUploads).length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <Upload size={40} className="text-secondary-text mx-auto mb-4" />
              <p className="font-inter text-secondary-text">No files uploaded by the client.</p>
            </div>
          ) : (
            <>
              {/* File uploads from intake_uploads table */}
              {data.intakeUploads.length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-inter font-semibold text-navy text-sm mb-4">
                    Client Uploaded Files ({data.intakeUploads.length})
                  </h3>
                  <div className="flex flex-col gap-2">
                    {data.intakeUploads.map(file => {
                      const url = signedUrls[file.file_path];
                      return (
                        <div key={file.id} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                          <FileText size={18} className="text-medium-blue shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-inter text-sm text-dark-text block truncate">{file.file_name}</span>
                            <span className="font-inter text-xs text-secondary-text">
                              Question: {file.question_id} | {(file.file_size / 1024).toFixed(1)} KB | {file.file_type || 'unknown type'}
                            </span>
                          </div>
                          {url && (
                            <>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-medium-blue hover:text-navy transition-colors"
                                title="View file"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <a
                                href={url}
                                download={file.file_name}
                                className="text-medium-blue hover:text-navy transition-colors"
                                title="Download file"
                              >
                                <Download size={16} />
                              </a>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* File uploads stored in intake_responses.file_uploads (legacy) */}
              {Object.keys(data.fileUploads).length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-inter font-semibold text-navy text-sm mb-4">
                    Additional File References
                  </h3>
                  <p className="font-inter text-secondary-text text-xs mb-4">
                    Files referenced in the intake response data.
                  </p>
                  <div className="flex flex-col gap-2">
                    {Object.entries(data.fileUploads).map(([fieldId, files]) =>
                      files.map((file: any, i: number) => {
                        const url = signedUrls[file.path];
                        return (
                          <div key={`${fieldId}-${i}`} className="flex items-center gap-3 bg-off-white rounded-md px-4 py-3">
                            <FileText size={18} className="text-medium-blue shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-inter text-sm text-dark-text block truncate">{file.name}</span>
                              <span className="font-inter text-xs text-secondary-text">
                                Question: {fieldId} | {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            {url && (
                              <>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-medium-blue hover:text-navy transition-colors"
                                  title="View file"
                                >
                                  <ExternalLink size={16} />
                                </a>
                                <a
                                  href={url}
                                  download={file.name}
                                  className="text-medium-blue hover:text-navy transition-colors"
                                  title="Download file"
                                >
                                  <Download size={16} />
                                </a>
                              </>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Master Brief Tab */}
      {activeTab === 'brief' && (
        <div className="space-y-6">
          {briefLoading && !briefData ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
              <p className="font-inter text-secondary-text">Loading brief...</p>
            </div>
          ) : !briefData ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <FileSearch size={40} className="text-secondary-text mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-navy mb-2">No brief generated yet</h3>
              <p className="font-inter text-secondary-text text-sm mb-6">
                Generate a master brief from this client's intake responses.
              </p>
              <button
                onClick={handleTriggerBrief}
                disabled={briefTriggering}
                className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {briefTriggering ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <FileSearch size={16} />
                )}
                Generate Brief
              </button>
            </div>
          ) : briefData.status === 'pending' || briefData.status === 'generating' ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-navy mb-2">Generating brief...</h3>
              <p className="font-inter text-secondary-text text-sm">
                This takes up to 60 seconds
              </p>
            </div>
          ) : briefData.status === 'failed' ? (
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 rounded-lg p-3 shrink-0">
                  <AlertCircle size={24} className="text-danger" />
                </div>
                <div className="flex-1">
                  <h3 className="font-inter font-semibold text-navy mb-2">Brief generation failed</h3>
                  {(briefData.error_message || briefError) && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                      <p className="font-inter text-sm text-danger">{briefData.error_message || briefError}</p>
                    </div>
                  )}
                  <button
                    onClick={handleTriggerBrief}
                    disabled={briefTriggering}
                    className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {briefTriggering ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    Regenerate Brief
                  </button>
                </div>
              </div>
            </div>
          ) : briefData.status === 'completed' ? (
            <div className="space-y-4">
              {/* Risk level badge */}
              {briefData.risk_level && (
                <div className="bg-white rounded-lg border border-border p-5 flex items-center gap-4">
                  <span className="font-inter font-semibold text-navy text-sm">Risk Level:</span>
                  <span
                    className={`font-inter font-bold text-sm px-3 py-1 rounded-full ${
                      briefData.risk_level === 'Low'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : briefData.risk_level === 'Medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {briefData.risk_level}
                  </span>
                  {briefData.generated_at && (
                    <span className="font-inter text-xs text-secondary-text ml-auto">
                      Generated {new Date(briefData.generated_at).toLocaleString('en-GB')}
                    </span>
                  )}
                </div>
              )}

              {/* Brief content */}
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-inter font-semibold text-navy text-sm">Brief Content</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTriggerBrief}
                      disabled={briefTriggering}
                      title="Regenerate Brief"
                      className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    >
                      {briefTriggering ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-navy" />
                      ) : (
                        <RefreshCw size={14} />
                      )}
                    </button>
                    <button
                      onClick={handleCopyBrief}
                      className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                </div>
                <div
                  className="font-mono text-sm text-dark-text bg-off-white rounded-md p-5 overflow-y-auto whitespace-pre-wrap leading-[1.7]"
                  style={{ maxHeight: 600 }}
                >
                  {briefData.brief_content || 'No content available.'}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Generated Documents Tab */}
      {activeTab === 'generated' && (
        <div className="space-y-6">
          {/* Header with Deliver All button */}
          <div className="bg-white rounded-lg border border-border p-5 flex items-center justify-between">
            <div>
              <h3 className="font-inter font-semibold text-navy text-sm">AI-Generated Documents</h3>
              <p className="font-inter text-secondary-text text-xs mt-1">
                Generate each document individually. The Master Brief is used as context for all generations.
              </p>
            </div>
            <button
              onClick={handleDeliverAll}
              disabled={!DOCUMENT_TYPES.some(d => generatedDocs[d.key]?.status === 'completed' && !generatedDocs[d.key]?.delivered_to_client)}
              className="font-inter font-semibold text-white bg-success rounded-md hover:bg-green-600 transition-colors inline-flex items-center gap-2 disabled:opacity-40"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Send size={14} />
              Deliver All
            </button>
          </div>

          {/* Document list */}
          {docsLoading && Object.keys(generatedDocs).length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4" />
              <p className="font-inter text-secondary-text">Loading documents...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {DOCUMENT_TYPES.map(doc => {
                const docState = generatedDocs[doc.key];
                const isGenerating = docState?.status === 'generating' || generatingDoc === doc.key;
                const isCompleted = docState?.status === 'completed';
                const isFailed = docState?.status === 'failed';
                const isDelivered = docState?.delivered_to_client;

                return (
                  <div key={doc.key} className="bg-white rounded-lg border border-border p-5">
                    <div className="flex items-center gap-4">
                      {/* Document icon */}
                      <div className={`rounded-lg p-2.5 shrink-0 ${
                        isCompleted ? 'bg-green-50' : isFailed ? 'bg-red-50' : isGenerating ? 'bg-amber-50' : 'bg-gray-50'
                      }`}>
                        <FileOutput size={20} className={
                          isCompleted ? 'text-success' : isFailed ? 'text-danger' : isGenerating ? 'text-amber-600' : 'text-secondary-text'
                        } />
                      </div>

                      {/* Document info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-inter font-semibold text-navy text-sm">{doc.label}</span>
                          {docState?.admin_edited && (
                            <span className="font-inter text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">Edited</span>
                          )}
                          {isDelivered && (
                            <span className="font-inter text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Delivered</span>
                          )}
                        </div>
                        <div className="font-inter text-xs text-secondary-text mt-1">
                          {isCompleted && docState.generated_at
                            ? `Generated ${new Date(docState.generated_at).toLocaleString('en-GB')}`
                            : isGenerating
                            ? 'Generating...'
                            : isFailed
                            ? `Failed: ${docState.error_message?.substring(0, 80) || 'Unknown error'}`
                            : 'Not yet generated'
                          }
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Generate / Regenerate button */}
                        <button
                          onClick={() => handleGenerateDocument(doc.key)}
                          disabled={isGenerating}
                          className="font-inter text-sm font-medium text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {isGenerating ? (
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                          ) : isCompleted ? (
                            <RefreshCw size={14} />
                          ) : (
                            <FileOutput size={14} />
                          )}
                          {isGenerating ? 'Generating...' : isCompleted ? 'Regenerate' : 'Generate'}
                        </button>

                        {/* View button */}
                        {isCompleted && (
                          <button
                            onClick={() => setViewingDoc(viewingDoc === doc.key ? null : doc.key)}
                            className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2"
                            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          >
                            <Eye size={14} />
                            {viewingDoc === doc.key ? 'Hide' : 'View'}
                          </button>
                        )}

                        {/* Edit button */}
                        {isCompleted && (
                          <button
                            onClick={() => handleEditDocument(doc.key)}
                            className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-2"
                            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                        )}

                        {/* Deliver button */}
                        {isCompleted && !isDelivered && (
                          <button
                            onClick={() => handleDeliverDocument(doc.key)}
                            disabled={deliveringDoc === doc.key}
                            className="font-inter text-sm font-medium text-white bg-success rounded-md hover:bg-green-600 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          >
                            {deliveringDoc === doc.key ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                            ) : (
                              <Send size={14} />
                            )}
                            Deliver
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Second row: Generate Files + Download links */}
                    {isCompleted && (
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-3 flex-wrap">
                        {/* Generate PDF/DOCX button */}
                        <button
                          onClick={() => handleGenerateFiles(doc.key)}
                          disabled={generatingFiles === doc.key}
                          className="font-inter text-xs font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                          style={{ padding: '6px 12px' }}
                        >
                          {generatingFiles === doc.key ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-navy" />
                          ) : (
                            <FileOutput size={12} />
                          )}
                          {generatingFiles === doc.key ? 'Generating...' : docState?.pdf_path ? 'Regenerate PDF & DOCX' : 'Generate PDF & DOCX'}
                        </button>

                        {/* PDF download */}
                        {docState?.pdf_path && (
                          <StorageDownloadButton
                            filePath={docState.pdf_path}
                            label="PDF"
                            fileName={`${doc.label.replace(/\s+/g, '_')}.pdf`}
                          />
                        )}

                        {/* DOCX download */}
                        {docState?.docx_path && (
                          <StorageDownloadButton
                            filePath={docState.docx_path}
                            label="DOCX"
                            fileName={`${doc.label.replace(/\s+/g, '_')}.docx`}
                          />
                        )}

                        {docState?.files_generated_at && (
                          <span className="font-inter text-xs text-secondary-text ml-auto">
                            Files generated {new Date(docState.files_generated_at).toLocaleString('en-GB')}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Document content viewer */}
                    {viewingDoc === doc.key && docState?.content_text && (
                      <div className="mt-4 border-t border-border pt-4">
                        <div
                          className="font-mono text-sm text-dark-text bg-off-white rounded-md p-5 overflow-y-auto whitespace-pre-wrap leading-[1.7]"
                          style={{ maxHeight: 500 }}
                        >
                          {docState.content_text}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Edit modal */}
          {editingDoc && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="font-inter font-semibold text-navy">
                    Edit: {DOCUMENT_TYPES.find(d => d.key === editingDoc)?.label}
                  </h3>
                  <button
                    onClick={() => setEditingDoc(null)}
                    className="text-secondary-text hover:text-navy transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-[60vh] font-mono text-sm text-dark-text bg-off-white rounded-md p-5 border border-border focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue resize-none leading-[1.7]"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
                  <button
                    onClick={() => setEditingDoc(null)}
                    className="font-inter text-sm font-medium text-navy border border-border rounded-md hover:bg-off-white transition-colors"
                    style={{ padding: '8px 20px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={editSaving}
                    className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                    style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                  >
                    {editSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Check size={16} />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Helper Components ──

function InfoCard({ label, value, detail, status }: {
  label: string;
  value: string;
  detail: string;
  status: 'success' | 'warning' | 'pending';
}) {
  const statusColors = {
    success: 'text-success',
    warning: 'text-amber-600',
    pending: 'text-secondary-text',
  };

  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <p className="font-inter text-xs text-secondary-text uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-inter font-semibold text-sm ${statusColors[status]}`}>{value}</p>
      <p className="font-inter text-xs text-secondary-text mt-1">{detail}</p>
    </div>
  );
}

function FieldValue({ field, value }: { field: FormField; value: any }) {
  if (field.type === 'single_choice' || field.type === 'short_text' || field.type === 'email' || field.type === 'phone' || field.type === 'url') {
    return <p className="font-inter text-secondary-text text-sm">{String(value)}</p>;
  }

  if (field.type === 'long_text') {
    return <p className="font-inter text-secondary-text text-sm whitespace-pre-line">{String(value)}</p>;
  }

  if (field.type === 'multi_select' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {value.map((v: string) => (
          <span key={v} className="font-inter text-xs bg-off-white text-navy px-2 py-1 rounded-md">
            {v}
          </span>
        ))}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <span className={`font-inter text-sm ${value === 'Yes' ? 'text-success' : 'text-secondary-text'}`}>
        {value === 'Yes' ? 'Confirmed' : 'Not confirmed'}
      </span>
    );
  }

  if (field.type === 'repeating_section' && Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        {value.map((item: Record<string, string>, i: number) => (
          <div key={i} className="bg-off-white rounded-md p-4 border border-border">
            <p className="font-inter font-medium text-navy text-xs mb-2">Service {i + 1}</p>
            {field.subFields?.map(sf => (
              <div key={sf.id} className="mb-2 last:mb-0">
                <span className="font-inter text-xs text-secondary-text">{sf.label}: </span>
                <span className="font-inter text-xs text-dark-text">{item[sf.id] || '—'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (field.type === 'file_upload') {
    return <p className="font-inter text-secondary-text text-xs italic">File uploaded (see Client Uploads tab)</p>;
  }

  return <p className="font-inter text-secondary-text text-sm">{JSON.stringify(value)}</p>;
}

function StorageDownloadButton({ filePath, label, fileName }: { filePath: string; label: string; fileName: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('generated-documents')
        .createSignedUrl(filePath, 3600);

      if (error || !data) {
        console.error('Download URL error:', error);
        return;
      }

      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="font-inter text-xs font-medium text-medium-blue border border-medium-blue/30 rounded-md hover:bg-medium-blue/5 transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
      style={{ padding: '6px 12px' }}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-medium-blue" />
      ) : (
        <Download size={12} />
      )}
      {label}
    </button>
  );
}
