-- =============================================
-- HUGs Agency - Services Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Service Articles Table
CREATE TABLE IF NOT EXISTS service_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    thumbnail TEXT,
    published BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read (published)" ON service_articles FOR SELECT USING (published = true);

-- =============================================
-- SEED DATA - Initial Categories
-- =============================================

INSERT INTO service_categories (name, slug, icon, display_order) VALUES
    ('Social Media', 'social', 'share-2', 1),
    ('Marketing', 'marketing', 'megaphone', 2),
    ('Production', 'production', 'video', 3),
    ('Design', 'design', 'palette', 4);

-- =============================================
-- SEED DATA - All 11 Services
-- =============================================

-- Social Media Category
INSERT INTO services (category_id, name, slug, short_description, display_order) VALUES
    ((SELECT id FROM service_categories WHERE slug = 'social'), 
     'Quản Trị Page Facebook', 
     'quan-tri-page-facebook', 
     'Xây dựng nội dung, hình ảnh và duy trì sự hiện diện thương hiệu trên Facebook.', 
     1),
    ((SELECT id FROM service_categories WHERE slug = 'social'), 
     'Xây Kênh TikTok', 
     'xay-kenh-tiktok', 
     'Phát triển kênh TikTok theo định hướng nội dung và hành vi người dùng.', 
     2),
    ((SELECT id FROM service_categories WHERE slug = 'social'), 
     'Social Media', 
     'social-media', 
     'Lên kế hoạch nội dung tổng thể cho Facebook, TikTok và các nền tảng phù hợp.', 
     3);

-- Marketing Category
INSERT INTO services (category_id, name, slug, short_description, display_order) VALUES
    ((SELECT id FROM service_categories WHERE slug = 'marketing'), 
     'Booking KOL/KOC', 
     'booking-kol-koc', 
     'Kết nối và triển khai nội dung cùng KOL/KOC theo chiến dịch.', 
     1),
    ((SELECT id FROM service_categories WHERE slug = 'marketing'), 
     'SEO', 
     'seo', 
     'Tối ưu nội dung website giúp doanh nghiệp dễ được tìm thấy trên Google.', 
     2),
    ((SELECT id FROM service_categories WHERE slug = 'marketing'), 
     'Quảng cáo đa nền tảng', 
     'quang-cao-da-nen-tang', 
     'Hỗ trợ quảng cáo Facebook, TikTok để tăng hiệu quả tiếp cận và lan tỏa nội dung.', 
     3),
    ((SELECT id FROM service_categories WHERE slug = 'marketing'), 
     'Seeding', 
     'seeding', 
     'Đưa nội dung vào cộng đồng, nhóm và kênh phù hợp để tăng độ tin cậy thương hiệu.', 
     4);

-- Production Category
INSERT INTO services (category_id, name, slug, short_description, display_order) VALUES
    ((SELECT id FROM service_categories WHERE slug = 'production'), 
     'Media Production', 
     'media-production', 
     'Chụp ảnh, quay video phục vụ nội dung mạng xã hội và chiến dịch truyền thông.', 
     1),
    ((SELECT id FROM service_categories WHERE slug = 'production'), 
     'Tổ chức sự kiện & activation', 
     'to-chuc-su-kien', 
     'Lên ý tưởng và triển khai các hoạt động truyền thông trực tiếp.', 
     2);

-- Design Category
INSERT INTO services (category_id, name, slug, short_description, display_order) VALUES
    ((SELECT id FROM service_categories WHERE slug = 'design'), 
     'Thiết kế ấn phẩm truyền thông', 
     'thiet-ke-an-pham', 
     'Thiết kế banner, hình ảnh, ấn phẩm phục vụ online & offline.', 
     1),
    ((SELECT id FROM service_categories WHERE slug = 'design'), 
     'Thiết kế website', 
     'thiet-ke-website', 
     'Thiết kế website hỗ trợ truyền thông và giới thiệu doanh nghiệp.', 
     2);

-- =============================================
-- SEED DATA - Sample Articles
-- =============================================

