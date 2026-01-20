import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGuideBySlug, getAllGuideSlugs } from '@/lib/content/guides';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { generateGuideSchema } from '@/lib/seo/schemas';
import { Badge } from '@/components/ui/badge';

export const revalidate = 86400; // 24 hours for guides

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Guide Not Found - DexRank' };
  }

  return {
    title: `${guide.frontmatter.title} | DexRank Guides`,
    description: guide.frontmatter.description,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      type: 'article',
      publishedTime: guide.frontmatter.publishedAt,
      modifiedTime: guide.frontmatter.updatedAt,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = generateGuideSchema({
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    publishedAt: guide.frontmatter.publishedAt,
    updatedAt: guide.frontmatter.updatedAt,
    slug,
  });

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <Breadcrumbs items={[
        { name: 'Guides', href: '/guides' },
        { name: guide.frontmatter.title, href: `/guides/${slug}` },
      ]} />

      <JsonLd data={jsonLd} />

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {guide.frontmatter.difficulty && (
              <Badge variant="secondary">
                {guide.frontmatter.difficulty.charAt(0).toUpperCase() +
                  guide.frontmatter.difficulty.slice(1)}
              </Badge>
            )}
            {guide.frontmatter.readingTime && (
              <span className="text-sm text-muted-foreground">
                {guide.frontmatter.readingTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {guide.frontmatter.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-4">
            {guide.frontmatter.description}
          </p>

          <p className="text-sm text-muted-foreground">
            Published: {new Date(guide.frontmatter.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {guide.frontmatter.updatedAt && (
              <> | Last updated: {new Date(guide.frontmatter.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</>
            )}
          </p>
        </header>

        {/* MDX content - using dangerouslySetInnerHTML for raw content display */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br/>') }}
        />
      </article>
    </main>
  );
}
