import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChainBySlug, getProtocolsByChain, getAllChainSlugs } from '@/lib/data/chains';
import { JsonLd } from '@/components/seo/json-ld';
import { generateChainSchema } from '@/lib/seo/schemas';
import { ChainHeader } from '@/components/chain/chain-header';
import { ChainDexList } from '@/components/chain/chain-dex-list';

export const revalidate = 3600; // 1 hour ISR

// Pre-generate all chain pages
export async function generateStaticParams() {
  const slugs = await getAllChainSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chain = await getChainBySlug(slug);

  if (!chain) {
    return { title: 'Chain Not Found - DexRank' };
  }

  const { totalCount } = await getProtocolsByChain(slug, 1);

  return {
    title: `Best DEXs on ${chain.name} - ${totalCount} Exchanges Ranked | DexRank`,
    description: `Compare the top ${totalCount} decentralized exchanges on ${chain.name}. Find the best DEX for trading on ${chain.name} by TVL, volume, and features.`,
    openGraph: {
      title: `Best DEXs on ${chain.name}`,
      description: `Top ${totalCount} DEXs ranked for ${chain.name} blockchain.`,
      images: chain.logo ? [{ url: chain.logo }] : [],
    },
  };
}

export default async function ChainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const chain = await getChainBySlug(slug);
  if (!chain) {
    notFound();
  }

  const { protocols, totalCount } = await getProtocolsByChain(slug, 100);

  // Calculate total TVL for the chain
  const totalTvl = protocols.reduce((sum, p) => sum + (p.tvl ?? 0), 0);

  const jsonLd = generateChainSchema(
    { name: chain.name, slug: chain.slug, logo: chain.logo },
    totalCount
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <JsonLd data={jsonLd} />

      <ChainHeader
        chain={chain}
        protocolCount={totalCount}
        totalTvl={totalTvl}
      />

      <ChainDexList protocols={protocols} chainName={chain.name} />
    </main>
  );
}
