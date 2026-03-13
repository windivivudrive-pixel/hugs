'use client';
import { useEffect } from 'react';

interface DocumentHeadOptions {
    title?: string;
    description?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    keywords?: string;
    canonicalUrl?: string;
    jsonLd?: object;
}

const SITE_NAME = 'HUGs Agency';
const DEFAULT_TITLE = 'HUGs Agency | Digital Marketing Agency tại Việt Nam';
const DEFAULT_DESCRIPTION = 'HUGs Agency - Agency Marketing tổng thể tại Việt Nam. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.';
const DEFAULT_OG_IMAGE = '/logo-hugs.png';
const BASE_URL = 'https://hugs.agency';

function setMetaTag(name: string, content: string, isProperty: boolean = false) {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setCanonical(url: string) {
    let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', url);
}

function setJsonLd(data: object) {
    const id = 'seo-json-ld';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
}

function removeJsonLd() {
    const el = document.getElementById('seo-json-ld');
    if (el) el.remove();
}

export function useDocumentHead(options: DocumentHeadOptions) {
    useEffect(() => {
        const prevTitle = document.title;

        // Title
        const fullTitle = options.title
            ? `${options.title} | ${SITE_NAME}`
            : DEFAULT_TITLE;
        document.title = fullTitle;

        // Meta description
        const desc = options.description || DEFAULT_DESCRIPTION;
        setMetaTag('description', desc);

        // Keywords
        if (options.keywords) {
            setMetaTag('keywords', options.keywords);
        }

        // Open Graph
        const ogUrl = options.ogUrl || `${BASE_URL}${window.location.pathname}`;
        const ogImage = options.ogImage
            ? (options.ogImage.startsWith('http') ? options.ogImage : `${BASE_URL}${options.ogImage}`)
            : `${BASE_URL}${DEFAULT_OG_IMAGE}`;

        setMetaTag('og:title', fullTitle, true);
        setMetaTag('og:description', desc, true);
        setMetaTag('og:image', ogImage, true);
        setMetaTag('og:url', ogUrl, true);
        setMetaTag('og:type', options.ogType || 'website', true);
        setMetaTag('og:site_name', SITE_NAME, true);
        setMetaTag('og:locale', 'vi_VN', true);

        // Twitter Card
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', fullTitle);
        setMetaTag('twitter:description', desc);
        setMetaTag('twitter:image', ogImage);

        // Canonical
        setCanonical(options.canonicalUrl || ogUrl);

        // JSON-LD structured data
        if (options.jsonLd) {
            setJsonLd(options.jsonLd);
        }

        return () => {
            document.title = prevTitle;
            removeJsonLd();
        };
    }, [
        options.title,
        options.description,
        options.ogImage,
        options.ogUrl,
        options.ogType,
        options.keywords,
        options.canonicalUrl,
        options.jsonLd,
    ]);
}
