import type { ProtocolWithMetrics } from '@/lib/data/types';
import { Badge } from '@/components/ui/badge';

interface FeatureTableProps {
  dex1: ProtocolWithMetrics;
  dex2: ProtocolWithMetrics;
}

export function FeatureTable({ dex1, dex2 }: FeatureTableProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Feature Comparison</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* DEX 1 Features */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">{dex1.name}</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <Badge variant="secondary">{dex1.category || 'DEX'}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Supported Chains ({dex1.chains.length})</p>
              <div className="flex flex-wrap gap-1">
                {dex1.chains.slice(0, 8).map((chain) => (
                  <Badge key={chain.id} variant="outline" className="text-xs">
                    {chain.name}
                  </Badge>
                ))}
                {dex1.chains.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{dex1.chains.length - 8} more
                  </Badge>
                )}
              </div>
            </div>

            {dex1.url && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Website</p>
                <a
                  href={dex1.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {new URL(dex1.url).hostname}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* DEX 2 Features */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">{dex2.name}</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <Badge variant="secondary">{dex2.category || 'DEX'}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Supported Chains ({dex2.chains.length})</p>
              <div className="flex flex-wrap gap-1">
                {dex2.chains.slice(0, 8).map((chain) => (
                  <Badge key={chain.id} variant="outline" className="text-xs">
                    {chain.name}
                  </Badge>
                ))}
                {dex2.chains.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{dex2.chains.length - 8} more
                  </Badge>
                )}
              </div>
            </div>

            {dex2.url && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Website</p>
                <a
                  href={dex2.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {new URL(dex2.url).hostname}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
