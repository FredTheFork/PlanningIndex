'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { Globe, Download, ExternalLink, AlertTriangle, CheckCircle2, Server, Database, Globe as Globe2, Shield, Zap, FileCode, ArrowRight, ChevronDown, ChevronUp, Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';

interface WebsiteDelivery {
  id: string;
  deployment_url: string | null;
  website_zip_path: string | null;
  hosting_instructions: string | null;
  delivered_at: string | null;
  delivery_type: 'zip_only' | 'hosted_preview' | 'both';
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const LAUNCH_CHECKLIST = [
  { id: 'domain', label: 'Custom domain configured', description: 'Point your domain DNS to your hosting provider' },
  { id: 'ssl', label: 'SSL certificate active', description: 'Automatic with Netlify/Vercel/Bolt.new' },
  { id: 'forms', label: 'Contact forms working', description: 'Test form submissions' },
  { id: 'analytics', label: 'Analytics installed', description: 'Google Analytics or Plausible' },
  { id: 'seo', label: 'SEO meta tags complete', description: 'Title, description, Open Graph' },
  { id: 'performance', label: 'Performance optimized', description: 'Images compressed, lazy loading' },
];

export default function PersonalWebsitePage() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const [delivery, setDelivery] = useState<WebsiteDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewViewport, setPreviewViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('hosting');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

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
        .select('id, deployment_url, website_zip_path, hosting_instructions, delivered_at, delivery_type')
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

  const toggleCheckItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
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
            You haven't purchased the Website Copy Pack. Visit the services page to add it to your account.
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
            Your Website is Being Prepared
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            We're building your custom website. Once ready, you'll be able to preview it here and access the source files.
          </p>
          <p className="text-gray-500 text-xs">
            Websites are delivered within 24 hours of intake form completion.
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
          Preview your deployed website and access source files.
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

