'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, X, Lock, Shield, Download } from 'lucide-react';

interface DocumentPreviewProps {
  documentId: string;
  documentTitle: string;
  documentNumber: string;
}

export default function DocumentPreview({ documentId, documentTitle, documentNumber }: DocumentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common screenshot shortcuts
      if (
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) || // Mac screenshot
        (e.ctrlKey && e.key === 'PrintScreen') || // Windows
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        setShowScreenshotModal(true);
        return false;
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners when preview is open
    if (showPreview) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('copy', handleCopy);
      document.addEventListener('cut', handleCopy);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
    };
  }, [showPreview]);

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      {/* Preview Button */}
      <div className="mt-6">
        <button
          onClick={handlePreviewClick}
          className="inline-flex items-center gap-2 font-inter font-semibold text-navy bg-white border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-all duration-200"
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          <Eye size={18} />
          Preview Sample Document
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClosePreview();
          }}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl relative max-w-5xl w-full"
              style={{ maxHeight: '90vh' }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                <div>
                  <div className="font-inter font-bold text-navy" style={{ fontSize: '1.1rem' }}>
                    {documentNumber} — {documentTitle}
                  </div>
                  <div className="font-inter text-secondary-text flex items-center gap-1.5 mt-0.5" style={{ fontSize: '0.8rem' }}>
                    <Lock size={12} />
                    Protected Preview — Not for Download
                  </div>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Security Layer */}
              <div
                className="absolute inset-0 bottom-16 pointer-events-none z-[5]"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(27,63,122,0.02) 100px, rgba(27,63,122,0.02) 200px)',
                  mixBlendMode: 'multiply',
                }}
              />

              {/* Watermark Overlay */}
              <div
                className="absolute inset-0 bottom-16 overflow-hidden pointer-events-none z-[6]"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute font-inter font-bold text-navy/6 whitespace-nowrap"
                    style={{
                      fontSize: '1.2rem',
                      transform: `rotate(-30deg)`,
                      left: `${(i % 4) * 30}%`,
                      top: `${Math.floor(i / 4) * 45 + 5}%`,
                      letterSpacing: '0.3em',
                    }}
                  >
                    SAMPLE PREVIEW — NOT FOR USE
                  </div>
                ))}
              </div>

              {/* Document Preview Content */}
              <div
                className="p-8 overflow-y-auto"
                style={{
                  maxHeight: 'calc(90vh - 140px)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                {/* Warning Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-inter font-semibold text-amber-900" style={{ fontSize: '0.9rem' }}>
                        This is a sample preview document
                      </div>
                      <div className="font-inter text-amber-700 mt-1" style={{ fontSize: '0.85rem' }}>
                        The actual document you receive will be fully personalised to your business, with your details, terms, and branding. This preview shows the structure and quality only.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Placeholder */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download size={28} className="text-navy/40" />
                    </div>
                    <h3 className="font-inter font-bold text-navy mb-2" style={{ fontSize: '1.2rem' }}>
                      Sample {documentTitle}
                    </h3>
                    <p className="font-inter text-secondary-text" style={{ fontSize: '0.9rem' }}>
                      Preview PDF placeholder — Upload actual sample document here
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <div className="space-y-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-4/5" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>

                  <p className="font-inter text-secondary-text mt-6" style={{ fontSize: '0.85rem' }}>
                    <strong>Upload Location:</strong> /public/documents/samples/{documentId}.pdf
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="sticky bottom-0 bg-gradient-to-r from-navy to-medium-blue px-6 py-4 rounded-b-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="font-inter font-bold text-white" style={{ fontSize: '1rem' }}>
                      Get the full, personalised version
                    </div>
                    <div className="font-inter text-white/80" style={{ fontSize: '0.85rem' }}>
                      Tailored to your business — delivered within 24 hours
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="font-inter font-bold text-navy bg-white rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                    style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                  >
                    Get Your Pack — £79
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Detection Modal */}
      {showScreenshotModal && (
        <div className="fixed inset-0 z-[200] bg-navy/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock size={32} className="text-navy" />
            </div>

            <h3 className="font-inter font-bold text-navy mb-3" style={{ fontSize: '1.4rem' }}>
              Document Protected
            </h3>

            <p className="font-inter text-secondary-text mb-6 leading-relaxed" style={{ fontSize: '0.95rem' }}>
              These previews are for reference only. The actual documents you receive will be fully personalised to your business and professionally formatted for immediate use.
            </p>

            <div className="bg-off-white rounded-lg p-4 mb-6 text-left">
              <div className="font-inter font-semibold text-navy mb-2" style={{ fontSize: '0.9rem' }}>
                What you get with your pack:
              </div>
              <ul className="space-y-2 font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Full, personalised document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Professional PDF format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Editable Word version</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Your branding applied</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/checkout"
                className="font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors"
                style={{ padding: '14px 24px', fontSize: '0.95rem' }}
              >
                Get Your Personalised Pack — £79
              </Link>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="font-inter font-medium text-secondary-text hover:text-navy transition-colors"
                style={{ fontSize: '0.9rem' }}
              >
                Continue Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
