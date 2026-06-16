'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { getServiceById } from '@/lib/services/service-catalog';
import { getDocumentConfigsForService } from '@/lib/services/document-configs';
import { isIndustryService } from '@/lib/services/document-service-map';
import { Lock, Clock, FileText, Eye, EyeOff, Download, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

interface DeliveredDoc {
  id: string;
  document_type: string;
  document_label: string;
  content_html: string | null;
  delivered_at: string;
  auto_delete_at: string | null;
  admin_edited: boolean;
  pdf_path: string | null;
  docx_path: string | null;
}

interface PurchasedService {
  id: string;
  service_id: string;
  status: string;
  purchased_at: string;
}

export default function IndustryPage() {
  const { user } = useAuth();
  const { profile, purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const safePurchasedServiceIds = Array.isArray(purchasedServiceIds) ? purchasedServiceIds : [];

  const [documents, setDocuments] = useState<DeliveredDoc[]>([]);
  const [purchasedServices, setPurchasedServices] = useState<PurchasedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  const industryServiceIds = safePurchasedServiceIds.filter(isIndustryService);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const [docsRes, servicesRes] = await Promise.all([
        supabase
          .from('generated_documents')
          .select('id, document_type, document_label, content_html, delivered_at, auto_delete_at, admin_edited, pdf_path, docx_path')
          .eq('client_id', user.id)
          .eq('delivered_to_client', true)
          .or(`auto_delete_at.is.null,auto_delete_at.gt.${now}`)
          .order('document_type'),
        supabase
          .from('services_purchased')
          .select('id, service_id, status, purchased_at')
          .eq('user_id', user.id)
          .eq('status', 'active'),
      ]);

      setDocuments(docsRes.data || []);
      setPurchasedServices(servicesRes.data || []);
    } finally {
      setLoading(false);
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

  const handleStorageDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('generated-documents')
        .createSignedUrl(filePath, 3600);

      if (error || !data) return;

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
    const diffMs = new Date(autoDeleteAt).getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expires today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!profile) return null;

  const earliestAutoDelete = documents
    .filter((d) => d.auto_delete_at)
    .map((d) => d.auto_delete_at as string)
    .sort()[0];

  const industryLabels: Record<string, string> = {
    coach_industry_pack: 'Coach',
    photographer_industry_pack: 'Photographer',
    consultant_industry_pack: 'Consultant',
    contractor_industry_pack: 'Contractor',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">Industry Documents</h1>
        <p className="font-inter text-gray-600 text-sm">
          Your industry-specific documents — tailored to your profession.
        </p>
      </div>

      {industryServiceIds.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3 shrink-0">
              <Lock size={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
                No industry pack purchased
              </h2>
              <p className="font-inter text-gray-600 text-sm">
                Add an industry pack to access profession-specific documents tailored to coaches,
                photographers, consultants, or contractors.
              </p>
            </div>
          </div>
        </div>
      )}

      {earliestAutoDelete && documents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
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

      <div className="space-y-8">
        {industryServiceIds.map((serviceId) => {
          const service = getServiceById(serviceId);
          const configs = getDocumentConfigsForService(serviceId);
          const serviceDocTypes = configs.map((c) => c.document_type);
          const serviceDocs = documents.filter((d) => serviceDocTypes.includes(d.document_type));
          const hasDocuments = serviceDocs.length > 0;
          const industryLabel = industryLabels[serviceId] ?? service?.name ?? serviceId;

          return (
            <div key={serviceId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Pack header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAFBFC] rounded-lg p-2.5 shrink-0">
                    <Building2 size={20} className="text-[#1B3F7A]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-inter font-semibold text-[#1B3F7A] text-base">
                        {service?.name ?? serviceId}
                      </h2>
                      <span className="px-2 py-0.5 bg-[#1B3F7A]/5 text-[#1B3F7A] text-xs rounded font-inter font-medium">
                        {industryLabel}
                      </span>
                    </div>
                    <p className="font-inter text-gray-500 text-xs">{service?.shortDescription}</p>
                  </div>
                  <div className="ml-auto">
                    {hasDocuments ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-inter font-medium">
                        <CheckCircle2 size={12} />
                        {serviceDocs.length} document{serviceDocs.length !== 1 ? 's' : ''} ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-inter font-medium">
                        <Clock size={12} />
                        Pending delivery
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Document list */}
              <div className="divide-y divide-gray-100">
                {configs.map((config) => {
                  const doc = serviceDocs.find((d) => d.document_type === config.document_type);
                  const isViewing = viewingDoc === (doc?.id ?? null);

                  return (
                    <div key={config.document_type}>
                      <div className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <FileText
                            size={16}
                            className={doc ? 'text-[#1B3F7A]' : 'text-gray-300'}
                          />
                          <div>
                            <p className="font-inter text-sm font-medium text-gray-900">
                              {config.document_label}
                            </p>
                            <p className="font-inter text-xs text-gray-500">{config.description}</p>
                          </div>
                        </div>

                        {doc ? (
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {doc.auto_delete_at && (
                              <span className="font-inter text-xs text-amber-600 hidden sm:block">
                                {getTimeRemaining(doc.auto_delete_at)}
                              </span>
                            )}
                            <button
                              onClick={() => setViewingDoc(isViewing ? null : doc.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-xs transition-colors"
                            >
                              {isViewing ? <EyeOff size={14} /> : <Eye size={14} />}
                              {isViewing ? 'Hide' : 'Preview'}
                            </button>
                            {doc.pdf_path && (
                              <button
                                onClick={() => handleStorageDownload(doc.pdf_path!, `${config.document_label}.pdf`)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-xs transition-colors"
                              >
                                <Download size={14} />
                                PDF
                              </button>
                            )}
                            {doc.docx_path && (
                              <button
                                onClick={() => handleStorageDownload(doc.docx_path!, `${config.document_label}.docx`)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md font-inter text-xs transition-colors"
                              >
                                <Download size={14} />
                                Word
                              </button>
                            )}
                            {doc.content_html && (
                              <button
                                onClick={() => handleDownloadHtml(doc)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-inter text-xs transition-colors"
                              >
                                <Download size={14} />
                                HTML
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="font-inter text-xs text-gray-400">Not yet delivered</span>
                        )}
                      </div>

                      {/* Inline preview */}
                      {doc && isViewing && doc.content_html && (
                        <div className="px-5 pb-4">
                          <iframe
                            src={(() => {
                              const blob = new Blob([doc.content_html!], { type: 'text/html' });
                              return URL.createObjectURL(blob);
                            })()}
                            title={doc.document_label}
                            sandbox="allow-same-origin"
                            className="w-full h-80 border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Not yet submitted message */}
              {!profile.has_submitted_intake && (
                <div className="px-5 py-4 bg-[#FAFBFC] border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-600 shrink-0" />
                    <p className="font-inter text-xs text-gray-600">
                      Complete your intake form to begin the delivery process.{' '}
                      <a href="/personal/intake" className="text-[#1B3F7A] font-medium hover:underline">
                        Go to intake form
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
