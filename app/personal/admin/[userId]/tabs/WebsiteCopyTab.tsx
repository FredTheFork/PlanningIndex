'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Download, AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronUp, Send, X, Copy, CreditCard as Edit3, Save, Globe, FileText, Eye, EyeOff, Monitor, Tablet, Smartphone, Maximize2, Code, FileArchive, Upload, Link2, Settings, ExternalLink, Info } from 'lucide-react';
import {
  HomepageTemplate, AboutTemplate, ServicesTemplate, ContactTemplate,
  PreviewFrame
} from '@/components/website-preview';
import type { HomepageContent } from '@/components/website-preview/templates/HomepageTemplate';
import type { AboutContent } from '@/components/website-preview/templates/AboutTemplate';
import type { ServicesContent } from '@/components/website-preview/templates/ServicesTemplate';
import type { ContactContent } from '@/components/website-preview/templates/ContactTemplate';

interface WebsiteCopyTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

interface WebsitePage {
  id: string;
  user_id: string;
  page_type: 'homepage' | 'about' | 'services' | 'contact';
  content_json: any;
  tsx_code: string | null;
  status: 'pending' | 'generated' | 'edited' | 'delivered';
  delivered_to_client: boolean;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  website_zip_path: string | null;
  deployment_url: string | null;
  bolt_prompt: string | null;
  contact_form_access_key: string | null;
  delivery_type: 'zip_only' | 'hosted_preview' | 'both';
  hosting_instructions: string | null;
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

type PageType = 'homepage' | 'about' | 'services' | 'contact';
type DeliveryType = 'zip_only' | 'hosted_preview' | 'both';

const PAGE_CONFIG: Record<PageType, { label: string; description: string; icon: React.ElementType }> = {
  homepage: { label: 'Homepage', description: 'Hero, benefits, social proof, and CTA', icon: Globe },
  about: { label: 'About Page', description: 'Story, values, team, and positioning', icon: FileText },
  services: { label: 'Services Page', description: 'Service descriptions and pricing', icon: FileText },
  contact: { label: 'Contact Page', description: 'Contact details, hours, and form', icon: FileText },
};

// Default content structures for new pages
const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: { headline: 'Your Headline Here', subheadline: 'Your compelling subheadline.', ctaText: 'Get Started' },
  benefits: [
    { title: 'Benefit One', description: 'Description of your first benefit.' },
    { title: 'Benefit Two', description: 'Description of your second benefit.' },
    { title: 'Benefit Three', description: 'Description of your third benefit.' },
  ],
  socialProof: { type: 'testimonial', headline: 'What Our Clients Say', testimonial: { quote: 'Testimonial quote here.', author: 'Client Name', role: 'Role' } },
  finalCta: { headline: 'Ready to Get Started?', body: 'Take the next step today.', buttonText: 'Contact Us' },
};

const DEFAULT_ABOUT: AboutContent = {
  opening: 'A brief opening statement about your business philosophy.',
  story: 'The story of how your business came to be...',
  values: [
    { title: 'Value One', description: 'What this value means to us.' },
    { title: 'Value Two', description: 'What this value means to us.' },
  ],
  whyWorkWithUs: [
    { reason: 'Reason to choose us', outcome: 'The outcome clients can expect.' },
  ],
  cta: 'Ready to work together?',
};

const DEFAULT_SERVICES: ServicesContent = {
  intro: 'Introduction to your services.',
  services: [
    { name: 'Service Name', description: 'Service description.', included: ['Item 1', 'Item 2'], outcome: 'Expected outcome.', investment: 'From £XXX' },
  ],
  cta: { text: 'Ready to start?', action: 'Get a Quote' },
};

const DEFAULT_CONTACT: ContactContent = {
  heading: 'Get in Touch',
  welcomeText: 'We would love to hear from you.',
  howToReach: { email: 'hello@example.com', phone: '+44 XXXX XXXXXX', businessHours: 'Mon-Fri, 9am-5pm' },
  whatHappensNext: 'After you reach out, we will respond within 24 hours.',
};

