import { ImageResponse } from 'next/og';
import { SITE_CONFIG } from '@/lib/seo/config';

export const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              background: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: 36, color: 'white' }}>
              PI
            </span>
          </div>
          <span style={{ fontFamily: 'system-ui', fontWeight: 700, fontSize: 48, color: 'white' }}>
            PlanningIndex
          </span>
        </div>
        <div
          style={{
            fontFamily: 'system-ui',
            fontWeight: 600,
            fontSize: 36,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
          }}
        >
          UK Planning Application Intelligence
        </div>
        <div
          style={{
            fontFamily: 'system-ui',
            fontWeight: 400,
            fontSize: 24,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            marginTop: '24px',
            maxWidth: '800px',
          }}
        >
          Search, track, and act on planning applications across the UK
        </div>
      </div>
    ),
    { ...size }
  );
}
