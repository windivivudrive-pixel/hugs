import { query } from './db';
import { WPPost, WPTerm, NewsArticle, Category, getCategoryColor } from './types';

// Lightweight post type for listing (no content)
type WPPostLite = Omit<WPPost, 'post_content'> & { post_content?: string; featured_image?: string };

/**
 * Extract first image src from HTML content for thumbnail
 */
function extractThumbnail(html: string): string | null {
    const match = /<img[^>]+src="([^">]+)"/i.exec(html);
    return match ? match[1] : null;
}

/**
 * Strip HTML tags and create excerpt
 */
function createExcerpt(html: string, length = 160): string {
    const text = html.replace(/<[^>]*>?/gm, '').trim();
    return text.substring(0, length) + (text.length > length ? '...' : '');
}

/**
 * Transform WP post row to frontend-friendly NewsArticle
 */
function transformPost(
    post: WPPost | WPPostLite,
    categoryName = 'Tin tức',
    categorySlug = 'tin-tuc'
): NewsArticle {
    const content = post.post_content || '';
    return {
        id: post.ID,
        title: post.post_title,
        slug: post.post_name,
        excerpt: post.post_excerpt || createExcerpt(content),
        content: content,
        thumbnail: (post as WPPostLite).featured_image || extractThumbnail(content) || null,
        category: categoryName,
        category_slug: categorySlug,
        category_color: getCategoryColor(categorySlug),
        author: 'Admin',
        created_at: post.post_date,
        updated_at: post.post_modified,
        views: 0,
    };
}

// ============================================================
// POST QUERIES
// ============================================================

/**
 * Get published posts with pagination and their primary category
 */
