import { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides } from '@/lib/content/guides';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'DeFi & DEX Guides | DexRank',
  description: 'Learn about decentralized exchanges, liquidity pools, impermanent loss, and more. Educational guides for DeFi beginners and experts.',
};

export const revalidate = 86400; // 24 hours

export default async function GuidesPage() {
  const guides = await getAllGuides();

  // Group guides by difficulty
  const beginnerGuides = guides.filter(g => g.difficulty === 'beginner');
  const intermediateGuides = guides.filter(g => g.difficulty === 'intermediate');
  const advancedGuides = guides.filter(g => g.difficulty === 'advanced');

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">DeFi Guides</h1>
        <p className="text-muted-foreground mb-8">
          Learn everything about decentralized exchanges, from basics to advanced strategies.
        </p>

        {beginnerGuides.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Badge variant="secondary">Beginner</Badge>
              Getting Started
            </h2>
            <div className="space-y-4">
              {beginnerGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {intermediateGuides.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Badge variant="secondary">Intermediate</Badge>
              Building Knowledge
            </h2>
            <div className="space-y-4">
              {intermediateGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {advancedGuides.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Badge variant="secondary">Advanced</Badge>
              Deep Dives
            </h2>
            <div className="space-y-4">
              {advancedGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {guides.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No guides available yet.
          </p>
        )}
      </div>
    </main>
  );
}

function GuideCard({ guide }: { guide: { slug: string; title: string; description: string; readingTime?: string; updatedAt?: string } }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="block border rounded-lg p-6 hover:border-primary transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{guide.title}</h3>
        {guide.readingTime && (
          <span className="text-xs text-muted-foreground">
            {guide.readingTime}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-2">{guide.description}</p>
      {guide.updatedAt && (
        <p className="text-xs text-muted-foreground">
          Updated: {new Date(guide.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      )}
    </Link>
  );
}
