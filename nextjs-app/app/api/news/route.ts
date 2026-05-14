import { fetchNewsArticles } from "@/lib/actions-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    try {
        const articles = await fetchNewsArticles(limit, offset);
        return NextResponse.json({ articles, hasMore: articles.length === limit });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ articles: [], hasMore: false }, { status: 500 });
    }
}
