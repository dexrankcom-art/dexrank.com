import Image from 'next/image';
import Link from 'next/link';

interface CategoryProtocol {
  id: number;
  slug: string;
  name: string;
  logo: string | null;
  category: string | null;
  tvl: number | null;
  volume24h: number | null;
}

interface CategoryDexListProps {
  protocols: CategoryProtocol[];
  categoryName: string;
}

function formatValue(value: number | null): string {
  if (value == null) return 'N/A';
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function CategoryDexList({ protocols, categoryName }: CategoryDexListProps) {
  if (protocols.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No {categoryName.toLowerCase()} found.
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        {categoryName} Rankings
      </h2>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">#</th>
              <th className="text-left p-3 font-medium">DEX</th>
              <th className="text-right p-3 font-medium">TVL</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((protocol, index) => (
              <tr
                key={protocol.id}
                className="border-t hover:bg-muted/30 transition-colors"
              >
                <td className="p-3 text-muted-foreground">{index + 1}</td>
                <td className="p-3">
                  <Link
                    href={`/reviews/${protocol.slug}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    {protocol.logo && (
                      <Image
                        src={protocol.logo}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium">{protocol.name}</span>
                  </Link>
                </td>
                <td className="p-3 text-right font-medium">
                  {formatValue(protocol.tvl)}
                </td>
                <td className="p-3 text-right hidden md:table-cell">
                  {formatValue(protocol.volume24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
