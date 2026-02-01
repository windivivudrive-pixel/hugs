-- Create project_categories table
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for project_categories (public read, authenticated write)
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.project_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.project_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.project_categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON public.project_categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add project_category_id to service_articles
ALTER TABLE public.service_articles 
ADD COLUMN IF NOT EXISTS project_category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL;

-- Seed Data (using DO block to lookup service IDs dynamically)
DO $$
DECLARE
    tiktok_id UUID;
    design_id UUID;
    media_id UUID;
    booking_id UUID;
BEGIN
    -- Get Service IDs (assumes slugs exist, adjust if needed)
    SELECT id INTO tiktok_id FROM public.services WHERE slug = 'xay-kenh-tiktok';
    SELECT id INTO design_id FROM public.services WHERE slug = 'thiet-ke-an-pham';
    SELECT id INTO media_id FROM public.services WHERE slug = 'media-production';
    SELECT id INTO booking_id FROM public.services WHERE slug = 'booking-kol-koc';

    -- Insert TikTok Categories
    IF tiktok_id IS NOT NULL THEN
        INSERT INTO public.project_categories (service_id, name, display_order) VALUES
        (tiktok_id, 'Xây kênh', 1),
        (tiktok_id, 'TikTok Shop', 2),
        (tiktok_id, 'Livestream', 3);
    END IF;

    -- Insert Design Categories
    IF design_id IS NOT NULL THEN
        INSERT INTO public.project_categories (service_id, name, display_order) VALUES
        (design_id, 'Bộ nhận diện thương hiệu', 1),
        (design_id, 'Ấn phẩm truyền thông', 2),
        (design_id, 'Landing Page / Website', 3),
        (design_id, 'Bao bì', 4);
    END IF;

    -- Insert Media Categories
    IF media_id IS NOT NULL THEN
        INSERT INTO public.project_categories (service_id, name, display_order) VALUES
        (media_id, 'TVC & Commercials', 1),
        (media_id, 'Viral Video / MV', 2),
        (media_id, 'Phim doanh nghiệp', 3),
        (media_id, 'Event Recap', 4);
    END IF;

    -- Insert Booking Categories
    IF booking_id IS NOT NULL THEN
        INSERT INTO public.project_categories (service_id, name, display_order) VALUES
        (booking_id, 'Beauty & Fashion', 1),
        (booking_id, 'Lifestyle', 2),
        (booking_id, 'Tech & Gaming', 3),
        (booking_id, 'Food & Travel', 4);
    END IF;

END $$;
