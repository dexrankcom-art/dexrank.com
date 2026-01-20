import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Chain Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The blockchain you&apos;re looking for doesn&apos;t exist in our database.
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
