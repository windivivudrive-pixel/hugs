'use server';
import { decodeHTMLEntities, stripHtml } from './utils';


// Define cache tags for revalidation if needed
const API_URL = 'https://admin.hugs.agency/wp-json/wp/v2';
import { STATIC_SERVICES } from './staticData';export const fetchServices = async (): Promise<any[]> => {
    return STATIC_SERVICES;
};

export const fetchServiceCategories = async (): Promise<any[]> => {
    return [];
};

export const fetchProjectCategories = async (): Promise<any[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/project_category?per_page=100`, { next: { revalidate } });
        const categories = await res.json();
        return categories.map((c: any) => ({
            id: c.id,
            name: decodeHTMLEntities(c.name),
            slug: c.slug
        }));
    } catch (e) {
        console.error("fetchProjectCategories error:", e);
        return [];
    }
};

export const fetchArticlesByService = async (serviceSlug: string): Promise<any[]> => {
    // This is essentially getting all articles and filtering, but we can just use fetchAll for now
    // or we can fetch by tags if tags are linked to service slugs.
    const all = await fetchAllArticles();
    return all.filter(a => a.service?.slug === serviceSlug);
};

import { getProjectsLite } from './wordpress';

export const fetchAllArticles = async (): Promise<any[]> => {
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
        return data.map((item: any) => ({
            ...item,
            title: decodeHTMLEntities(item.title),
            category: decodeHTMLEntities(item.category),
        }));
    } catch (e) {
        console.error("fetchAllArticles error:", e);
        return [];
    }
};

export const fetchIndustries = async (): Promise<any[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/industry?per_page=100`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((d: any) => ({
            id: d.id,
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
export const fetchArticleBySlug = async (slug: string): Promise<any | null> => {
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
            content: post.content.rendered,
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
export const fetchCategories = async (): Promise<any[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/categories?per_page=100`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((cat: any) => ({
            id: cat.id,
            name: decodeHTMLEntities(cat.name),
            slug: cat.slug,
            count: cat.count,
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

export const fetchNewsArticles = async (limit = 10, offset = 0): Promise<any[]> => {
    try {
        const revalidate = 120;
        const res = await fetch(`${API_URL}/posts?per_page=${limit}&offset=${offset}&_embed`, { next: { revalidate } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((post: any) => {
            const embedded = post._embedded;
            const category = embedded?.['wp:term']?.[0]?.[0];
            const media = embedded?.['wp:featuredmedia']?.[0];
            
            return {
                id: post.id,
                title: decodeHTMLEntities(stripHtml(post.title.rendered)),
                slug: post.slug,
                excerpt: decodeHTMLEntities(stripHtml(post.excerpt.rendered)),
                content: post.content.rendered,
                thumbnail: media?.source_url || null,
                category: decodeHTMLEntities(category?.name || 'Tin tức'),
                category_slug: category?.slug || 'tin-tuc',
                created_at: post.date,
                updated_at: post.modified,
            };
        });
    } catch (e) {
        console.error("fetchNewsArticles error:", e);
        return [];
    }
};

