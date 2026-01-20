import type { CategoryMeta } from '@/lib/data/categories';

interface CategoryHeaderProps {
  category: CategoryMeta;
  protocolCount: number;
  intro?: string;
}

export function CategoryHeader({ category, protocolCount, intro }: CategoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Best {category.pluralName} in 2026
      </h1>
      <p className="text-muted-foreground mb-4">
        {protocolCount} {category.pluralName.toLowerCase()} ranked by TVL and volume
      </p>

      {intro && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-sm leading-relaxed">{intro}</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {category.description}
      </p>
    </div>
  );
}
