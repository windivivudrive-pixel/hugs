'use server';
import { decodeHTMLEntities, stripHtml } from './utils';
import { type ServiceArticle, type NewsArticle, type Category, type ProjectCategory, type ServiceItem, type ServiceCategory } from './types';
import { STATIC_SERVICES } from './staticData';

// Define cache tags for revalidation if needed
const API_URL = 'https://admin.hugs.agency/wp-json/wp/v2';

export const fetchServices = async (): Promise<ServiceItem[]> => {
    return STATIC_SERVICES as ServiceItem[];
};

export const fetchServiceCategories = async (): Promise<ServiceCategory[]> => {
    return [];
};

export const fetchProjectCategories = async (): Promise<ProjectCategory[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/project_category?per_page=100`, { next: { revalidate } });
        const categories = await res.json();
        return categories.map((c: { id: number; name: string; slug: string }) => ({
            id: String(c.id),
            name: decodeHTMLEntities(c.name),
            slug: c.slug,
            display_order: 0
        }));
    } catch (e) {
        console.error("fetchProjectCategories error:", e);
        return [];
    }
};

export const fetchArticlesByService = async (serviceSlug: string): Promise<ServiceArticle[]> => {
    const all = await fetchAllArticles();
    return all.filter(a => a.service_id === serviceSlug);
};

export const fetchAllArticles = async (): Promise<ServiceArticle[]> => {
    try {
        const revalidate = 120;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        
        const res = await fetch(`https://admin.hugs.agency/api-projects.php`, { 
            next: { revalidate },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`Failed to fetch custom endpoint: ${res.statusText}`);
        const data = await res.json();
        return data.map((item: ServiceArticle) => ({
            ...item,
            title: decodeHTMLEntities(item.title),
            category: decodeHTMLEntities(item.category || ''),
            content: (item.content || '').replaceAll('https://admin.hugs.agency', 'https://hugs.agency').replaceAll('http://admin.hugs.agency', 'https://hugs.agency'),
        }));
    } catch (e) {
        console.error("fetchAllArticles error:", e);
        return [];
    }
};

export interface Industry {
    id: string;
    name: string;
    slug: string;
}

export const fetchIndustries = async (): Promise<Industry[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/industry?per_page=100`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((d: { id: number; name: string; slug: string }) => ({
            id: String(d.id),
            name: decodeHTMLEntities(d.name),
            slug: d.slug
        }));
    } catch (e) {
        console.error("fetchIndustries error:", e);
        return [];
    }
};

/**
 * Fetch a single news article by slug using the WordPress REST API
 */
export const fetchArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`, { next: { revalidate } });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.length === 0) return null;
        
        const post = data[0];
        const embedded = post._embedded;
        const category = embedded?.['wp:term']?.[0]?.[0];
        const media = embedded?.['wp:featuredmedia']?.[0];
        
        return {
            id: post.id,
            title: decodeHTMLEntities(stripHtml(post.title.rendered)),
            slug: post.slug,
            excerpt: decodeHTMLEntities(stripHtml(post.excerpt.rendered)),
            content: post.content.rendered.replaceAll('https://admin.hugs.agency', 'https://hugs.agency').replaceAll('http://admin.hugs.agency', 'https://hugs.agency'),
            thumbnail: media?.source_url || null,
            category: decodeHTMLEntities(category?.name || 'Tin tức'),
            category_slug: category?.slug || 'tin-tuc',
            author: 'Admin',
            created_at: post.date,
            updated_at: post.modified,
            views: 0
        };
    } catch (e) {
        console.error(`fetchArticleBySlug error (${slug}):`, e);
        return null;
    }
};

/**
 * Fetch post categories using the WordPress REST API
 */
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/categories?per_page=100`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((cat: { id: number; name: string; slug: string; count: number }): Category => ({
            id: cat.id,
            name: decodeHTMLEntities(cat.name),
            slug: cat.slug,
            count: cat.count,
            color: '#2196F3'
        }));
    } catch (e) {
        console.error("fetchCategories error:", e);
        return [];
    }
};

/**
 * Fetch total post count using the WordPress REST API
 */
export const fetchPostCount = async (): Promise<number> => {
    try {
        const res = await fetch(`${API_URL}/posts?per_page=1`, { method: 'HEAD' });
        const total = res.headers.get('x-wp-total');
        return total ? parseInt(total) : 0;
    } catch (e) {
        console.error("fetchPostCount error:", e);
        return 0;
    }
};

export const fetchNewsArticles = async (limit = 10, offset = 0): Promise<NewsArticle[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/posts?per_page=${limit}&offset=${offset}&_embed`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((post: { 
            id: number; 
            title: { rendered: string }; 
            slug: string; 
            excerpt: { rendered: string }; 
            content: { rendered: string }; 
            date: string; 
            modified: string; 
            _embedded?: {
                'wp:term'?: { name: string; slug: string }[][];
                'wp:featuredmedia'?: { source_url: string }[];
            }
        }): NewsArticle => {
            const embedded = post._embedded;
            const category = embedded?.['wp:term']?.[0]?.[0];
            const media = embedded?.['wp:featuredmedia']?.[0];
            
            return {
                id: post.id,
                title: decodeHTMLEntities(stripHtml(post.title.rendered)),
                slug: post.slug,
                excerpt: decodeHTMLEntities(stripHtml(post.excerpt.rendered)),
                content: post.content.rendered.replaceAll('https://admin.hugs.agency', 'https://hugs.agency').replaceAll('http://admin.hugs.agency', 'https://hugs.agency'),
                thumbnail: media?.source_url || null,
                category: decodeHTMLEntities(category?.name || 'Tin tức'),
                category_slug: category?.slug || 'tin-tuc',
                author: 'Admin',
                views: 0,
                created_at: post.date,
                updated_at: post.modified,
            };
        });
    } catch (e) {
        console.error("fetchNewsArticles error:", e);
        return [];
    }
};

// ============================================================
// PER-CATEGORY FEED (production-ready)
// ============================================================

import { getTopPostsPerCategory, getPostsByCategoryCursor, type CategoryFeedResult } from './wordpress';

/** Category slugs used on the news page */
const NEWS_CATEGORY_SLUGS = [
    'tin-marketing',
    'xu-huong',
    'gioi-tre',
    'su-kien',
    'tin-hugs-agency',
];

/**
 * Fetch initial feeds: top 10 posts per category in one query.
 * Used by the news page SSR.
 */
export const fetchInitialFeeds = async (
    perCategory: number = 10
): Promise<Record<string, CategoryFeedResult>> => {
    try {
        return await getTopPostsPerCategory(NEWS_CATEGORY_SLUGS, perCategory);
    } catch (e) {
        console.error('fetchInitialFeeds error:', e);
        const empty: Record<string, CategoryFeedResult> = {};
        for (const slug of NEWS_CATEGORY_SLUGS) {
            empty[slug] = { articles: [], cursor: null, hasMore: false };
        }
        return empty;
    }
};

/**
 * Fetch next page for a specific category using keyset cursor.
 * Used by the load-more API route.
 */
export const fetchCategoryPage = async (
    categorySlug: string,
    cursor: string | null,
    limit: number = 10
): Promise<CategoryFeedResult> => {
    try {
        return await getPostsByCategoryCursor(categorySlug, cursor, limit);
    } catch (e) {
        console.error('fetchCategoryPage error:', e);
        return { articles: [], cursor: null, hasMore: false };
    }
};

