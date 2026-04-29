/**
 * Utility function to decode common HTML entities returned by WordPress
 */
export function decodeHTMLEntities(text: string): string {
    if (!text) return '';
    const entities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&#8217;': "'",
        '&#8211;': '-',
        '&#8212;': '—',
        '&nbsp;': ' ',
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;|&#8217;|&#8211;|&#8212;|&nbsp;/g, tag => entities[tag] || tag);
}
