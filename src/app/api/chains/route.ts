import { getChains } from '@/lib/data/chains';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const chains = await getChains();

    return Response.json({ data: chains });
  } catch (error) {
    console.error('Error fetching chains:', error);
    return Response.json(
      { error: 'Failed to fetch chains' },
      { status: 500 }
    );
  }
}
