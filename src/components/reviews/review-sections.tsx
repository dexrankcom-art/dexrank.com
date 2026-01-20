import { Badge } from '@/components/ui/badge';
import type { ProtocolWithMetrics } from '@/lib/data/types';
import type { EditorialContent } from '@/lib/content/reviews';
import { EditorsTake } from './editors-take';

interface ReviewSectionsProps {
  protocol: ProtocolWithMetrics;
  editorial?: EditorialContent | null;
}

export function ReviewSections({ protocol, editorial }: ReviewSectionsProps) {
  return (
    <div className="space-y-8">
      {/* Editor's Take Section - renders if editorial content exists */}
      {editorial?.editorsTake && (
        <EditorsTake
          content={editorial.editorsTake}
          lastUpdated={editorial.lastUpdated}
          bestFor={editorial.bestFor}
          pros={editorial.pros}
          cons={editorial.cons}
          tier={editorial.tier}
        />
      )}

      {/* Overview Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {protocol.description ? (
            <p>{protocol.description}</p>
          ) : (
            <p className="text-muted-foreground">
              {protocol.name} is a {protocol.category?.toLowerCase() || 'decentralized exchange'} protocol.
              {protocol.chains.length > 0 && (
                <> It operates across {protocol.chains.length} blockchain network{protocol.chains.length > 1 ? 's' : ''}.</>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Supported Chains Section */}
      {protocol.chains.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Supported Chains</h2>
          <div className="flex flex-wrap gap-2">
            {protocol.chains.map((chain) => (
              <Badge key={chain.id} variant="secondary" className="text-sm">
                {chain.logo && (
                  <img
                    src={chain.logo}
                    alt=""
                    className="h-4 w-4 mr-1.5 rounded-full"
                  />
                )}
                {chain.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Placeholder sections for future content (REVIEW-03) */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <p className="text-muted-foreground">
          Detailed feature analysis coming soon.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Fees</h2>
        <p className="text-muted-foreground">
          Fee structure information coming soon.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <p className="text-muted-foreground">
          Security audit information coming soon.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Verdict</h2>
        <p className="text-muted-foreground">
          Editorial verdict coming in Phase 3.
        </p>
      </section>
    </div>
  );
}
