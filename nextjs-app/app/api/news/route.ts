import { fetchNewsArticles, fetchInitialFeeds, fetchCategoryPage } from "@/lib/actions-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'legacy';

    try {
        // New per-category feed mode
        if (mode === 'initial') {
            const perCategory = parseInt(searchParams.get('per_category') || '10');
            const feeds = await fetchInitialFeeds(perCategory);
            return NextResponse.json({ feeds });
        }

        if (mode === 'category') {
            const cat = searchParams.get('cat');
            if (!cat) {
                return NextResponse.json(
                    { error: 'Missing "cat" parameter' },
                    { status: 400 }
                );
            }
            const cursor = searchParams.get('cursor') || null;
            const limit = parseInt(searchParams.get('limit') || '10');
            const result = await fetchCategoryPage(cat, cursor, limit);
            return NextResponse.json(result);
        }

        // Legacy flat-list mode (backward compatible)
        const limit = parseInt(searchParams.get('limit') || '30');
        const offset = parseInt(searchParams.get('offset') || '0');
        const articles = await fetchNewsArticles(limit, offset);
        return NextResponse.json({ articles, hasMore: articles.length === limit });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ articles: [], hasMore: false }, { status: 500 });
    }
}
