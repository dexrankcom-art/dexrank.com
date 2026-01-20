import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          This could happen if a DEX was removed from our database or if you
          followed an outdated link.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild size="lg">
            <Link href="/">Browse All DEXs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guides">Read Guides</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Looking for something specific?{' '}
          <Link href="/chains" className="text-primary hover:underline">
            Explore by Chain
          </Link>
          {' '}or{' '}
          <Link href="/categories" className="text-primary hover:underline">
            Browse by Category
          </Link>
        </p>
      </div>
    </div>
  );
}
