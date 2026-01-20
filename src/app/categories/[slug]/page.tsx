import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCategoryBySlug,
  getProtocolsByCategory,
  getCategoryContent,
  getAllCategorySlugs,
} from '@/lib/data/categories';
import { JsonLd } from '@/components/seo/json-ld';
import { generateCategorySchema } from '@/lib/seo/schemas';
import { CategoryHeader } from '@/components/category/category-header';
import { CategoryDexList } from '@/components/category/category-dex-list';

export const revalidate = 3600; // 1 hour ISR

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false; // Only allow defined categories

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found - DexRank' };
  }

  const { totalCount } = await getProtocolsByCategory(slug, 1);

  return {
    title: `Best ${category.pluralName} 2026 - ${totalCount} Exchanges Ranked | DexRank`,
    description: `Compare the top ${totalCount} ${category.pluralName.toLowerCase()}. ${category.description} Find the best ${category.name.toLowerCase()} for your needs.`,
    openGraph: {
      title: `Best ${category.pluralName} 2026`,
      description: `Top ${totalCount} ${category.pluralName.toLowerCase()} ranked by TVL and volume.`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const [{ protocols, totalCount }, content] = await Promise.all([
    getProtocolsByCategory(slug, 100),
    getCategoryContent(slug),
  ]);

  const jsonLd = generateCategorySchema(
    { name: category.pluralName, slug: category.slug, description: category.description },
    totalCount
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <JsonLd data={jsonLd} />

      <CategoryHeader
        category={category}
        protocolCount={totalCount}
        intro={content?.intro}
      />

      <CategoryDexList protocols={protocols} categoryName={category.pluralName} />
    </main>
  );
}
