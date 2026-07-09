'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { AutoDeleteWarning } from '@/components/ui/AutoDeleteWarning';
import { WebsitePreviewSkeleton } from '@/components/ui/skeletons';
import { Globe, Download, ExternalLink, AlertTriangle, CheckCircle2, FileCode, Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';

interface WebsiteDelivery {
  id: string;
  deployment_url: string | null;
  website_zip_path: string | null;
  hosting_instructions: string | null;
  delivered_at: string | null;
  delivery_type: 'zip_only' | 'hosted_preview' | 'both';
  auto_delete_at?: string | null;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function PersonalWebsitePage() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const [delivery, setDelivery] = useState<WebsiteDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewViewport, setPreviewViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  const hasWebsiteCopyPack = purchasedServiceIds.includes('website_copy_pack');

  useEffect(() => {
    if (!user) return;
    fetchDelivery();
  }, [user]);

  const fetchDelivery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('website_deliveries')
        .select('id, deployment_url, website_zip_path, hosting_instructions, delivered_at, delivery_type, auto_delete_at')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (!error && data) {
        setDelivery(data);
      }
    } catch (err) {
      console.error('Error fetching website delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  const getZipDownloadUrl = (): string | null => {
    if (!delivery?.website_zip_path) return null;
    const { data } = supabase.storage
      .from('website-deliveries')
      .getPublicUrl(delivery.website_zip_path);
    return data.publicUrl;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const viewportIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const showPreview = delivery?.deployment_url &&
    isValidUrl(delivery.deployment_url) &&
    (delivery.delivery_type === 'hosted_preview' || delivery.delivery_type === 'both');

  const showZip = delivery?.website_zip_path &&
    (delivery.delivery_type === 'zip_only' || delivery.delivery_type === 'both');

  if (authLoading || profileLoading || loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
        </div>
        <WebsitePreviewSkeleton />
      </div>
    );
  }

  if (!hasWebsiteCopyPack) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Globe size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-inter font-bold text-[#1B3F7A] text-xl mb-2">
            Website Not Purchased
          </h2>
          <p className="text-gray-600 text-sm">
            You haven't purchased the Website Pack. Visit the services page to add it to your account.
          </p>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Globe size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-inter font-bold text-[#1B3F7A] text-xl mb-2">
            Your Website is Being Built
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            We're building your custom website. Once ready, you'll be able to preview it here and download the source files.
          </p>
          <p className="text-gray-500 text-xs">
            Websites are typically delivered within 3-5 business days of intake form completion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Your Website
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Preview your website and download the source files to deploy it.
        </p>
      </div>

      {/* Delivery Info */}
      {delivery.delivered_at && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <div>
            <p className="font-inter text-green-800 font-medium text-sm">
              Website Delivered
            </p>
            <p className="font-inter text-green-700 text-xs">
              Delivered on {new Date(delivery.delivered_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Auto-delete warning for website */}
      {delivery.auto_delete_at && (
        <AutoDeleteWarning
          autoDeleteAt={delivery.auto_delete_at}
          message="Website files are available for a limited time"
        />
      )}

      {/* Live Website Preview */}
      {showPreview && (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-[#1B3F7A]" />
              <h2 className="font-inter font-semibold text-gray-900">
                Website Preview
              </h2>
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
              <a
                href={delivery.deployment_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter transition-colors"
              >
                <ExternalLink size={12} />
                Open Full Site
              </a>
            </div>
          </div>

          {/* Preview Area */}
          <div
            className={`bg-gray-100 overflow-auto transition-all duration-200 ${
              isFullscreen ? 'h-[calc(100vh-52px)]' : 'h-[600px]'
            }`}
          >
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
                    <p className="text-sm text-gray-500">Loading your website...</p>
                  </div>
                </div>
              )}
              <iframe
                src={delivery.deployment_url!}
                className={`w-full h-full min-h-[600px] ${previewLoading ? 'hidden' : ''}`}
                onLoad={() => setPreviewLoading(false)}
                onError={() => setPreviewError(true)}
                title="Your Website"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
              {previewError && (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center p-6 max-w-md">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
                    <h3 className="font-inter font-semibold text-gray-900 mb-2">
                      Preview Unavailable
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your website may have security settings that prevent embedded preview.
                      Click below to view your site directly.
                    </p>
                    <a
                      href={delivery.deployment_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-lg text-sm font-inter transition-colors"
                    >
                      <ExternalLink size={14} />
                      Open Your Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Source Files Download */}
      {showZip && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-lg">
                <FileCode size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-inter font-semibold text-gray-900">
                  Website Source Files
                </h3>
                <p className="text-xs text-gray-500">
                  Download the complete source code — deploy to any hosting platform
                </p>
              </div>
            </div>
            <a
              href={getZipDownloadUrl() || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-lg text-sm font-inter transition-colors"
            >
              <Download size={16} />
              Download ZIP
            </a>
          </div>
        </div>
      )}

      {/* Hosting Instructions from Admin */}
      {delivery.hosting_instructions && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-inter font-semibold text-[#1B3F7A] mb-4">
            Deployment Guide
          </h2>
          <div className="prose prose-sm max-w-none">
            <MarkdownContent content={delivery.hosting_instructions} />
          </div>
        </div>
      )}

      {/* Need changes note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Need changes?</strong> Contact us and we'll update your website. Since we built it from your intake responses, modifications are quick and consistent.
        </p>
      </div>
    </div>
  );
}

// Markdown Content Renderer
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return <h4 key={index} className="font-semibold text-[#1B3F7A] mt-4 text-base">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={index} className="font-bold text-[#1B3F7A] text-lg mt-5">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 text-gray-700 text-sm">{line.replace('- ', '')}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <p key={index} className="ml-4 text-gray-700 text-sm">{line}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-700 text-sm">{line}</p>;
      })}
    </div>
  );
}
