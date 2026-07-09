'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { getServiceById } from '@/lib/services/service-catalog';
import { getDocumentConfigsForService } from '@/lib/services/document-configs';
import { isOperationsService } from '@/lib/services/document-service-map';
import { AutoDeleteWarningMultiple, AutoDeleteBadge } from '@/components/ui/AutoDeleteWarning';
import { ServiceCardSkeleton } from '@/components/ui/skeletons';
import { Lock, Clock, FileText, Eye, EyeOff, Download, Package, CheckCircle2, AlertCircle } from 'lucide-react';

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

export default function OperationsPage() {
  const { user } = useAuth();
  const { profile, purchasedServiceIds, loading: profileLoading } = useClientProfile();
  const safePurchasedServiceIds = Array.isArray(purchasedServiceIds) ? purchasedServiceIds : [];

  const [documents, setDocuments] = useState<DeliveredDoc[]>([]);
  const [purchasedServices, setPurchasedServices] = useState<PurchasedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);

  const operationsServiceIds = safePurchasedServiceIds.filter(isOperationsService);

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

  if (profileLoading || loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-1 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
        </div>
        <div className="space-y-8">
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const operationsServices = purchasedServices.filter((ps) => isOperationsService(ps.service_id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">Operations Documents</h1>
        <p className="font-inter text-gray-600 text-sm">
          Your operations-tier documents — client onboarding, payment protection, IP, and GDPR.
        </p>
      </div>

      {operationsServiceIds.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3 shrink-0">
              <Lock size={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
                No operations packs purchased
              </h2>
              <p className="font-inter text-gray-600 text-sm">
                Add an operations pack to access client onboarding, payment protection, copyright
                licensing, and GDPR compliance documents.
              </p>
            </div>
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <AutoDeleteWarningMultiple
          autoDeleteDates={documents.map(d => d.auto_delete_at)}
          className="mb-6"
        />
      )}

      <div className="space-y-8">
        {operationsServiceIds.map((serviceId) => {
          const service = getServiceById(serviceId);
          const configs = getDocumentConfigsForService(serviceId);
          const serviceDocTypes = configs.map((c) => c.document_type);
          const serviceDocs = documents.filter((d) => serviceDocTypes.includes(d.document_type));
          const isActive = operationsServices.some((ps) => ps.service_id === serviceId);
          const hasDocuments = serviceDocs.length > 0;

          return (
            <div key={serviceId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Pack header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAFBFC] rounded-lg p-2.5 shrink-0">
                    <Package size={20} className="text-[#1B3F7A]" />
                  </div>
                  <div>
                    <h2 className="font-inter font-semibold text-[#1B3F7A] text-base">
                      {service?.name ?? serviceId}
                    </h2>
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
                            <AutoDeleteBadge autoDeleteAt={doc.auto_delete_at} />
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
