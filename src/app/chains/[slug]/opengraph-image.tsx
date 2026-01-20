import { ImageResponse } from 'next/og';
import { getChainBySlug, getProtocolCountByChain } from '@/lib/data/chains';

export const alt = 'Chain DEX Rankings';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// CRITICAL: In Next.js 16+, params is a Promise
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Must await!

  // Fetch chain data
  const chain = await getChainBySlug(slug);
  const dexCount = await getProtocolCountByChain(slug);

  if (!chain) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a0a2e',
            color: 'white',
            fontSize: 48,
          }}
        >
          Chain Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a0a2e',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Chain icon placeholder */}
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#2d1b4e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
              fontSize: '40px',
              color: 'white',
            }}
          >
            {chain.name.charAt(0).toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            {chain.name}
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '16px',
            }}
          >
            Top DEXs on {chain.name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: 120,
                fontWeight: 'bold',
                color: '#4ade80',
                lineHeight: 1,
              }}
            >
              {dexCount}
            </div>
            <div
              style={{
                fontSize: 40,
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              DEXs Ranked
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.5)' }}>
            dexrank.com/chains/{slug}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#4ade80',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              ★
            </div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
              DexRank
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
