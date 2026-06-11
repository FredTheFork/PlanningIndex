'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Download, AlertCircle, CheckCircle2, Clock, Send, Save, Globe,
  FileArchive, Upload, Link2, Settings, ExternalLink, Code,
  Monitor, Tablet, Smartphone, Maximize2, RefreshCw, AlertTriangle,
  Copy, Image, FileText, Sparkles, FolderOpen, Palette, Type, File, ClipboardCopy
} from 'lucide-react';

interface WebsiteCopyTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

interface WebsiteDelivery {
  id: string;
  user_id: string;
  website_zip_path: string | null;
  deployment_url: string | null;
  bolt_prompt: string | null;
  contact_form_access_key: string | null;
  delivery_type: 'zip_only' | 'hosted_preview' | 'both';
  hosting_instructions: string | null;
  delivered_by: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientBrief {
  id: string;
  client_id: string;
  brief_content: string;
  status: string;
  generated_at: string;
}

interface ClientAsset {
  question_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
}

interface BrandData {
  colours: string | null;
  font_style: string | null;
}

type DeliveryType = 'zip_only' | 'hosted_preview' | 'both';
type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const DEFAULT_HOSTING_INSTRUCTIONS = `## Hosting Your Website

### Option 1: Netlify (Recommended)
1. Create a free account at netlify.com
2. Drag and drop your website ZIP file to deploy
3. Your site will be live instantly with a netlify.app subdomain

### Option 2: Vercel
1. Create a free account at vercel.com
2. Import from GitHub or upload directly
3. Automatic SSL and global CDN included

### Option 3: Bolt.new Hosting
Your site is already deployed on Bolt.new. You can purchase a custom domain directly through their platform.

## Custom Domain Setup
1. Purchase a domain from Namecheap, Cloudflare, or GoDaddy
2. Add a CNAME record pointing to your hosting provider
3. SSL certificates are automatically provisioned

## Database Integration (Supabase)
If your site needs a database, user authentication, or file storage:
1. Create a free Supabase project at supabase.com
2. Copy your project URL and anon key
3. Add them as environment variables in your hosting platform`;

// Asset categories for organization
const ASSET_CATEGORIES = {
  logos: {
    label: 'Logos',
    icon: Image,
    questionIds: ['q66_logo_upload', 'wc_logo_upload'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  brand_guidelines: {
    label: 'Brand Guidelines',
    icon: FileText,
    questionIds: ['wc_brand_guidelines_upload'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  existing_content: {
    label: 'Existing Content',
    icon: File,
    questionIds: ['wc_existing_copy_upload', 'wc_existing_images_upload', 'q76_existing_docs_upload', 'q77_writing_samples_upload'],
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
};

export default function WebsiteCopyTab({ userId, data, refreshData }: WebsiteCopyTabProps) {
  const [delivery, setDelivery] = useState<WebsiteDelivery | null>(null);
  const [clientBrief, setClientBrief] = useState<ClientBrief | null>(null);
  const [clientAssets, setClientAssets] = useState<ClientAsset[]>([]);
  const [brandData, setBrandData] = useState<BrandData>({ colours: null, font_style: null });
  const [websitePagesSelected, setWebsitePagesSelected] = useState<string[]>([]);
  const [websitePageCount, setWebsitePageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBrief, setLoadingBrief] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [editing, setEditing] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  const [form, setForm] = useState({
    deployment_url: '',
    delivery_type: 'hosted_preview' as DeliveryType,
    contact_form_access_key: '',
    hosting_instructions: DEFAULT_HOSTING_INSTRUCTIONS,
    bolt_prompt: '',
  });

  useEffect(() => {
    fetchDelivery();
    fetchClientBrief();
    fetchClientAssets();
    fetchBrandData();
    fetchWebsitePages();
  }, [userId]);

  const fetchDelivery = async () => {
    setLoading(true);
    const { data: deliveryData, error } = await supabase
      .from('website_deliveries')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && deliveryData) {
      setDelivery(deliveryData);
      setForm({
        deployment_url: deliveryData.deployment_url || '',
        delivery_type: deliveryData.delivery_type || 'hosted_preview',
        contact_form_access_key: deliveryData.contact_form_access_key || '',
        hosting_instructions: deliveryData.hosting_instructions || DEFAULT_HOSTING_INSTRUCTIONS,
        bolt_prompt: deliveryData.bolt_prompt || '',
      });
    }
    setLoading(false);
  };

  const fetchClientBrief = async () => {
    setLoadingBrief(true);
    const { data: briefData, error } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId)
      .eq('service_id', 'website_copy_pack')
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && briefData) {
      setClientBrief(briefData);
    }
    setLoadingBrief(false);
  };

  const fetchClientAssets = async () => {
    setLoadingAssets(true);
    const { data: uploads, error } = await supabase
      .from('intake_uploads')
      .select('question_id, file_name, file_path, file_size, file_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && uploads) {
      setClientAssets(uploads);
    }
    setLoadingAssets(false);
  };

  const fetchBrandData = async () => {
    const { data: intakeData, error } = await supabase
      .from('intake_responses')
      .select('responses')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && intakeData?.responses) {
      const responses = intakeData.responses;
      setBrandData({
        colours: responses.q67_brand_colours || responses.wc_colour_preferences || null,
        font_style: responses.wc_font_style || null,
      });
    }
  };

  const fetchWebsitePages = async () => {
    const { data: servicesData, error } = await supabase
      .from('services_purchased')
      .select('website_pages_selected, website_page_count')
      .eq('user_id', userId)
      .eq('service_id', 'website_copy_pack')
      .eq('status', 'active')
      .maybeSingle();

    if (!error && servicesData) {
      setWebsitePagesSelected(servicesData.website_pages_selected || []);
      setWebsitePageCount(servicesData.website_page_count || null);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleSave = async () => {
    const deliveryData = {
      user_id: userId,
      deployment_url: form.deployment_url || null,
      delivery_type: form.delivery_type,
      contact_form_access_key: form.contact_form_access_key || null,
      hosting_instructions: form.hosting_instructions || null,
      bolt_prompt: form.bolt_prompt || null,
      updated_at: new Date().toISOString(),
    };

    if (delivery) {
      const { error } = await supabase
        .from('website_deliveries')
        .update(deliveryData)
        .eq('id', delivery.id);

      if (!error) {
        showMessage('Website delivery saved successfully', 'success');
        setEditing(false);
        setPreviewLoading(true);
        setPreviewError(false);
        await fetchDelivery();
        refreshData();
      } else {
        showMessage('Failed to save: ' + error.message, 'error');
      }
    } else {
      const { error } = await supabase
        .from('website_deliveries')
        .insert(deliveryData);

      if (!error) {
        showMessage('Website delivery created', 'success');
        setEditing(false);
        await fetchDelivery();
        refreshData();
      } else {
        showMessage('Failed to create: ' + error.message, 'error');
      }
    }
  };

  const handleZipUpload = async (file: File) => {
    setUploadingZip(true);
    try {
      const ext = file.name.split('.').pop() || 'zip';
      const timestamp = Date.now();
      const storagePath = `${userId}/website-${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('website-deliveries')
        .upload(storagePath, file, { contentType: 'application/zip', upsert: true });

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
        return;
      }

      if (delivery) {
        await supabase
          .from('website_deliveries')
          .update({
            website_zip_path: storagePath,
            updated_at: new Date().toISOString(),
          })
          .eq('id', delivery.id);
      } else {
        await supabase
          .from('website_deliveries')
          .insert({
            user_id: userId,
            website_zip_path: storagePath,
            delivery_type: 'zip_only',
          });
      }

      showMessage('ZIP uploaded successfully', 'success');
      await fetchDelivery();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingZip(false);
    }
  };

  const handleMarkDelivered = async () => {
    const now = new Date().toISOString();
    const { data: { user: adminUser } } = await supabase.auth.getUser();

    if (delivery) {
      const { error } = await supabase
        .from('website_deliveries')
        .update({
          delivered_by: adminUser?.id,
          delivered_at: now,
          updated_at: now,
        })
        .eq('id', delivery.id);

      if (!error) {
        showMessage('Website marked as delivered', 'success');
        await fetchDelivery();
        refreshData();
      }
    } else {
      showMessage('Please save the delivery settings first', 'error');
    }
  };

  const handleCopyFullPrompt = async () => {
    if (!delivery?.bolt_prompt && !clientBrief?.brief_content) {
      showMessage('No prompt or brief available to copy', 'error');
      return;
    }

    const sections: string[] = [];

    // Header context
    sections.push(`# Website Generation Package for ${data?.profile?.business_name || 'Client'}`);
    sections.push(`Generated: ${new Date().toLocaleString()}`);
    sections.push('');

    // Bolt Prompt section
    if (delivery?.bolt_prompt) {
      sections.push('---');
      sections.push('## BOLT PROMPT (Paste into Bolt.new)');
      sections.push('');
      sections.push(delivery.bolt_prompt);
      sections.push('');
    }

    // Client Brief section
    if (clientBrief?.brief_content) {
      sections.push('---');
      sections.push('## CLIENT BRIEF (Reference Context)');
      sections.push('');
      sections.push(clientBrief.brief_content);
      sections.push('');
    }

    // Brand context
    if (brandData.colours || brandData.font_style) {
      sections.push('---');
      sections.push('## BRAND SPECIFICATIONS');
      sections.push('');
      if (brandData.colours) {
        sections.push(`Colours: ${brandData.colours}`);
      }
      if (brandData.font_style) {
        sections.push(`Font Style: ${brandData.font_style}`);
      }
      sections.push('');
    }

    const fullContent = sections.join('\n');

    try {
      await navigator.clipboard.writeText(fullContent);
      showMessage('Full prompt package copied to clipboard', 'success');
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error');
    }
  };

  const handleGeneratePrompt = async () => {
    if (!data?.profile?.has_submitted_intake) {
      showMessage('Client must submit intake form first', 'error');
      return;
    }

    setGeneratingPrompt(true);
    showMessage('Generating Bolt prompt with AI...', 'info');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showMessage('Not authenticated', 'error');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-bolt-prompt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setForm(prev => ({ ...prev, bolt_prompt: result.prompt }));
        showMessage(`Prompt generated successfully using ${result.model}`, 'success');
        await fetchDelivery();
      } else {
        showMessage(result.error || 'Failed to generate prompt', 'error');
      }
    } catch (err: any) {
      showMessage(err.message || 'Error generating prompt', 'error');
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const getAssetDownloadUrl = (filePath: string): string => {
    const { data } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getZipDownloadUrl = (): string | null => {
    if (!delivery?.website_zip_path) return null;
    const { data } = supabase.storage
      .from('website-deliveries')
      .getPublicUrl(delivery.website_zip_path);
    return data.publicUrl;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isImageFile = (fileType: string): boolean => {
    return fileType.startsWith('image/');
  };

  const getAssetsByCategory = (categoryKey: string): ClientAsset[] => {
    const category = ASSET_CATEGORIES[categoryKey as keyof typeof ASSET_CATEGORIES];
    if (!category) return [];
    return clientAssets.filter(asset => category.questionIds.includes(asset.question_id));
  };

  const viewportIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const promptAvailable = delivery?.bolt_prompt || form.bolt_prompt;
  const briefAvailable = clientBrief?.brief_content;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Banner */}
      {message && (
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {messageType === 'success' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />}
          {messageType === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
          {messageType === 'info' && <Clock size={16} className="shrink-0 mt-0.5 text-blue-600" />}
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Website Production
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Single source of truth for website creation. Generate Bolt prompts, manage brand assets, and deliver completed sites.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {delivery?.delivered_at && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-inter font-medium">
                <CheckCircle2 size={14} />
                Delivered
              </span>
            )}
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-inter transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-lg text-sm font-inter font-medium transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-inter transition-colors"
              >
                Edit Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pages Ordered at Checkout */}
      {websitePagesSelected.length > 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Globe size={20} className="text-[#1B3F7A] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-inter font-semibold text-[#1B3F7A] mb-1">
                Pages Ordered at Checkout
              </h4>
              <div className="flex flex-wrap gap-2">
                {websitePagesSelected.map((page, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 bg-white border border-blue-200 rounded text-sm font-inter text-gray-700"
                  >
                    {page}
                  </span>
                ))}
              </div>
              {websitePageCount && (
                <p className="font-inter text-xs text-gray-600 mt-2">
                  Total pages: {websitePageCount}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : data?.purchasedServices?.some((ps: any) => ps.service_id === 'website_copy_pack' && ps.status === 'active') && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Globe size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-inter font-semibold text-amber-800 mb-1">
                Page Selections Not Recorded
              </h4>
              <p className="font-inter text-sm text-amber-700">
                This client purchased the Website Copy Pack but specific page selections were not captured at checkout. Contact the client to confirm which pages they need.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Bolt Prompt & Assets */}
        <div className="space-y-6">
          {/* Bolt Prompt Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Code size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-inter font-semibold text-gray-900">Bolt Prompt</h4>
                  <p className="text-xs text-gray-500">AI-generated prompt for Bolt.new</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {promptAvailable && (
                  <button
                    onClick={handleCopyFullPrompt}
                    disabled={!briefAvailable && !promptAvailable}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter transition-colors disabled:opacity-50"
                  >
                    <ClipboardCopy size={12} />
                    Copy Full Prompt
                  </button>
                )}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex gap-2 mb-4">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                briefAvailable ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {briefAvailable ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                Brief {briefAvailable ? 'Ready' : 'Pending'}
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                promptAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
              }`}>
                {promptAvailable ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                Prompt {promptAvailable ? 'Ready' : 'Not Generated'}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mb-4">
              <button
                onClick={handleGeneratePrompt}
                disabled={generatingPrompt || !data?.profile?.has_submitted_intake}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPrompt ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    {promptAvailable ? 'Regenerate Prompt' : 'Generate Bolt Prompt'}
                  </>
                )}
              </button>
              {!data?.profile?.has_submitted_intake && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Client must submit intake form before generating prompt
                </p>
              )}
            </div>

            {editing ? (
              <textarea
                value={form.bolt_prompt}
                onChange={(e) => setForm({ ...form, bolt_prompt: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-gray-900 border-0 rounded-lg text-sm text-green-400 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="// Bolt.new prompt will appear here after generation..."
              />
            ) : (
              <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                  {promptAvailable || '// No prompt recorded. Click "Generate Bolt Prompt" above'}
                </pre>
              </div>
            )}
          </div>

          {/* Brand Assets Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FolderOpen size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-gray-900">Brand Assets</h4>
                <p className="text-xs text-gray-500">All design resources for website production</p>
              </div>
            </div>

            {loadingAssets ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
              </div>
            ) : clientAssets.length > 0 || brandData.colours || brandData.font_style ? (
              <div className="space-y-4">
                {/* Brand Colours */}
                {brandData.colours && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette size={16} className="text-pink-600" />
                      <span className="text-sm font-medium text-gray-900">Brand Colours</span>
                    </div>
                    <p className="text-sm text-gray-700">{brandData.colours}</p>
                  </div>
                )}

                {/* Font Style */}
                {brandData.font_style && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Type size={16} className="text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">Font Style Preference</span>
                    </div>
                    <p className="text-sm text-gray-700">{brandData.font_style}</p>
                  </div>
                )}

                {/* File Assets by Category */}
                {Object.entries(ASSET_CATEGORIES).map(([key, category]) => {
                  const assets = getAssetsByCategory(key);
                  if (assets.length === 0) return null;

                  const Icon = category.icon;

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 ${category.bgColor} rounded`}>
                          <Icon size={14} className={category.color} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{category.label}</span>
                      </div>
                      <div className="space-y-1 pl-7">
                        {assets.map((asset, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <div className="flex items-center gap-2">
                              {isImageFile(asset.file_type) ? (
                                <Image size={14} className="text-blue-500" />
                              ) : (
                                <FileText size={14} className="text-gray-500" />
                              )}
                              <div>
                                <p className="text-xs font-medium text-gray-900">{asset.file_name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(asset.file_size)}</p>
                              </div>
                            </div>
                            <a
                              href={getAssetDownloadUrl(asset.file_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                            >
                              <Download size={10} />
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">No brand assets uploaded</p>
              </div>
            )}
          </div>

          {/* Deployment URL Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Globe size={20} className="text-[#1B3F7A]" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-gray-900">Deployment URL</h4>
                <p className="text-xs text-gray-500">The live Bolt.new deployed site URL</p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-3">
                <input
                  type="url"
                  value={form.deployment_url}
                  onChange={(e) => setForm({ ...form, deployment_url: e.target.value })}
                  placeholder="https://your-site.bolt.new or https://yourdomain.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50"
                />
                <p className="text-xs text-gray-500">
                  Enter the full URL where the website is deployed (Bolt.new, Netlify, Vercel, or custom domain)
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                {delivery?.deployment_url ? (
                  <a
                    href={delivery.deployment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#1B3F7A] hover:underline text-sm font-inter"
                  >
                    <Link2 size={14} />
                    {delivery.deployment_url}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">No URL configured</span>
                )}
              </div>
            )}
          </div>

          {/* ZIP Upload Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <FileArchive size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-gray-900">Source Files</h4>
                <p className="text-xs text-gray-500">Upload the website ZIP for client download</p>
              </div>
            </div>

            {delivery?.website_zip_path ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileArchive size={24} className="text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {delivery.website_zip_path.split('/').pop()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(delivery.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={getZipDownloadUrl() || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-lg text-sm font-inter transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </a>
                    {editing && (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-inter transition-colors">
                        <RefreshCw size={14} />
                        Replace
                        <input
                          type="file"
                          accept=".zip,application/zip"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleZipUpload(file);
                          }}
                          className="hidden"
                          disabled={uploadingZip}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleZipUpload(file);
                  }}
                  className="hidden"
                  id="zip-upload"
                  disabled={uploadingZip}
                />
                <label htmlFor="zip-upload" className="cursor-pointer">
                  <Upload size={32} className={`mx-auto mb-3 ${uploadingZip ? 'text-gray-300 animate-pulse' : 'text-gray-400'}`} />
                  <p className="font-inter text-sm text-gray-600 mb-1">
                    {uploadingZip ? 'Uploading...' : 'Click to upload ZIP file'}
                  </p>
                  <p className="text-xs text-gray-400">Max 100MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Delivery Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-inter font-semibold text-gray-900">Delivery Settings</h4>
                <p className="text-xs text-gray-500">Configure how the website is delivered to the client</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Type
                </label>
                {editing ? (
                  <select
                    value={form.delivery_type}
                    onChange={(e) => setForm({ ...form, delivery_type: e.target.value as DeliveryType })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50"
                  >
                    <option value="hosted_preview">Hosted Preview (iframe embed)</option>
                    <option value="zip_only">ZIP Download Only</option>
                    <option value="both">Both Preview and ZIP</option>
                  </select>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">
                      {delivery?.delivery_type === 'hosted_preview' && 'Hosted Preview'}
                      {delivery?.delivery_type === 'zip_only' && 'ZIP Download Only'}
                      {delivery?.delivery_type === 'both' && 'Both Preview and ZIP'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Form Access Key
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={form.contact_form_access_key}
                    onChange={(e) => setForm({ ...form, contact_form_access_key: e.target.value })}
                    placeholder="web3forms or formspree access key"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-mono">
                      {delivery?.contact_form_access_key || 'Not configured'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hosting Instructions for Client
                </label>
                {editing ? (
                  <textarea
                    value={form.hosting_instructions}
                    onChange={(e) => setForm({ ...form, hosting_instructions: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50 resize-none"
                    placeholder="Markdown supported..."
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                    <div className="text-sm">
                      <MarkdownContent content={delivery?.hosting_instructions || ''} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deliver Action */}
          {delivery && !delivery.delivered_at && (
            <button
              onClick={handleMarkDelivered}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-inter font-medium transition-colors"
            >
              <Send size={16} />
              Mark as Delivered to Client
            </button>
          )}
        </div>

        {/* Right: Live Preview */}
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-[#1B3F7A]" />
              <h4 className="font-inter font-semibold text-gray-900">
                Live Website Preview
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {/* Viewport toggles */}
              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                {(Object.keys(VIEWPORT_WIDTHS) as ViewportSize[]).map((v) => {
                  const Icon = viewportIcons[v];
                  return (
                    <button
                      key={v}
                      onClick={() => setPreviewViewport(v)}
                      className={`p-1.5 transition-colors ${
                        previewViewport === v ? 'bg-[#1B3F7A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      title={`View as ${v}`}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                  isFullscreen ? 'text-[#1B3F7A]' : 'text-gray-600'
                }`}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div
            className={`bg-gray-100 overflow-auto transition-all duration-200 ${
              isFullscreen ? 'h-[calc(100vh-52px)]' : 'h-[600px]'
            }`}
          >
            {delivery?.deployment_url && isValidUrl(delivery.deployment_url) ? (
              <div
                className="mx-auto bg-white shadow-lg min-h-full"
                style={{
                  width: VIEWPORT_WIDTHS[previewViewport],
                  maxWidth: '100%',
                }}
              >
                {previewLoading && (
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A] mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Loading preview...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={delivery.deployment_url}
                  className={`w-full h-full min-h-[600px] ${previewLoading ? 'hidden' : ''}`}
                  onLoad={() => setPreviewLoading(false)}
                  onError={() => setPreviewError(true)}
                  title="Website Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
                {previewError && (
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="text-center p-6 max-w-md">
                      <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
                      <h5 className="font-inter font-semibold text-gray-900 mb-2">Preview Unavailable</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        This website may have restrictions that prevent iframe embedding.
                        Click below to open the site directly.
                      </p>
                      <a
                        href={delivery.deployment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-lg text-sm font-inter transition-colors"
                      >
                        <ExternalLink size={14} />
                        Open Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px]">
                <div className="text-center p-6 max-w-md">
                  <Globe size={48} className="mx-auto mb-4 text-gray-300" />
                  <h5 className="font-inter font-semibold text-gray-900 mb-2">
                    No Preview Available
                  </h5>
                  <p className="text-sm text-gray-600">
                    {delivery?.deployment_url
                      ? 'Enter a valid deployment URL to see the live preview'
                      : 'Add a deployment URL and save to enable the live website preview'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown renderer for hosting instructions
function MarkdownContent({ content }: { content: string }) {
  if (!content) {
    return <span className="text-gray-400">No instructions provided</span>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h4 key={index} className="font-semibold text-[#1B3F7A] mt-3">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={index} className="font-bold text-[#1B3F7A] text-base mt-4">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <p key={index} className="ml-4 text-gray-700">{line}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-700">{line}</p>;
      })}
    </div>
  );
}
