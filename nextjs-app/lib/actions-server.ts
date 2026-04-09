'use server';

// Define cache tags for revalidation if needed
const API_URL = 'https://hugs.agency/wp-json/wp/v2';
import { STATIC_SERVICES } from './staticData';

export const fetchServices = async (): Promise<any[]> => {
    return STATIC_SERVICES;
};

export const fetchServiceCategories = async (): Promise<any[]> => {
    return [];
};

export const fetchProjectCategories = async (): Promise<any[]> => {
    try {
        const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60;
        const res = await fetch(`${API_URL}/project_category?per_page=100`, { next: { revalidate } });
        const categories = await res.json();
        return categories.map((c: any) => ({
            id: c.id,
            name: c.name,
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

export const fetchAllArticles = async (): Promise<any[]> => {
    try {
        const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60;
        const res = await fetch(`https://hugs.agency/api-projects.php`, { next: { revalidate } });
        if (!res.ok) throw new Error(`Failed to fetch custom endpoint: ${res.statusText}`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("fetchAllArticles error:", e);
        return [];
    }
};

export const fetchNewsArticles = async (limit?: number): Promise<any[]> => {
    return [];
};

