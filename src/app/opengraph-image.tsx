import { ImageResponse } from 'next/og';

export const alt = 'DexRank - DEX Rankings & Reviews';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a0a2e',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo/Brand mark area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Simple brand icon - star shape */}
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#4ade80',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}
          >
            ★
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            letterSpacing: '-2px',
          }}
        >
          DexRank
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
          }}
        >
          DEX Rankings & Reviews
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold', color: '#4ade80' }}>
              500+
            </div>
            <div style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.7)' }}>
              DEXs Ranked
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold', color: '#4ade80' }}>
              27+
            </div>
            <div style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.7)' }}>
              Chains
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          dexrank.com
        </div>
      </div>
    ),
    { ...size }
  );
}
