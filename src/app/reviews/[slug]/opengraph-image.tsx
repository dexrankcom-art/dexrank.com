import { ImageResponse } from 'next/og';
import { getProtocolBySlug } from '@/lib/data/protocols';

export const alt = 'DEX Review';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Helper to format large numbers
function formatNumber(num: number | null | undefined): string {
  if (!num) return '$0';
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

// CRITICAL: In Next.js 16+, params is a Promise
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Must await!

  // Fetch DEX data
  const protocol = await getProtocolBySlug(slug);

  if (!protocol) {
    // Fallback for missing protocol
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
          DEX Not Found
        </div>
      ),
      { ...size }
    );
  }

  const tvl = formatNumber(protocol.latestMetrics?.tvl);
  const volume = formatNumber(protocol.latestMetrics?.volume24h);

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
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Protocol logo placeholder (or use actual logo if available) */}
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#2d1b4e',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
              fontSize: '40px',
              color: 'white',
            }}
          >
            {protocol.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-1px',
              }}
            >
              {protocol.name}
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'capitalize',
              }}
            >
              {protocol.category?.replace(/_/g, ' ') || 'DEX'}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: 'flex',
            gap: '60px',
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px',
              }}
            >
              Total Value Locked
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#4ade80',
              }}
            >
              {tvl}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px',
              }}
            >
              24h Volume
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {volume}
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
            dexrank.com/reviews/{slug}
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