export async function getPublishedPosts(
    limit = 20,
    offset = 0
): Promise<NewsArticle[]> {
    const posts = await query<WPPost & { cat_name?: string; cat_slug?: string }>(
        `SELECT p.*, 
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name,
            (SELECT t.slug FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_slug
     FROM wp_posts p
     WHERE p.post_type = 'post' 
       AND p.post_status = 'publish'
     ORDER BY p.post_date DESC
     LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    return posts.map((post) =>
        transformPost(post, post.cat_name || 'Tin tức', post.cat_slug || 'tin-tuc')
    );
}

/**
 * Lightweight listing query — skips post_content, fetches featured image from postmeta.
 * Much faster over SSH tunnel since post_content can be very large.
 */
export async function getPublishedPostsLite(
    limit = 30,
    offset = 0
): Promise<NewsArticle[]> {
    const posts = await query<WPPostLite & { cat_name?: string; cat_slug?: string }>(
        `SELECT p.ID, p.post_title, p.post_name, p.post_excerpt, p.post_date, p.post_modified, p.post_status,
            COALESCE(
                (SELECT pm2.meta_value FROM wp_postmeta pm
                 INNER JOIN wp_posts p2 ON pm.meta_value = p2.ID
                 INNER JOIN wp_postmeta pm2 ON p2.ID = pm2.post_id AND pm2.meta_key = '_wp_attached_file'
                 WHERE pm.post_id = p.ID AND pm.meta_key = '_thumbnail_id' LIMIT 1),
                NULL
            ) AS featured_image,
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name,
            (SELECT t.slug FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_slug
     FROM wp_posts p
     WHERE p.post_type = 'post' 
       AND p.post_status = 'publish'
     ORDER BY p.post_date DESC
     LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    return posts.map((post) => {
        // Build thumbnail URL from attachment file path if available
        let thumbnail: string | null = null;
        if (post.featured_image) {
            // If it's a full URL, use as-is; otherwise construct WordPress upload URL
            thumbnail = post.featured_image.startsWith('http')
                ? post.featured_image
                : `https://hugs.agency/wp-content/uploads/${post.featured_image}`;
        }
        return {
            ...transformPost(post, post.cat_name || 'Tin tức', post.cat_slug || 'tin-tuc'),
            thumbnail,
        };
    });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<NewsArticle | null> {
    const posts = await query<WPPost & { cat_name?: string; cat_slug?: string }>(
        `SELECT p.*, 
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name,
            (SELECT t.slug FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_slug
     FROM wp_posts p
     WHERE p.post_name = ? 
       AND p.post_type = 'post'
       AND p.post_status = 'publish'
     LIMIT 1`,
        [slug]
    );

    if (!posts.length) return null;
    const post = posts[0];
    return transformPost(post, post.cat_name || 'Tin tức', post.cat_slug || 'tin-tuc');
}

/**
 * Get posts by category slug
 */
export async function getPostsByCategory(
    categorySlug: string,
    limit = 20,
    offset = 0
): Promise<NewsArticle[]> {
    const posts = await query<WPPost & { cat_name?: string; cat_slug?: string }>(
        `SELECT p.*,
            t2.name AS cat_name, t2.slug AS cat_slug
     FROM wp_posts p
     INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
     INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
     INNER JOIN wp_terms t2 ON tt.term_id = t2.term_id
     WHERE t2.slug = ?
       AND tt.taxonomy = 'category'
       AND p.post_type = 'post'
       AND p.post_status = 'publish'
     ORDER BY p.post_date DESC
     LIMIT ? OFFSET ?`,
        [categorySlug, limit, offset]
    );

    return posts.map((post) =>
        transformPost(post, post.cat_name || categorySlug, post.cat_slug || categorySlug)
    );
}

/**
 * Get total post count (for pagination)
 */
export async function getPostCount(categorySlug?: string): Promise<number> {
    if (categorySlug) {
        const rows = await query<{ total: number }>(
            `SELECT COUNT(DISTINCT p.ID) as total
       FROM wp_posts p
       INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
       INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
       INNER JOIN wp_terms t ON tt.term_id = t.term_id
       WHERE t.slug = ?
         AND tt.taxonomy = 'category'
         AND p.post_type = 'post'
         AND p.post_status = 'publish'`,
            [categorySlug]
        );
        return rows[0]?.total || 0;
    }

    const rows = await query<{ total: number }>(
        `SELECT COUNT(*) as total FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish'`
    );
    return rows[0]?.total || 0;
}

// ============================================================
// CATEGORY QUERIES
// ============================================================

/**
 * Get all post categories with post count
 */
export async function getCategories(): Promise<Category[]> {
    const cats = await query<WPTerm & { count: number }>(
        `SELECT t.term_id, t.name, t.slug, tt.count
     FROM wp_terms t
     INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
     WHERE tt.taxonomy = 'category'
       AND tt.count > 0
     ORDER BY tt.count DESC`
    );

    return cats.map((cat) => ({
        id: cat.term_id,
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
        color: getCategoryColor(cat.slug),
    }));
}

/**
 * Get featured image URL from wp_postmeta
 */
export async function getFeaturedImage(postId: number): Promise<string | null> {
    const rows = await query<{ guid: string }>(
        `SELECT p2.guid
     FROM wp_postmeta pm
     INNER JOIN wp_posts p2 ON pm.meta_value = p2.ID
     WHERE pm.post_id = ?
       AND pm.meta_key = '_thumbnail_id'
     LIMIT 1`,
        [postId]
    );

    return rows[0]?.guid || null;
}

/**
 * Search posts by keyword
 */
export async function searchPosts(
    keyword: string,
    limit = 20
): Promise<NewsArticle[]> {
    const searchTerm = `%${keyword}%`;
    const posts = await query<WPPost & { cat_name?: string; cat_slug?: string }>(
        `SELECT p.*,
            (SELECT t.name FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_name,
            (SELECT t.slug FROM wp_term_relationships tr
             INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
             INNER JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID LIMIT 1) AS cat_slug
     FROM wp_posts p
     WHERE p.post_type = 'post'
       AND p.post_status = 'publish'
       AND (p.post_title LIKE ? OR p.post_content LIKE ?)
     ORDER BY p.post_date DESC
     LIMIT ?`,
        [searchTerm, searchTerm, limit]
    );

    return posts.map((post) =>
        transformPost(post, post.cat_name || 'Tin tức', post.cat_slug || 'tin-tuc')
    );
}