      {/* Live Website Preview */}
      {showPreview && (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-[#1B3F7A]" />
              <h2 className="font-inter font-semibold text-gray-900">
                Live Website Preview
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
                  Download the complete source code for your website
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

      {/* Comprehensive Instructions */}
      <div className="space-y-4">
        <h2 className="font-inter font-bold text-[#1B3F7A] text-lg">
          Website Hosting & Setup Guide
        </h2>

        {/* Hosting Instructions from Admin */}
        {delivery.hosting_instructions && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="prose prose-sm max-w-none">
              <MarkdownContent content={delivery.hosting_instructions} />
            </div>
          </div>
        )}

        {/* Bolt.new Section */}
        <InstructionSection
          id="bolt"
          title="About Bolt.new"
          icon={<Zap size={20} className="text-purple-600" />}
          isExpanded={expandedSection === 'bolt'}
          onToggle={() => setExpandedSection(expandedSection === 'bolt' ? null : 'bolt')}
        >
          <p className="text-sm text-gray-600 mb-4">
            Your website was built using <strong>Bolt.new</strong>, an AI-powered full-stack development environment.
            This means your site is:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
              <span>Built with modern technologies (React/Next.js, TypeScript, Tailwind CSS)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
              <span>Fully customizable - the source code belongs to you</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
              <span>Deployable to any hosting platform</span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Need changes?</strong> Contact us and we can regenerate your website with modifications.
              Each website is built with a saved prompt, making updates quick and consistent.
            </p>
          </div>
        </InstructionSection>

        {/* Hosting Section */}
        <InstructionSection
          id="hosting"
          title="Hosting Options"
          icon={<Server size={20} className="text-blue-600" />}
          isExpanded={expandedSection === 'hosting'}
          onToggle={() => setExpandedSection(expandedSection === 'hosting' ? null : 'hosting')}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Netlify */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-inter font-semibold text-gray-900 mb-2">Netlify</h4>
              <p className="text-xs text-gray-600 mb-3">
                Drag-and-drop deployment with automatic SSL and CDN.
              </p>
              <ol className="text-xs text-gray-600 space-y-1">
                <li>1. Create free account at netlify.com</li>
                <li>2. Drag your ZIP to deploy area</li>
                <li>3. Site is live instantly!</li>
              </ol>
              <a
                href="https://netlify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#1B3F7A] hover:underline"
              >
                Visit Netlify <ExternalLink size={10} />
              </a>
            </div>

            {/* Vercel */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-inter font-semibold text-gray-900 mb-2">Vercel</h4>
              <p className="text-xs text-gray-600 mb-3">
                Zero-config deployment optimized for Next.js sites.
              </p>
              <ol className="text-xs text-gray-600 space-y-1">
                <li>1. Create free account at vercel.com</li>
                <li>2. Import from GitHub or upload</li>
                <li>3. Automatic SSL included</li>
              </ol>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#1B3F7A] hover:underline"
              >
                Visit Vercel <ExternalLink size={10} />
              </a>
            </div>

            {/* Bolt.new */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-inter font-semibold text-gray-900 mb-2">Bolt.new Hosting</h4>
              <p className="text-xs text-gray-600 mb-3">
                Keep your site on Bolt.new's platform with quick publish.
              </p>
              <ol className="text-xs text-gray-600 space-y-1">
                <li>1. Site is already deployed</li>
                <li>2. Purchase custom domain</li>
                <li>3. Or use bolt.new subdomain</li>
              </ol>
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#1B3F7A] hover:underline"
              >
                Visit Bolt.new <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </InstructionSection>

        {/* Database Section */}
        <InstructionSection
          id="database"
          title="Database Integration"
          icon={<Database size={20} className="text-green-600" />}
          isExpanded={expandedSection === 'database'}
          onToggle={() => setExpandedSection(expandedSection === 'database' ? null : 'database')}
        >
          <p className="text-sm text-gray-600 mb-4">
            If your website needs dynamic features like user accounts, contact form storage,
            or real-time updates, integrate <strong>Supabase</strong>:
          </p>
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <h4 className="font-inter font-semibold text-green-800 mb-2">What Supabase Provides</h4>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={12} />
                PostgreSQL Database
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={12} />
                User Authentication
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={12} />
                File Storage
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={12} />
                Realtime Subscriptions
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={12} />
                Edge Functions
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <CheckCircle2 size={12} />
                Row Level Security
              </div>
            </div>
          </div>
          <ol className="text-sm text-gray-600 space-y-2">
            <li>1. Create a free account at <a href="https://supabase.com" target="_blank" className="text-[#1B3F7A] hover:underline">supabase.com</a></li>
            <li>2. Create a new project and copy your project URL + anon key</li>
            <li>3. Add environment variables to your hosting platform</li>
            <li>4. Contact us if you need help with integration</li>
          </ol>
        </InstructionSection>

        {/* Domain Section */}
        <InstructionSection
          id="domain"
          title="Custom Domain Setup"
          icon={<Globe2 size={20} className="text-orange-600" />}
          isExpanded={expandedSection === 'domain'}
          onToggle={() => setExpandedSection(expandedSection === 'domain' ? null : 'domain')}
        >
          <p className="text-sm text-gray-600 mb-4">
            Connect your own domain for a professional presence:
          </p>
          <div className="mb-4">
            <h4 className="font-inter font-semibold text-gray-900 text-sm mb-2">Recommended Registrars</h4>
            <div className="flex flex-wrap gap-2">
              <a href="https://namecheap.com" target="_blank" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700">Namecheap</a>
              <a href="https://cloudflare.com" target="_blank" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700">Cloudflare</a>
              <a href="https://godaddy.com" target="_blank" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700">GoDaddy</a>
              <a href="https://domains.google" target="_blank" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700">Google Domains</a>
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-inter font-semibold text-orange-800 text-sm mb-2">DNS Configuration</h4>
            <p className="text-xs text-orange-700 mb-2">
              After purchasing your domain, configure DNS records:
            </p>
            <div className="bg-white rounded p-2 font-mono text-xs text-gray-700 space-y-1">
              <p><strong>A Record:</strong> @ → [Hosting IP]</p>
              <p><strong>CNAME:</strong> www → [Hosting Domain]</p>
            </div>
            <p className="text-xs text-orange-700 mt-2">
              SSL certificates are automatically provisioned by Netlify/Vercel.
            </p>
          </div>
        </InstructionSection>

        {/* TypeScript Section */}
        <InstructionSection
          id="typescript"
          title="TypeScript Benefits"
          icon={<Shield size={20} className="text-indigo-600" />}
          isExpanded={expandedSection === 'typescript'}
          onToggle={() => setExpandedSection(expandedSection === 'typescript' ? null : 'typescript')}
        >
          <p className="text-sm text-gray-600 mb-4">
            Your website is built with <strong>TypeScript</strong>, providing:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50 rounded">
              <h5 className="font-inter font-semibold text-indigo-800 text-sm">Type Safety</h5>
              <p className="text-xs text-indigo-700">Catch errors before they reach production</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded">
              <h5 className="font-inter font-semibold text-indigo-800 text-sm">Better IDE Support</h5>
              <p className="text-xs text-indigo-700">Autocomplete, refactoring, navigation</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded">
              <h5 className="font-inter font-semibold text-indigo-800 text-sm">Self-Documenting</h5>
              <p className="text-xs text-indigo-700">Types serve as inline documentation</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded">
              <h5 className="font-inter font-semibold text-indigo-800 text-sm">Easier Maintenance</h5>
              <p className="text-xs text-indigo-700">Refactor with confidence</p>
            </div>
          </div>
        </InstructionSection>

        {/* Launch Checklist */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-inter font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#1B3F7A]" />
            Launch Checklist
          </h3>
          <div className="space-y-2">
            {LAUNCH_CHECKLIST.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  checkedItems.has(item.id)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                  checkedItems.has(item.id)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {checkedItems.has(item.id) && <CheckCircle2 size={14} />}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${checkedItems.has(item.id) ? 'text-green-800' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {checkedItems.size} of {LAUNCH_CHECKLIST.length} tasks completed
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(checkedItems.size / LAUNCH_CHECKLIST.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Instruction Section Component
function InstructionSection({
  id,
  title,
  icon,
  children,
  isExpanded,
  onToggle,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-50 rounded">{icon}</div>
          <h3 className="font-inter font-semibold text-gray-900">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
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
