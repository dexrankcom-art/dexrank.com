import { NextRequest } from 'next/server';
import { getProtocolBySlug } from '@/lib/data/protocols';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const protocol = await getProtocolBySlug(slug);

    if (!protocol) {
      return Response.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }

    return Response.json({ data: protocol });
  } catch (error) {
    console.error('Error fetching protocol:', error);
    return Response.json(
      { error: 'Failed to fetch protocol' },
      { status: 500 }
    );
  }
}
