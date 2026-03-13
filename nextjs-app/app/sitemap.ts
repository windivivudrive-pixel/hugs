import { MetadataRoute } from 'next';
import { getPublishedPosts, getCategories } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hugs.agency';

  // Static routes
  const staticRoutes = [
    '',
    '/news',
    '/service',
    '/projects',
    '/allprojects',
    '/about',
    '/careers',
    '/advise'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Dynamic article routes
    const posts = await getPublishedPosts(100, 0); // Get latest 100 for sitemap
    
    const articleRoutes = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...articleRoutes];
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
    return staticRoutes;
  }
}
