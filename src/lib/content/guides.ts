import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface GuideFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  readingTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Guide {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
}

export interface GuideListItem {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const GUIDES_DIR = path.join(process.cwd(), 'content/guides');

/**
 * Get a single guide by slug
 */
export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(source);

    return {
      slug,
      frontmatter: data as GuideFrontmatter,
      content,
    };
  } catch {
    return null;
  }
}

/**
 * Get all guide slugs for static generation
 */
export async function getAllGuideSlugs(): Promise<string[]> {
  if (!fs.existsSync(GUIDES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(GUIDES_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get all guides for listing
 */
export async function getAllGuides(): Promise<GuideListItem[]> {
  const slugs = await getAllGuideSlugs();
  const guides: GuideListItem[] = [];

  for (const slug of slugs) {
    const guide = await getGuideBySlug(slug);
    if (guide) {
      guides.push({
        slug,
        title: guide.frontmatter.title,
        description: guide.frontmatter.description,
        publishedAt: guide.frontmatter.publishedAt,
        updatedAt: guide.frontmatter.updatedAt,
        readingTime: guide.frontmatter.readingTime,
        difficulty: guide.frontmatter.difficulty,
      });
    }
  }

  // Sort by publish date (newest first)
  return guides.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
