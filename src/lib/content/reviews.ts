import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface EditorialContent {
  editorsTake: string;
  prosConsExist: boolean;
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  lastUpdated?: string;
  tier: 1 | 2;
}

export interface ReviewFrontmatter {
  title: string;
  editorsTake: string;
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  lastUpdated?: string;
  tier?: 1 | 2;
}

/**
 * Check if editorial content exists for a protocol
 */
export function hasEditorialContent(slug: string): boolean {
  const filePath = path.join(process.cwd(), 'content/reviews', `${slug}.mdx`);
  return fs.existsSync(filePath);
}

/**
 * Load editorial content for a protocol
 * Returns null if no editorial content exists (Tier 3+ protocols)
 */
export async function getEditorialContent(slug: string): Promise<EditorialContent | null> {
  const filePath = path.join(process.cwd(), 'content/reviews', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(source);
    const frontmatter = data as ReviewFrontmatter;

    return {
      editorsTake: frontmatter.editorsTake || '',
      prosConsExist: !!(frontmatter.pros?.length || frontmatter.cons?.length),
      pros: frontmatter.pros,
      cons: frontmatter.cons,
      bestFor: frontmatter.bestFor,
      lastUpdated: frontmatter.lastUpdated,
      tier: frontmatter.tier || 2,
    };
  } catch (error) {
    console.error(`Error loading editorial content for ${slug}:`, error);
    return null;
  }
}

/**
 * Get all protocol slugs that have editorial content
 */
export async function getEditorialSlugs(): Promise<string[]> {
  const reviewsDir = path.join(process.cwd(), 'content/reviews');

  if (!fs.existsSync(reviewsDir)) {
    return [];
  }

  const files = fs.readdirSync(reviewsDir);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}
