'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { getServiceById } from '@/lib/services/service-catalog';
import { getDocumentTypesForService, isServiceDocumentService } from '@/lib/services/document-service-map';
import { Lock, Clock, FileText, Eye, EyeOff, Download, Globe, Share2, Instagram, Linkedin, Facebook, Twitter, Maximize2, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
  HomepageTemplate, AboutTemplate, ServicesTemplate, ContactTemplate, PreviewFrame
} from '@/components/website-preview';
import type { HomepageContent } from '@/components/website-preview/templates/HomepageTemplate';
import type { AboutContent } from '@/components/website-preview/templates/AboutTemplate';
import type { ServicesContent } from '@/components/website-preview/templates/ServicesTemplate';
import type { ContactContent } from '@/components/website-preview/templates/ContactTemplate';

interface DeliveredDoc {
  id: string;
  document_type: string;
  document_label: string;
  content_html: string | null;
  delivered_at: string;
  auto_delete_at: string;
  admin_edited: boolean;
  pdf_path: string | null;
  docx_path: string | null;
}

interface SocialPost {
  id: string;
  post_number: number;
  category: 'educational' | 'promotional' | 'personal';
  caption: string;
  hashtags: string | null;
  platform: 'LinkedIn' | 'Instagram' | 'Facebook' | 'X';
  image_path: string | null;
  week: number;
  day: string;
}

interface WebsitePage {
  id: string;
  page_type: 'homepage' | 'about' | 'services' | 'contact';
  content_json: any;
  delivered_at: string;
}

