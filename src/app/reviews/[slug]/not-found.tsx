import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Protocol Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The DEX you&apos;re looking for doesn&apos;t exist in our database.
      </p>
      <Button asChild>
        <Link href="/">Browse All DEXs</Link>
      </Button>
    </main>
  );
}
