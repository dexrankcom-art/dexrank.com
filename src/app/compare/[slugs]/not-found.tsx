import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Comparison Not Found</h1>
      <p className="text-muted-foreground mb-8">
        One or both of the DEXs you&apos;re trying to compare doesn&apos;t exist in our database.
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
