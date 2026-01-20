import { BreadcrumbList, WithContext } from 'schema-dts';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = 'https://dexrank.com';

  // Build full breadcrumb path with Home
  const fullItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    ...items,
  ];

  // Generate JSON-LD BreadcrumbList schema
  const jsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      // Last item should not have 'item' property per Google spec
      item: index === fullItems.length - 1 ? undefined : `${baseUrl}${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          {fullItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {index === fullItems.length - 1 ? (
                // Current page - not a link
                <span aria-current="page" className="text-foreground font-medium truncate max-w-[200px]">
                  {index === 0 ? <Home className="h-4 w-4" /> : item.name}
                </span>
              ) : (
                // Link to parent pages
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {index === 0 ? <Home className="h-4 w-4" /> : item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
