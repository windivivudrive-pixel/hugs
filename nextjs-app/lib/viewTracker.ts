'use client';
import { supabase } from '@/lib/actions';

/**
 * Record an article view by incrementing view_count directly on the table.
 */
export const recordArticleView = async (articleId: string | number): Promise<void> => {
    try {
        // Fetch current view_count, then increment
        const { data, error: fetchError } = await supabase
            .from('news_articles')
            .select('view_count')
            .eq('id', articleId)
            .single();

        if (fetchError || !data) return;

        const { error } = await supabase
            .from('news_articles')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', articleId);

        if (error) {
            console.error('Error recording article view:', error);
        }
    } catch (err) {
        console.error('Error recording article view:', err);
    }
}
