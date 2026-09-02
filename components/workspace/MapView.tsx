'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin } from 'lucide-react';
import type { SearchApplication } from '@/lib/mock/applications';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const statusColors: Record<string, string> = {
  Approved: '#16A34A',
  Pending: '#D97706',
  Refused: '#DC2626',
  Withdrawn: '#64748B',
};

interface MapViewProps {
  applications: SearchApplication[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  radiusMiles: number;
  centerLat?: number;
  centerLng?: number;
}

export function MapView({
  applications,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  radiusMiles,
  centerLat = 51.67,
  centerLng = -0.6,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [centerLng, centerLat],
      zoom: 10,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [centerLat, centerLng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    applications.forEach((app) => {
      const color = statusColors[app.status] || '#64748B';
      const isSelected = app.id === selectedId;
      const isHovered = app.id === hoveredId;
      const scale = isSelected ? 1.4 : isHovered ? 1.25 : 1;

      const el = document.createElement('div');
      el.style.cssText = [
        `width:${20 * scale}px`,
        `height:${20 * scale}px`,
        'border-radius:50%',
        `background:${color}`,
        'border:3px solid white',
        'box-shadow:0 2px 6px rgba(0,0,0,0.3)',
        'cursor:pointer',
        'transition:transform 0.15s ease',
        isSelected ? 'z-index:10' : '',
      ].join(';');

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect(app.id);
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({ closeOnClick: true, closeButton: true, offset: 15 })
          .setLngLat([app.lng, app.lat])
          .setHTML(
            `<div style="font-family:Inter,sans-serif;padding:4px">` +
              `<p style="font-weight:600;font-size:13px;color:#0F172A;margin:0 0 4px">${app.title}</p>` +
              `<p style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#94A3B8;margin:0 0 2px">${app.reference}</p>` +
              `<p style="font-size:11px;color:#64748B;margin:0">${app.address}</p>` +
              `</div>`
          )
          .addTo(map);
      });

      el.addEventListener('mouseenter', () => onHover(app.id));
      el.addEventListener('mouseleave', () => onHover(null));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([app.lng, app.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [applications, selectedId, hoveredId, onSelect, onHover]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-primary-200 bg-primary-50">
        <div className="text-center px-6">
          <MapPin size={32} className="text-primary-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-primary-500">
            Map view requires a Mapbox access token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] rounded-xl border border-primary-200 overflow-hidden bg-primary-100">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
        <p className="font-sans text-[10px] font-semibold text-primary-800 mb-1.5">Legend</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#16A34A' }} />
            <span className="font-sans text-[10px] text-slate-600">Approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#D97706' }} />
            <span className="font-sans text-[10px] text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#DC2626' }} />
            <span className="font-sans text-[10px] text-slate-600">Refused</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#64748B' }} />
            <span className="font-sans text-[10px] text-slate-600">Withdrawn</span>
          </div>
        </div>
      </div>

      <div className="absolute top-3 left-3 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
        <p className="font-sans text-[10px] font-semibold text-primary-800">
          {applications.length} {applications.length === 1 ? 'application' : 'applications'}
        </p>
        <p className="font-sans text-[9px] text-slate-500 mt-0.5">{radiusMiles} mile radius</p>
      </div>
    </div>
  );
}
