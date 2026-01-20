import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
      <p className="text-muted-foreground mb-8">
        This DEX category doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-primary hover:underline"
      >
        Browse all DEXs
      </Link>
    </main>
  );
}
