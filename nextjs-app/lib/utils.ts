/**
 * Utility function to decode common HTML entities returned by WordPress
 */
export function decodeHTMLEntities(text: string): string {
    if (!text) return '';
    
    // First, decode numeric entities (e.g., &#8220;)
    let decoded = text.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(parseInt(dec, 10));
    });
    
    // Then handle hex entities (e.g., &#x20;)
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });

    // Handle common named entities
    const entities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&#039;': "'",
        '&nbsp;': ' ',
        '&rsquo;': "'",
        '&lsquo;': "'",
        '&rdquo;': '"',
        '&ldquo;': '"',
        '&ndash;': '–',
        '&mdash;': '—',
    };
    
    return decoded.replace(/&[a-z0-9]+;/gi, tag => entities[tag] || tag);
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').trim();
}
