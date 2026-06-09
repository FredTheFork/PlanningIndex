'use client';

import React, { useState, useMemo } from 'react';
import { Monitor, Tablet, Smartphone, Fullscreen, ExternalLink } from 'lucide-react';

interface PreviewFrameProps {
  children: React.ReactNode;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  title?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function PreviewFrame({ children, brandColors = {}, title = 'Website Preview' }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Render the children to HTML string for iframe srcdoc
  const childHtml = useMemo(() => {
    const primary = brandColors.primary || '#1B3F7A';
    const secondary = brandColors.secondary || '#2C68C4';
    const accent = brandColors.accent || '#FF8C42';

    // We'll use a simpler approach - render the component content directly
    return null;
  }, [brandColors]);

  const viewportIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Viewport toggles */}
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            {(Object.keys(VIEWPORT_WIDTHS) as ViewportSize[]).map((v) => {
              const Icon = viewportIcons[v];
              return (
                <button
                  key={v}
                  onClick={() => setViewport(v)}
                  className={`p-1.5 transition-colors ${
                    viewport === v ? 'bg-[#1B3F7A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
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
            <Fullscreen size={16} />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={`bg-gray-100 overflow-auto transition-all duration-200 ${
          isFullscreen ? 'h-[calc(100vh-52px)]' : 'h-[600px]'
        }`}
      >
        <div
          className="mx-auto bg-white shadow-lg min-h-full"
          style={{
            width: VIEWPORT_WIDTHS[viewport],
            maxWidth: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
