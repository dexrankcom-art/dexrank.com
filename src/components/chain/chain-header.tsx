import Image from 'next/image';
import type { Chain } from '@/lib/data/types';

interface ChainHeaderProps {
  chain: Chain;
  protocolCount: number;
  totalTvl: number | null;
}

function formatTvl(tvl: number | null): string {
  if (tvl == null) return 'N/A';
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
  return `$${tvl.toFixed(0)}`;
}

export function ChainHeader({ chain, protocolCount, totalTvl }: ChainHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        {chain.logo && (
          <Image
            src={chain.logo}
            alt={chain.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Best DEXs on {chain.name}
          </h1>
          <p className="text-muted-foreground">
            Top {protocolCount} decentralized exchanges ranked by TVL and volume
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">DEXs on {chain.name}</p>
          <p className="text-2xl font-bold">{protocolCount}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Combined TVL</p>
          <p className="text-2xl font-bold">{formatTvl(totalTvl)}</p>
        </div>
        {chain.chainId && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Chain ID</p>
            <p className="text-2xl font-bold">{chain.chainId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
