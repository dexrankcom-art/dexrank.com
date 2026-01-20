import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps {
  data: WithContext<Thing>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape < to prevent XSS via closing script tags
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