INSERT INTO service_articles (service_id, title, content, thumbnail, published, display_order) VALUES
    -- Facebook Page Management articles
    ((SELECT id FROM services WHERE slug = 'quan-tri-page-facebook'),
     'Xây dựng Fanpage chuyên nghiệp cho doanh nghiệp F&B',
     'Hướng dẫn chi tiết cách xây dựng và tối ưu Fanpage Facebook cho ngành F&B, từ thiết kế hình ảnh đến lên lịch content.',
     '/projects/facebook-project.jpg',
     true,
     1),
    ((SELECT id FROM services WHERE slug = 'quan-tri-page-facebook'),
     'Case study: Tăng 300% engagement cho thương hiệu mỹ phẩm',
     'Phân tích chiến lược nội dung và kết quả đạt được sau 3 tháng triển khai quản trị Fanpage.',
     '/projects/marketing-project.jpg',
     true,
     2),

    -- TikTok articles
    ((SELECT id FROM services WHERE slug = 'xay-kenh-tiktok'),
     'Xu hướng TikTok 2024: Những định dạng video viral nhất',
     'Tổng hợp các trending format và tips để tạo video TikTok thu hút hàng triệu views.',
     '/projects/tiktok-project.jpg',
     true,
     1),
    ((SELECT id FROM services WHERE slug = 'xay-kenh-tiktok'),
     'Hướng dẫn tối ưu thuật toán TikTok cho doanh nghiệp',
     'Cách hiểu và tận dụng thuật toán TikTok để tăng reach cho nội dung thương hiệu.',
     '/projects/social-project.jpg',
     true,
     2),

    -- Media Production articles
    ((SELECT id FROM services WHERE slug = 'media-production'),
     'Behind the scenes: Quay TVC cho thương hiệu cao cấp',
     'Quy trình sản xuất TVC chuyên nghiệp từ A-Z, từ concept đến post-production.',
     '/projects/media-project.jpg',
     true,
     1),

    -- Booking KOL articles
    ((SELECT id FROM services WHERE slug = 'booking-kol-koc'),
     'Top 50 KOL/KOC miền Trung đáng hợp tác năm 2024',
     'Danh sách và đánh giá chi tiết các influencer tiềm năng tại khu vực miền Trung.',
     '/projects/kol-project.jpg',
     true,
     1),

    -- Design articles
    ((SELECT id FROM services WHERE slug = 'thiet-ke-an-pham'),
     'Thiết kế bộ nhận diện thương hiệu cho startup',
     'Quy trình thiết kế brand identity từ logo, màu sắc đến các ấn phẩm marketing.',
     '/projects/design-project.jpg',
     true,
     1),
    ((SELECT id FROM services WHERE slug = 'thiet-ke-website'),
     'Landing page tối ưu chuyển đổi: Best practices 2024',
     'Các nguyên tắc thiết kế landing page hiệu quả để tăng tỷ lệ conversion.',
     '/projects/fanpage-project.jpg',
     true,
     1);

-- =============================================
-- NEWS ARTICLES TABLE (E-Magazine Section)
-- =============================================

CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    thumbnail TEXT,
    category TEXT NOT NULL DEFAULT 'NEWS',
    category_color TEXT DEFAULT '#E91E63',
    author TEXT DEFAULT 'HUGs Team',
    author_id UUID,
    published BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read (published)" ON news_articles FOR SELECT USING (published = true);

-- =============================================
-- SEED DATA - News Articles
-- =============================================

INSERT INTO news_articles (title, slug, excerpt, thumbnail, category, category_color, published, display_order) VALUES
    ('Grab Insight Ignite 2025: "Bí kíp giải mã" hệ sinh thái Grab giúp thương hiệu xây dựng kết nối ý nghĩa với người dùng',
     'grab-insight-ignite-2025', 
     'Bí kíp giải mã hệ sinh thái Grab giúp thương hiệu xây dựng kết nối ý nghĩa với người dùng',
     'https://picsum.photos/600/400?random=news1', 
     'BRAND STRATEGY', '#E91E63', true, 1),
    ('Dh Foods "thay áo mới" sau 13 năm: Khi gia vị Việt cũng cần thích ứng với xu hướng tiêu dùng trẻ',
     'dh-foods-rebrand', 
     'Khi gia vị Việt cũng cần thích ứng với xu hướng tiêu dùng trẻ',
     'https://picsum.photos/600/400?random=news2', 
     'BRAND STRATEGY', '#E91E63', true, 2),
    ('Xu hướng vodcast bùng nổ – Khi video dài vẫn chinh phục người trẻ',
     'xu-huong-vodcast', 
     'Khi video dài vẫn chinh phục người trẻ',
     'https://picsum.photos/600/400?random=news3', 
     'QUAN ĐIỂM', '#E91E63', true, 3),
    ('Ghé thăm văn phòng mới của 1990 Impact Agency',
     '1990-impact-agency-office', 
     'Ghé thăm văn phòng mới của 1990 Impact Agency',
     'https://picsum.photos/600/400?random=news4', 
     'AGENCY WORLD', '#E91E63', true, 4);

-- =============================================
-- ADMIN USERS TABLE (Role-Based Access)
-- =============================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'agent', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all admin_users" ON admin_users FOR ALL USING (true);

-- Seed admin user
INSERT INTO admin_users (username, password, role) VALUES
    ('admin', 'hugsagent', 'admin');
