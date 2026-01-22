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
    logo: string | null;
    category: string | null;
    published: boolean;
    featured: boolean;
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

// Storage helpers for thumbnail upload/delete
const THUMBNAIL_BUCKET = 'hugs';

export const uploadThumbnail = async (file: File, folder: 'news' | 'service' | 'logo'): Promise<{ url: string | null; error: any }> => {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from(THUMBNAIL_BUCKET)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading thumbnail:', error);
            return { url: null, error };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(THUMBNAIL_BUCKET)
            .getPublicUrl(data.path);

        return { url: urlData.publicUrl, error: null };
    } catch (err) {
        console.error('Error uploading thumbnail:', err);
        return { url: null, error: err };
    }
};

export const deleteThumbnail = async (thumbnailUrl: string): Promise<boolean> => {
    try {
        if (!thumbnailUrl) return true;

        // Extract file path from URL
        // URL format: https://xxx.supabase.co/storage/v1/object/public/thumbnails/path/to/file.jpg
        const urlParts = thumbnailUrl.split(`/storage/v1/object/public/${THUMBNAIL_BUCKET}/`);
        if (urlParts.length < 2) {
            console.warn('Invalid thumbnail URL format, skipping delete');
            return true; // Not a Supabase storage URL, skip deletion
        }

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(THUMBNAIL_BUCKET)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting thumbnail:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error deleting thumbnail:', err);
        return false;
    }
};