export default function PersonalDocuments() {
  const { profile, loading: profileLoading, purchasedServiceIds } = useClientProfile();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DeliveredDoc[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [websitePages, setWebsitePages] = useState<WebsitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [websitePreviewOpen, setWebsitePreviewOpen] = useState(false);
  const [activePage, setActivePage] = useState<'homepage' | 'about' | 'services' | 'contact'>('homepage');

  // Check which additional services user has
  const hasSocialMediaPack = purchasedServiceIds.includes('social_media_pack');
  const hasWebsiteCopyPack = purchasedServiceIds.includes('website_copy_pack');

  useEffect(() => {
    if (!user) return;
    fetchDeliveredDocs();
    if (hasSocialMediaPack) fetchSocialPosts();
    if (hasWebsiteCopyPack) fetchWebsitePages();
  }, [user, hasSocialMediaPack, hasWebsiteCopyPack]);

  const fetchDeliveredDocs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('generated_documents')
        .select('id, document_type, document_label, content_html, delivered_at, auto_delete_at, admin_edited, pdf_path, docx_path')
        .eq('client_id', user.id)
        .eq('delivered_to_client', true)
        .or(`auto_delete_at.is.null,auto_delete_at.gt.${now}`)
        .order('document_type');

      if (error) {
        console.error('Error fetching delivered docs:', error);
      } else {
        setDocuments(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialPosts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('id, post_number, category, caption, hashtags, platform, image_path, week, day')
        .eq('user_id', user.id)
        .eq('delivered_to_client', true)
        .order('post_number', { ascending: true });

      if (!error && data) {
        setSocialPosts(data);
      }
    } catch (err) {
      console.error('Error fetching social posts:', err);
    }
  };

  const fetchWebsitePages = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('website_page_contents')
        .select('id, page_type, content_json, delivered_at')
        .eq('user_id', user.id)
        .eq('delivered_to_client', true);

      if (!error && data) {
        setWebsitePages(data);
      }
    } catch (err) {
      console.error('Error fetching website pages:', err);
    }
  };

  const handleDownloadHtml = (doc: DeliveredDoc) => {
    if (!doc.content_html) return;
    const blob = new Blob([doc.content_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.document_label.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStorageDownload = async (filePath: string, fileName: string, bucket: string = 'generated-documents') => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600);

      if (error || !data) {
        console.error('Download error:', error);
        return;
      }

      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const getTimeRemaining = (autoDeleteAt: string): string => {
    const now = new Date();
    const deleteDate = new Date(autoDeleteAt);
    const diffMs = deleteDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expires today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  // Compute which document-producing services the user has purchased
  const docServiceIds = purchasedServiceIds.filter(isServiceDocumentService);

  // Filter documents based on selected service tab
  const filteredDocuments = selectedServiceId === 'all'
    ? documents
    : documents.filter((doc) => {
        const typesForService = new Set(getDocumentTypesForService(selectedServiceId));
        return typesForService.has(doc.document_type);
      });

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!profile) return null;

  const hasDocuments = filteredDocuments.length > 0;
  const hasSocialPosts = socialPosts.length > 0;
  const hasWebsitePages = websitePages.length > 0;

  // Earliest auto-delete among filtered docs
  const earliestAutoDelete = filteredDocuments
    .map((d) => d.auto_delete_at)
    .filter(Boolean)
    .sort()[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Your Content
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Access your documents, social media posts, and website copy.
        </p>
      </div>

      {/* Service filter tabs */}
      {docServiceIds.length > 1 && (
        <div className="mb-6">
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1 overflow-x-auto">
            <button
              onClick={() => setSelectedServiceId('all')}
              className={`px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors whitespace-nowrap ${
                selectedServiceId === 'all'
                  ? 'bg-[#1B3F7A] text-white'
                  : 'text-gray-600 hover:text-[#1B3F7A] hover:bg-gray-50'
              }`}
            >
              All Documents
            </button>
            {docServiceIds.map((sid) => {
              const service = getServiceById(sid);
              return (
                <button
                  key={sid}
                  onClick={() => setSelectedServiceId(sid)}
                  className={`px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedServiceId === sid
                      ? 'bg-[#1B3F7A] text-white'
                      : 'text-gray-600 hover:text-[#1B3F7A] hover:bg-gray-50'
                  }`}
                >
                  {service?.name ?? sid}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {hasDocuments && (
        <div className="space-y-6 mb-8">
          {earliestAutoDelete && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-inter text-amber-800 text-sm font-medium">
                  Documents are available for a limited time
                </p>
                <p className="font-inter text-amber-700 text-xs mt-1">
                  {getTimeRemaining(earliestAutoDelete)} — Please download and save copies to your own device.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isViewing={viewingDoc === doc.id}
                onToggleView={() => setViewingDoc(viewingDoc === doc.id ? null : doc.id)}
                onDownloadHtml={handleDownloadHtml}
                onStorageDownload={handleStorageDownload}
              />
            ))}
          </div>
        </div>
      )}

      {/* Website Copy Section */}
      {hasWebsiteCopyPack && hasWebsitePages && (
        <div className="mb-8">
          <WebsiteCopySection
            pages={websitePages}
            onViewFullPreview={() => setWebsitePreviewOpen(true)}
          />
        </div>
      )}

      {/* Social Media Posts Section */}
      {hasSocialMediaPack && hasSocialPosts && (
        <div className="mb-8">
          <SocialPostsSection
            posts={socialPosts}
            onImageDownload={(path, name) => handleStorageDownload(path, name, 'social-media-images')}
          />
        </div>
      )}

      {/* No content state */}
      {!hasDocuments && !hasWebsitePages && !hasSocialPosts && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3 shrink-0">
              <Lock size={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
                Content not yet available
              </h2>
              <p className="font-inter text-gray-600 text-sm mb-4">
                {profile.delivery_status === 'not_started'
                  ? 'Your content will be prepared once you submit your intake form. The 24-hour delivery window starts from submission.'
                  : 'Your content is currently being prepared. It will be available within 24 hours of submitting your intake form.'}
              </p>

              {!profile.has_submitted_intake && (
                <a
                  href="/personal/intake"
                  className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Complete Intake Form
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Website Preview Modal */}
      {websitePreviewOpen && (
        <WebsitePreviewModal
          pages={websitePages}
          onClose={() => setWebsitePreviewOpen(false)}
        />
      )}
    </div>
  );
}

// ── Document Card ──

interface DocumentCardProps {
  doc: DeliveredDoc;
  isViewing: boolean;
  onToggleView: () => void;
  onDownloadHtml: (doc: DeliveredDoc) => void;
  onStorageDownload: (filePath: string, fileName: string) => void;
}

function DocumentCard({ doc, isViewing, onToggleView, onDownloadHtml, onStorageDownload }: DocumentCardProps) {
  const [htmlBlobUrl, setHtmlBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isViewing && doc.content_html && !htmlBlobUrl) {
      const blob = new Blob([doc.content_html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setHtmlBlobUrl(url);
    } else if (!isViewing && htmlBlobUrl) {
      URL.revokeObjectURL(htmlBlobUrl);
      setHtmlBlobUrl(null);
    }

    return () => {
      if (htmlBlobUrl) {
        URL.revokeObjectURL(htmlBlobUrl);
      }
    };
  }, [isViewing, doc.content_html]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start gap-4">
        <div className="bg-[#FAFBFC] rounded-lg p-3 shrink-0">
          <FileText size={24} className="text-[#1B3F7A]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-inter font-semibold text-[#1B3F7A]">
              {doc.document_label}
            </h3>
            {doc.admin_edited && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-inter font-medium">
                Edited
              </span>
            )}
          </div>
          <p className="font-inter text-gray-600 text-xs mb-3">
            Delivered {new Date(doc.delivered_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleView}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm transition-colors"
            >
              {isViewing ? (
                <>
                  <EyeOff size={16} />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Preview
                </>
              )}
            </button>

            {doc.pdf_path && (
              <button
                onClick={() => onStorageDownload(doc.pdf_path!, `${doc.document_label}.pdf`)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm transition-colors"
              >
                <Download size={16} />
                PDF
              </button>
            )}

            {doc.docx_path && (
              <button
                onClick={() => onStorageDownload(doc.docx_path!, `${doc.document_label}.docx`)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-sm transition-colors"
              >
                <Download size={16} />
                Word
              </button>
            )}

            {doc.content_html && (
              <button
                onClick={() => onDownloadHtml(doc)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-sm transition-colors"
              >
                <Download size={16} />
                HTML
              </button>
            )}
          </div>
        </div>
      </div>

      {isViewing && htmlBlobUrl && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <iframe
            src={htmlBlobUrl}
            title={doc.document_label}
            sandbox="allow-same-origin"
            className="w-full h-96 border border-gray-200 rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  );
}

// ── Website Copy Section ──

function WebsiteCopySection({ pages, onViewFullPreview }: { pages: WebsitePage[]; onViewFullPreview: () => void }) {
  const [viewingPage, setViewingPage] = useState<string | null>(null);

  const pageLabels: Record<string, string> = {
    homepage: 'Homepage',
    about: 'About Page',
    services: 'Services Page',
    contact: 'Contact Page',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-inter font-bold text-[#1B3F7A] text-lg flex items-center gap-2">
          <Globe size={20} />
          Website Copy
        </h2>
        <button
          onClick={onViewFullPreview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md text-sm font-inter font-medium transition-colors"
        >
          <Maximize2 size={14} />
          Preview Full Website
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-semibold text-gray-900">{pageLabels[page.page_type]}</h3>
              <button
                onClick={() => setViewingPage(viewingPage === page.id ? null : page.id)}
                className="text-gray-500 hover:text-[#1B3F7A] transition-colors"
              >
                {viewingPage === page.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            <p className="font-inter text-gray-500 text-xs mb-3">
              Delivered {new Date(page.delivered_at).toLocaleDateString('en-GB')}
            </p>
            {viewingPage === page.id && (
              <div className="pt-3 border-t border-gray-100">
                <WebsitePagePreview page={page} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WebsitePagePreview({ page }: { page: WebsitePage }) {
  const brandColors = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#FF8C42' };

  return (
    <div className="h-[400px] border border-gray-200 rounded-lg overflow-hidden">
      {page.page_type === 'homepage' && (
        <HomepageTemplate content={page.content_json} brandColors={brandColors} />
      )}
      {page.page_type === 'about' && (
        <AboutTemplate content={page.content_json} brandColors={brandColors} />
      )}
      {page.page_type === 'services' && (
        <ServicesTemplate content={page.content_json} brandColors={brandColors} />
      )}
      {page.page_type === 'contact' && (
        <ContactTemplate content={page.content_json} brandColors={brandColors} />
      )}
    </div>
  );
}

// ── Website Preview Modal ──

function WebsitePreviewModal({ pages, onClose }: { pages: WebsitePage[]; onClose: () => void }) {
  const [activePageIdx, setActivePageIdx] = useState(0);
  const brandColors = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#FF8C42' };

  const PAGE_LABELS = ['homepage', 'about', 'services', 'contact'] as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {PAGE_LABELS.map((pageType, idx) => {
              const hasDelivered = pages.some(p => p.page_type === pageType);
              return (
                <button
                  key={pageType}
                  onClick={() => hasDelivered && setActivePageIdx(idx)}
                  disabled={!hasDelivered}
                  className={`px-3 py-1.5 rounded-md text-sm font-inter font-medium transition-colors ${
                    activePageIdx === idx
                      ? 'bg-[#1B3F7A] text-white'
                      : hasDelivered
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {pageType.charAt(0).toUpperCase() + pageType.slice(1)}
                </button>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="max-w-4xl mx-auto">
            {(() => {
              const pageType = PAGE_LABELS[activePageIdx];
              const page = pages.find(p => p.page_type === pageType);
              if (!page) return null;

              switch (pageType) {
                case 'homepage':
                  return <HomepageTemplate content={page.content_json} brandColors={brandColors} />;
                case 'about':
                  return <AboutTemplate content={page.content_json} brandColors={brandColors} />;
                case 'services':
                  return <ServicesTemplate content={page.content_json} brandColors={brandColors} />;
                case 'contact':
                  return <ContactTemplate content={page.content_json} brandColors={brandColors} />;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Social Posts Section ──

function SocialPostsSection({ posts, onImageDownload }: { posts: SocialPost[]; onImageDownload: (path: string, name: string) => void }) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const postsByWeek = posts.reduce((acc, post) => {
    if (!acc[post.week]) acc[post.week] = [];
    acc[post.week].push(post);
    return acc;
  }, {} as Record<number, SocialPost[]>);

  const PLATFORM_CONFIG = {
    LinkedIn: { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50' },
    Instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    Facebook: { icon: Facebook, color: 'text-blue-700', bg: 'bg-blue-50' },
    X: { icon: Twitter, color: 'text-gray-800', bg: 'bg-gray-100' },
  };

  return (
    <div>
      <h2 className="font-inter font-bold text-[#1B3F7A] text-lg flex items-center gap-2 mb-4">
        <Share2 size={20} />
        Social Media Posts ({posts.length})
      </h2>

      <div className="space-y-3">
        {Object.entries(postsByWeek).map(([week, weekPosts]) => (
          <div key={week} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedWeek(expandedWeek === parseInt(week) ? null : parseInt(week))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="font-inter font-semibold text-gray-900">Week {week} ({weekPosts.length} posts)</span>
              {expandedWeek === parseInt(week) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expandedWeek === parseInt(week) && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {weekPosts.map((post) => {
                  const PlatformIcon = PLATFORM_CONFIG[post.platform].icon;
                  return (
                    <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-inter font-semibold text-[#1B3F7A]">#{post.post_number}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_CONFIG[post.platform].bg}`}>
                          <PlatformIcon size={12} className="inline mr-1" />
                          {post.platform}
                        </span>
                        <span className="text-xs text-gray-500">{post.day}</span>
                      </div>
                      <p className="font-inter text-sm text-gray-700 mb-2">{post.caption}</p>
                      {post.hashtags && (
                        <p className="font-inter text-xs text-blue-600">{post.hashtags}</p>
                      )}
                      {post.image_path && (
                        <button
                          onClick={() => onImageDownload(post.image_path!, `post-${post.post_number}.png`)}
                          className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-inter font-medium hover:bg-purple-100 transition-colors"
                        >
                          <Download size={12} />
                          Download Image
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
