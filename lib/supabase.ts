import { createClient } from '@supabase/supabase-js';

// Get these values from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    display_order: number;
    created_at: string;
}

export interface Service {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    short_description: string | null;
    display_order: number;
    created_at: string;
    category?: ServiceCategory;
}

export interface ServiceArticle {
    id: string;
    service_id: string;
    title: string;
    content: string | null;
    thumbnail: string | null;
    category: string | null;
    published: boolean;
    display_order: number;
    created_at: string;
    service?: Service;
}

// Helper functions to fetch data
export const fetchServices = async (): Promise<Service[]> => {
    const { data, error } = await supabase
        .from('services')
        .select('*, category:service_categories(*)')
        .order('display_order');

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }
    return data || [];
};

export const fetchServicesByCategory = async (categorySlug: string): Promise<Service[]> => {
    const { data, error } = await supabase
        .from('services')
        .select('*, category:service_categories!inner(*)')
        .eq('category.slug', categorySlug)
        .order('display_order');

    if (error) {
        console.error('Error fetching services by category:', error);
        return [];
    }
    return data || [];
};

export const fetchArticlesByService = async (serviceSlug: string): Promise<ServiceArticle[]> => {
    const { data, error } = await supabase
        .from('service_articles')
        .select('*, service:services!inner(*)')
        .eq('service.slug', serviceSlug)
        .eq('published', true)
        .order('display_order');

    if (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
    return data || [];
};

export const fetchAllArticles = async (): Promise<ServiceArticle[]> => {
    const { data, error } = await supabase
        .from('service_articles')
        .select('*, service:services(*)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching all articles:', error);
        return [];
    }
    return data || [];
};

// News Articles (E-Magazine section)
export interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    thumbnail: string | null;
    category: string;
    category_color: string | null;
    author: string | null;
    published: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export const fetchNewsArticles = async (limit: number = 4): Promise<NewsArticle[]> => {
    const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('published', true)
        .order('display_order')
        .limit(limit);

    if (error) {
        console.error('Error fetching news articles:', error);
        return [];
    }
    return data || [];
};
