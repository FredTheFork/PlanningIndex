import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'system-ui',
            fontWeight: 700,
            fontSize: 18,
            color: '#0284C7',
          }}
        >
          PI
        </span>
      </div>
    ),
    { ...size }
  );
}
