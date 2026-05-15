// TypeScript interfaces for WordPress database tables

export interface WPPost {
    ID: number;
    post_author: number;
    post_date: string;
    post_date_gmt: string;
    post_content: string;
    post_title: string;
    post_excerpt: string;
    post_status: string;
    comment_status: string;
    ping_status: string;
    post_password: string;
    post_name: string; // slug
    post_modified: string;
    post_modified_gmt: string;
    post_parent: number;
    guid: string;
    menu_order: number;
    post_type: string;
    post_mime_type: string;
    comment_count: number;
}

export interface WPTerm {
    term_id: number;
    name: string;
    slug: string;
    term_group: number;
    term_order: number;
}

export interface WPTermTaxonomy {
    term_taxonomy_id: number;
    term_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
}

// Transformed types for frontend use

export interface AdminAuthor {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  role: string;
  article_count?: number;
  total_views?: number;
}

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}
export interface ProjectCategory {
    id: string;
    name: string;
    slug: string;
    display_order: number;
}

export interface ServiceArticle {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  thumbnail: string;
  service_id: string;
  logo?: string;
  project_category_id?: string;
  project_category_ids?: number[];
  project_industry_ids?: number[];
  service_category_id?: string;
  category?: string;
  project_category?: ProjectCategory;
  industry?: { id: string; name: string };
  service?: { id?: string; name: string; slug: string };
  featured?: boolean;
  created_at?: string;
  views?: number;
}

export interface NewsArticle {
  author_id?: string;
  published?: boolean;
  display_order?: number;
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  category: string;
  category_color?: string;
  category_slug?: string;
  author: string;
  author_details?: {
    name: string;
    avatar_url: string;
  };
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    count: number;
    color: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    slug: string;
    short_description: string | null;
    display_order: number;
}

export type Service = ServiceItem;

// Category color mapping
export const CATEGORY_COLORS: Record<string, string> = {
    'tin-marketing': '#E91E63',
    'xu-huong': '#9C27B0',
    'su-kien': '#FF9800',
    'tin-hugs-agency': '#eb2166',
    'default': '#2196F3',
};

export function getCategoryColor(slug: string): string {
    return CATEGORY_COLORS[slug] || CATEGORY_COLORS['default'];
}
