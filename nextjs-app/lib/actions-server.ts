'use server';

import { getDB } from './db';

const safeJsonParse = (val: any) => {
    try {
        if (typeof val === 'string') return JSON.parse(val);
        return val || [];
    } catch {
        return [];
    }
}

export const fetchServices = async (): Promise<any[]> => {
    try {
        const db = await getDB();
        const [rows]: any = await db.query(`
            SELECT p.ID as id, p.post_title as title, p.post_name as slug, p.post_content as description,
                   MAX(CASE WHEN pm.meta_key = '_hugs_icon' THEN pm.meta_value END) as icon,
                   MAX(CASE WHEN pm.meta_key = '_thumbnail_url' THEN pm.meta_value END) as thumbnail,
                   MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) as display_order
            FROM wp_posts p
            LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
            WHERE p.post_type = 'service' AND p.post_status = 'publish'
            GROUP BY p.ID
            ORDER BY CAST(MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) AS UNSIGNED) ASC
        `);
        
        return rows.map((row: any) => ({
            ...row,
            name: row.title,
            category: null
        }));
    } catch (e) {
        console.error("fetchServices error:", e);
        return [];
    }
};

export const fetchServiceCategories = async (): Promise<any[]> => {
    // Services no longer use categories in this new architecture
    return [];
};

export const fetchProjectCategories = async (serviceId: string): Promise<any[]> => {
    try {
        const db = await getDB();
        const [rows]: any = await db.query(`
            SELECT t.term_id as id, t.name, t.slug 
            FROM wp_terms t
            INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
            WHERE tt.taxonomy = 'project_category'
        `);
        return rows;
    } catch (e) {
        console.error("fetchProjectCategories error:", e);
        return [];
    }
};

export const fetchArticlesByService = async (serviceSlug: string): Promise<any[]> => {
    try {
        const db = await getDB();
        
        // 1. Get the Service ID from slug
        const [services]: any = await db.query(`SELECT ID, post_title, post_name FROM wp_posts WHERE post_name = ? AND post_type = 'service'`, [serviceSlug]);
        if (!services || services.length === 0) return [];
        const service = services[0];

        // 2. Query Projects linked to this Service
        const [rows]: any = await db.query(`
            SELECT p.ID as id, p.post_title as title, p.post_name as slug, p.post_content as content, p.post_excerpt as excerpt, p.post_date as created_at,
                   MAX(CASE WHEN pm.meta_key = '_thumbnail_url' THEN pm.meta_value END) as thumbnail,
                   MAX(CASE WHEN pm.meta_key = '_hugs_featured' THEN pm.meta_value END) as featured,
                   MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) as display_order,
                   MAX(CASE WHEN pm.meta_key = '_hugs_logo' THEN pm.meta_value END) as logo
            FROM wp_posts p
            INNER JOIN wp_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = '_hugs_service_id' AND pm2.meta_value = ?
            LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
            WHERE p.post_type = 'project' AND p.post_status = 'publish'
            GROUP BY p.ID
            ORDER BY CAST(MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) AS UNSIGNED) ASC
        `, [service.ID]);
        
        return rows.map((row: any) => ({
            ...row,
            featured: row.featured === '1',
            service: { id: service.ID, title: service.post_title, slug: service.post_name },
            project_category_ids: []
        }));
    } catch (e) {
        console.error("fetchArticlesByService error:", e);
        return [];
    }
};

export const fetchAllArticles = async (): Promise<any[]> => {
    try {
        const db = await getDB();
        const [rows]: any = await db.query(`
            SELECT p.ID as id, p.post_title as title, p.post_name as slug, p.post_content as content, p.post_excerpt as excerpt, p.post_date as created_at,
                   MAX(CASE WHEN pm.meta_key = '_thumbnail_url' THEN pm.meta_value END) as thumbnail,
                   MAX(CASE WHEN pm.meta_key = '_hugs_featured' THEN pm.meta_value END) as featured,
                   MAX(CASE WHEN pm.meta_key = '_hugs_service_id' THEN pm.meta_value END) as service_id,
                   MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) as display_order,
                   MAX(CASE WHEN pm.meta_key = '_hugs_logo' THEN pm.meta_value END) as logo
            FROM wp_posts p
            LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
            WHERE p.post_type = 'project' AND p.post_status = 'publish'
            GROUP BY p.ID
            ORDER BY CAST(MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) AS UNSIGNED) ASC, p.post_date DESC
            LIMIT 100
        `);
        
        return rows.map((row: any) => ({
            ...row,
            featured: row.featured === '1',
            service_id: row.service_id ? parseInt(row.service_id) : null,
            project_category_ids: [],
            service: row.service_id ? { id: parseInt(row.service_id) } : null
        }));
    } catch (e) {
        console.error("fetchAllArticles error:", e);
        return [];
    }
};

export const fetchNewsArticles = async (limit?: number): Promise<any[]> => {
    return [];
};