export default function WebsiteCopyTab({ userId, data, refreshData }: WebsiteCopyTabProps) {
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [delivery, setDelivery] = useState<WebsiteDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [activePage, setActivePage] = useState<PageType>('homepage');
  const [editingPage, setEditingPage] = useState<PageType | null>(null);
  const [editContent, setEditContent] = useState<any>({});
  const [showPreview, setShowPreview] = useState(true);
  const [copiedPageId, setCopiedPageId] = useState<string | null>(null);
  const [uploadingZip, setUploadingZip] = useState(false);
  const [showDeliveryPanel, setShowDeliveryPanel] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<{
    delivery_type: DeliveryType;
    deployment_url: string;
    contact_form_access_key: string;
    hosting_instructions: string;
    bolt_prompt: string;
  }>({
    delivery_type: 'zip_only',
    deployment_url: '',
    contact_form_access_key: '',
    hosting_instructions: '',
    bolt_prompt: '',
  });

  const brandColors = {
    primary: '#1B3F7A',
    secondary: '#2C68C4',
    accent: '#FF8C42',
  };

  useEffect(() => {
    fetchPages();
    fetchDelivery();
  }, [userId]);

  const fetchPages = async () => {
    setLoading(true);
    const { data: pagesData, error } = await supabase
      .from('website_page_contents')
      .select('*')
      .eq('user_id', userId);

    if (!error && pagesData) {
      setPages(pagesData);
    }
    setLoading(false);
  };

  const fetchDelivery = async () => {
    const { data: deliveryData, error } = await supabase
      .from('website_deliveries')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && deliveryData) {
      setDelivery(deliveryData);
      setDeliveryForm({
        delivery_type: deliveryData.delivery_type || 'zip_only',
        deployment_url: deliveryData.deployment_url || '',
        contact_form_access_key: deliveryData.contact_form_access_key || '',
        hosting_instructions: deliveryData.hosting_instructions || '',
        bolt_prompt: deliveryData.bolt_prompt || '',
      });
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const getPage = (pageType: PageType): WebsitePage | undefined => {
    return pages.find(p => p.page_type === pageType);
  };

  const getPageContent = (pageType: PageType): any => {
    const page = getPage(pageType);
    if (page?.content_json && Object.keys(page.content_json).length > 0) {
      return page.content_json;
    }

    // Return default content based on page type
    switch (pageType) {
      case 'homepage': return DEFAULT_HOMEPAGE;
      case 'about': return DEFAULT_ABOUT;
      case 'services': return DEFAULT_SERVICES;
      case 'contact': return DEFAULT_CONTACT;
    }
  };

  const handleCopyContent = useCallback(async (pageType: PageType) => {
    const content = getPageContent(pageType);
    try {
      await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
      setCopiedPageId(pageType);
      setTimeout(() => setCopiedPageId(null), 2000);
    } catch {
      showMessage('Failed to copy content', 'error');
    }
  }, [pages]);

  const handleSavePage = async (pageType: PageType) => {
    const existingPage = getPage(pageType);

    if (existingPage) {
      const { error } = await supabase
        .from('website_page_contents')
        .update({
          content_json: editContent,
          status: 'edited',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPage.id);

      if (!error) {
        showMessage(`${PAGE_CONFIG[pageType].label} updated`, 'success');
        setEditingPage(null);
        await fetchPages();
      } else {
        showMessage('Failed to update page', 'error');
      }
    } else {
      const { error } = await supabase
        .from('website_page_contents')
        .insert({
          user_id: userId,
          page_type: pageType,
          content_json: editContent,
          status: 'edited',
        });

      if (!error) {
        showMessage(`${PAGE_CONFIG[pageType].label} created`, 'success');
        setEditingPage(null);
        await fetchPages();
      } else {
        showMessage('Failed to create page', 'error');
      }
    }
  };

  const handleMarkDelivered = async (pageId: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('website_page_contents')
      .update({
        delivered_to_client: true,
        delivered_at: now,
        status: 'delivered',
        updated_at: now,
      })
      .eq('id', pageId);

    if (!error) {
      showMessage('Page marked as delivered', 'success');
      await fetchPages();
      refreshData();
    }
  };

  const handleMarkAllDelivered = async () => {
    const undeliveredPages = pages.filter(p => !p.delivered_to_client);
    if (undeliveredPages.length === 0) {
      showMessage('All pages already delivered', 'info');
      return;
    }

    const now = new Date().toISOString();
    const { error } = await supabase
      .from('website_page_contents')
      .update({
        delivered_to_client: true,
        delivered_at: now,
        status: 'delivered',
        updated_at: now,
      })
      .in('id', undeliveredPages.map(p => p.id));

    if (!error) {
      showMessage(`${undeliveredPages.length} pages marked as delivered`, 'success');
      await fetchPages();
      refreshData();
    }
  };

  const handleDownloadHtml = (pageType: PageType) => {
    const content = getPageContent(pageType);
    // Generate a simple HTML representation
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${PAGE_CONFIG[pageType].label}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1, h2, h3 { color: #1B3F7A; }
  </style>
</head>
<body>
<pre>${JSON.stringify(content, null, 2)}</pre>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageType}-copy.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      // Update or create delivery record
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

      showMessage('Website zip uploaded successfully', 'success');
      await fetchDelivery();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingZip(false);
    }
  };

  const handleSaveDelivery = async () => {
    const deliveryData = {
      user_id: userId,
      delivery_type: deliveryForm.delivery_type,
      deployment_url: deliveryForm.deployment_url || null,
      contact_form_access_key: deliveryForm.contact_form_access_key || null,
      hosting_instructions: deliveryForm.hosting_instructions || null,
      bolt_prompt: deliveryForm.bolt_prompt || null,
      updated_at: new Date().toISOString(),
    };

    if (delivery) {
      const { error } = await supabase
        .from('website_deliveries')
        .update(deliveryData)
        .eq('id', delivery.id);

      if (!error) {
        showMessage('Delivery settings saved', 'success');
        setEditingDelivery(false);
        await fetchDelivery();
      } else {
        showMessage('Failed to save delivery settings', 'error');
      }
    } else {
      const { error } = await supabase
        .from('website_deliveries')
        .insert(deliveryData);

      if (!error) {
        showMessage('Delivery created', 'success');
        setEditingDelivery(false);
        await fetchDelivery();
      } else {
        showMessage('Failed to create delivery', 'error');
      }
    }
  };

  const handleMarkWebsiteDelivered = async () => {
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
        showMessage('Website marked as delivered to client', 'success');
        await fetchDelivery();
        refreshData();
      }
    } else {
      showMessage('Please upload website files first', 'error');
    }
  };

  const getZipDownloadUrl = (): string | null => {
    if (!delivery?.website_zip_path) return null;
    const { data } = supabase.storage
      .from('website-deliveries')
      .getPublicUrl(delivery.website_zip_path);
    return data.publicUrl;
  };

  // Stats
  const generatedCount = pages.filter(p => p.status === 'generated' || p.status === 'edited').length;
  const deliveredCount = pages.filter(p => p.delivered_to_client).length;

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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Website Copy
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Manage your website pages and preview live.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-[#1B3F7A]">{pages.length}</div>
              <div className="font-inter text-gray-500 text-xs">Pages</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-amber-600">{generatedCount}</div>
              <div className="font-inter text-gray-500 text-xs">Generated</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{deliveredCount}</div>
              <div className="font-inter text-gray-500 text-xs">Delivered</div>
            </div>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {(Object.keys(PAGE_CONFIG) as PageType[]).map((pageType) => {
            const config = PAGE_CONFIG[pageType];
            const Icon = config.icon;
            const page = getPage(pageType);
            const isActive = activePage === pageType;

            return (
              <button
                key={pageType}
                onClick={() => setActivePage(pageType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-inter font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1B3F7A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {config.label}
                {page?.delivered_to_client && (
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                )}
              </button>
            );
          })}

          {/* Deliver All button */}
          {deliveredCount < 4 && pages.length > 0 && (
            <button
              onClick={handleMarkAllDelivered}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-inter font-medium transition-colors"
            >
              <Send size={14} />
              Deliver All ({4 - deliveredCount} remaining)
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h4 className="font-inter font-semibold text-gray-900">
              {PAGE_CONFIG[activePage].label} Content
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyContent(activePage)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
              >
                {copiedPageId === activePage ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copiedPageId === activePage ? 'Copied' : 'Copy JSON'}
              </button>
              <button
                onClick={() => handleDownloadHtml(activePage)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
              >
                <Download size={14} />
                HTML
              </button>
              {editingPage === activePage ? (
                <>
                  <button
                    onClick={() => handleSavePage(activePage)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter transition-colors"
                  >
                    <Save size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPage(null);
                      setEditContent({});
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingPage(activePage);
                    setEditContent(getPageContent(activePage));
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-4 max-h-[600px] overflow-y-auto">
            {editingPage === activePage ? (
              <ContentEditor
                pageType={activePage}
                content={editContent}
                onChange={setEditContent}
              />
            ) : (
              <div className="space-y-4">
                <ContentDisplay pageType={activePage} content={getPageContent(activePage)} />
              </div>
            )}
          </div>

          {/* Deliver button */}
          {(() => {
            const page = getPage(activePage);
            if (page && !page.delivered_to_client) {
              return (
                <div className="px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={() => handleMarkDelivered(page.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-inter font-medium transition-colors"
                  >
                    <Send size={16} />
                    Deliver to Client
                  </button>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h4 className="font-inter font-semibold text-gray-900">Live Preview</h4>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? 'Hide' : 'Show'}
            </button>
          </div>

          {showPreview && (
            <div className="p-4">
              <PreviewFrame title={PAGE_CONFIG[activePage].label}>
                <PagePreview pageType={activePage} content={getPageContent(activePage)} brandColors={brandColors} />
              </PreviewFrame>
            </div>
          )}
        </div>
      </div>

      {/* Website Delivery Panel */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => setShowDeliveryPanel(!showDeliveryPanel)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileArchive size={18} className="text-[#1B3F7A]" />
            <h4 className="font-inter font-semibold text-gray-900">Website Delivery</h4>
            {delivery?.delivered_at && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-inter">
                <CheckCircle2 size={12} />
                Delivered
              </span>
            )}
          </div>
          {showDeliveryPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showDeliveryPanel && (
          <div className="px-4 pb-4 border-t border-gray-200 pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Upload & Files */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website ZIP File
                  </label>
                  {delivery?.website_zip_path ? (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{delivery.website_zip_path.split('/').pop()}</span>
                        <a
                          href={getZipDownloadUrl() || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs transition-colors"
                        >
                          <Download size={12} />
                          Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".zip,application/zip,application/x-zip-compressed"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleZipUpload(file);
                        }}
                        className="hidden"
                        id="zip-upload"
                        disabled={uploadingZip}
                      />
                      <label
                        htmlFor="zip-upload"
                        className={`cursor-pointer ${uploadingZip ? 'opacity-50' : ''}`}
                      >
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadingZip ? 'Uploading...' : 'Click to upload ZIP file'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Max 100MB</p>
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Type
                  </label>
                  <select
                    value={deliveryForm.delivery_type}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_type: e.target.value as DeliveryType })}
                    disabled={!editingDelivery}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50 disabled:bg-gray-50"
                  >
                    <option value="zip_only">ZIP file only</option>
                    <option value="hosted_preview">Hosted preview only</option>
                    <option value="both">Both ZIP and hosted preview</option>
                  </select>
                </div>
              </div>

              {/* Right: Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Link2 size={14} />
                      Deployment URL
                    </div>
                  </label>
                  {editingDelivery ? (
                    <input
                      type="url"
                      value={deliveryForm.deployment_url}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, deployment_url: e.target.value })}
                      placeholder="https://your-site.bolt.new"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {delivery?.deployment_url ? (
                        <a
                          href={delivery.deployment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#1B3F7A] hover:underline flex items-center gap-1"
                        >
                          {delivery.deployment_url}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Settings size={14} />
                      Contact Form Access Key
                    </div>
                  </label>
                  {editingDelivery ? (
                    <input
                      type="text"
                      value={deliveryForm.contact_form_access_key}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, contact_form_access_key: e.target.value })}
                      placeholder="web3forms access key"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600 font-mono">
                        {delivery?.contact_form_access_key || 'Not set'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Info size={14} />
                      Hosting Instructions
                    </div>
                  </label>
                  {editingDelivery ? (
                    <textarea
                      value={deliveryForm.hosting_instructions}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, hosting_instructions: e.target.value })}
                      placeholder="Instructions for the client on how to deploy..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50 resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {delivery?.hosting_instructions || 'No instructions provided'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bolt Prompt Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-1.5">
                  <Code size={14} />
                  Bolt Prompt (for re-generation)
                </div>
              </label>
              {editingDelivery ? (
                <textarea
                  value={deliveryForm.bolt_prompt}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, bolt_prompt: e.target.value })}
                  placeholder="Original prompt used to generate the website in Bolt..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50 font-mono resize-none"
                />
              ) : (
                <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                    {delivery?.bolt_prompt || 'No prompt recorded'}
                  </pre>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {delivery?.delivered_at && (
                  <span>Delivered on {new Date(delivery.delivered_at).toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingDelivery ? (
                  <>
                    <button
                      onClick={() => setEditingDelivery(false)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-inter transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDelivery}
                      className="px-3 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-sm font-inter transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingDelivery(true)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-inter transition-colors"
                    >
                      Edit Settings
                    </button>
                    {delivery && !delivery.delivered_at && (
                      <button
                        onClick={handleMarkWebsiteDelivered}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-inter transition-colors"
                      >
                        <Send size={14} />
                        Mark Delivered
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Content Editor ─────────────────────────────────────────────────────────────

function ContentEditor({ pageType, content, onChange }: { pageType: PageType; content: any; onChange: (content: any) => void }) {
  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current: any = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    onChange(newContent);
  };

  const handleArrayChange = (path: string, index: number, field: string, value: string) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current: any = newContent;

    for (let i = 0; i < keys.length; i++) {
      current[keys[i]] = Array.isArray(current[keys[i]])
        ? [...current[keys[i]]]
        : { ...current[keys[i]] };
      current = current[keys[i]];
    }

    if (Array.isArray(current) && current[index]) {
      current[index] = { ...current[index], [field]: value };
    }

    onChange(newContent);
  };

  const addArrayItem = (path: string, template: any) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current: any = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = [...(current[keys[keys.length - 1]] || []), template];
    onChange(newContent);
  };

  return (
    <div className="space-y-4">
      {pageType === 'homepage' && (
        <>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Hero Section</h5>
            <div className="space-y-3">
              <InputField label="Headline" value={content.hero?.headline || ''} onChange={(v) => handleChange('hero.headline', v)} />
              <TextareaField label="Subheadline" value={content.hero?.subheadline || ''} onChange={(v) => handleChange('hero.subheadline', v)} />
              <InputField label="CTA Button Text" value={content.hero?.ctaText || ''} onChange={(v) => handleChange('hero.ctaText', v)} />
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Benefits</h5>
            {(content.benefits || []).map((benefit: any, i: number) => (
              <div key={i} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0">
                <InputField label={`Benefit ${i + 1} Title`} value={benefit.title || ''} onChange={(v) => handleArrayChange('benefits', i, 'title', v)} />
                <TextareaField label="Description" value={benefit.description || ''} onChange={(v) => handleArrayChange('benefits', i, 'description', v)} />
              </div>
            ))}
            <button
              onClick={() => addArrayItem('benefits', { title: 'New Benefit', description: 'Description' })}
              className="text-sm text-[#1B3F7A] hover:underline"
            >
              + Add Benefit
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Final CTA</h5>
            <InputField label="Headline" value={content.finalCta?.headline || ''} onChange={(v) => handleChange('finalCta.headline', v)} />
            <TextareaField label="Body" value={content.finalCta?.body || ''} onChange={(v) => handleChange('finalCta.body', v)} />
            <InputField label="Button Text" value={content.finalCta?.buttonText || ''} onChange={(v) => handleChange('finalCta.buttonText', v)} />
          </div>
        </>
      )}

      {pageType === 'about' && (
        <>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Opening Statement</h5>
            <TextareaField label="" value={content.opening || ''} onChange={(v) => handleChange('opening', v)} placeholder="A brief opening statement..." />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Story</h5>
            <TextareaField label="" value={content.story || ''} onChange={(v) => handleChange('story', v)} rows={6} placeholder="The story of how your business came to be..." />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Values</h5>
            {(content.values || []).map((value: any, i: number) => (
              <div key={i} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0">
                <InputField label={`Value ${i + 1} Title`} value={value.title || ''} onChange={(v) => handleArrayChange('values', i, 'title', v)} />
                <TextareaField label="Description" value={value.description || ''} onChange={(v) => handleArrayChange('values', i, 'description', v)} />
              </div>
            ))}
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Final CTA</h5>
            <TextareaField label="" value={content.cta || ''} onChange={(v) => handleChange('cta', v)} />
          </div>
        </>
      )}

      {pageType === 'services' && (
        <>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Introduction</h5>
            <TextareaField label="" value={content.intro || ''} onChange={(v) => handleChange('intro', v)} />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Services</h5>
            {(content.services || []).map((service: any, i: number) => (
              <div key={i} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
                <InputField label={`Service ${i + 1} Name`} value={service.name || ''} onChange={(v) => handleArrayChange('services', i, 'name', v)} />
                <TextareaField label="Description" value={service.description || ''} onChange={(v) => handleArrayChange('services', i, 'description', v)} />
                <InputField label="Investment" value={service.investment || ''} onChange={(v) => handleArrayChange('services', i, 'investment', v)} />
                <InputField label="Outcome" value={service.outcome || ''} onChange={(v) => handleArrayChange('services', i, 'outcome', v)} />
              </div>
            ))}
          </div>
        </>
      )}

      {pageType === 'contact' && (
        <>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Header</h5>
            <InputField label="Heading" value={content.heading || ''} onChange={(v) => handleChange('heading', v)} />
            <TextareaField label="Welcome Text" value={content.welcomeText || ''} onChange={(v) => handleChange('welcomeText', v)} />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Contact Details</h5>
            <InputField label="Email" value={content.howToReach?.email || ''} onChange={(v) => handleChange('howToReach.email', v)} />
            <InputField label="Phone" value={content.howToReach?.phone || ''} onChange={(v) => handleChange('howToReach.phone', v)} />
            <InputField label="Business Hours" value={content.howToReach?.businessHours || ''} onChange={(v) => handleChange('howToReach.businessHours', v)} />
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Next Steps</h5>
            <TextareaField label="What Happens Next" value={content.whatHappensNext || ''} onChange={(v) => handleChange('whatHappensNext', v)} />
          </div>
        </>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-2">
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div className="mb-2">
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1B3F7A] focus:ring-opacity-50 resize-none"
      />
    </div>
  );
}

// ── Content Display ───────────────────────────────────────────────────────────

function ContentDisplay({ pageType, content }: { pageType: PageType; content: any }) {
  return (
    <div className="space-y-3">
      {pageType === 'homepage' && (
        <>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Hero Headline</p>
            <p className="text-sm font-medium text-gray-800">{content.hero?.headline}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Subheadline</p>
            <p className="text-sm text-gray-600">{content.hero?.subheadline}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Benefits ({content.benefits?.length || 0})</p>
            {(content.benefits || []).map((b: any, i: number) => (
              <div key={i} className="mb-2 text-sm">
                <span className="font-medium">{b.title}:</span> <span className="text-gray-600">{b.description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {pageType === 'about' && (
        <>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Opening</p>
            <p className="text-sm text-gray-600">{content.opening}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Story</p>
            <p className="text-sm text-gray-600 line-clamp-3">{content.story}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Values ({content.values?.length || 0})</p>
            {(content.values || []).map((v: any, i: number) => (
              <div key={i} className="mb-2 text-sm">
                <span className="font-medium">{v.title}:</span> <span className="text-gray-600">{v.description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {pageType === 'services' && (
        <>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Introduction</p>
            <p className="text-sm text-gray-600">{content.intro}</p>
          </div>
          {(content.services || []).map((s: any, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Service {i + 1}</p>
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-gray-600 mt-1">{s.description}</p>
              {s.investment && <p className="text-xs text-[#FF8C42] mt-1">{s.investment}</p>}
            </div>
          ))}
        </>
      )}

      {pageType === 'contact' && (
        <>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Heading</p>
            <p className="text-sm font-medium text-gray-800">{content.heading}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-600">{content.howToReach?.email}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="text-sm text-gray-600">{content.howToReach?.phone}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Business Hours</p>
            <p className="text-sm text-gray-600">{content.howToReach?.businessHours}</p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Page Preview ──────────────────────────────────────────────────────────────

function PagePreview({ pageType, content, brandColors }: { pageType: PageType; content: any; brandColors: any }) {
  switch (pageType) {
    case 'homepage':
      return <HomepageTemplate content={content} brandColors={brandColors} />;
    case 'about':
      return <AboutTemplate content={content} brandColors={brandColors} />;
    case 'services':
      return <ServicesTemplate content={content} brandColors={brandColors} />;
    case 'contact':
      return <ContactTemplate content={content} brandColors={brandColors} />;
  }
}
