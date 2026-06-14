import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') || 'Foundationary';
  const description = searchParams.get('description') || 'Professional documents, website copy & social media for UK sole traders';
  const type = searchParams.get('type') || 'default';

  const accentColor = type === 'pricing' ? '#0D7C5F' : '#1B3F7A';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#FFFFFF',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: accentColor,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              color: 'white',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            F
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#1B3F7A',
            }}
          >
            Foundationary
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '24px',
            color: '#475569',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          {description}
        </div>

        {/* Bottom tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
            gap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: accentColor,
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: 500,
            }}
          >
            UK Sole Traders
          </div>
          <div
            style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: 500,
            }}
          >
            From £20
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
