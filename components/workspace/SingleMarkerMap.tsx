'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface SingleMarkerMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

export function SingleMarkerMap({ lat, lng, label, address }: SingleMarkerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: 14,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    const el = document.createElement('div');
    el.style.cssText = [
      'width:28px',
      'height:28px',
      'border-radius:50%',
      'background:#0284C7',
      'border:4px solid white',
      'box-shadow:0 2px 8px rgba(0,0,0,0.3)',
      'cursor:pointer',
    ].join(';');

    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ closeOnClick: false, closeButton: false, offset: 20 }).setHTML(
          `<div style="font-family:Inter,sans-serif;padding:4px">` +
            `<p style="font-weight:600;font-size:13px;color:#0F172A;margin:0 0 2px">${label}</p>` +
            `<p style="font-size:11px;color:#64748B;margin:0">${address}</p>` +
            `</div>`
        )
      )
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label, address]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-64 rounded-xl border border-primary-200 bg-primary-50">
        <div className="text-center px-6">
          <MapPin size={32} className="text-primary-300 mx-auto mb-3" />
          <p className="font-sans text-sm text-primary-500">Map view requires a Mapbox access token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-xl border border-primary-200 overflow-hidden bg-primary-100">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
