-- =============================================
-- UPDATE SERVICES & SAMPLE ARTICLES
-- Run this in Supabase SQL Editor
-- Note: service_categories đã được tạo sẵn (15 ngành)
-- =============================================

-- 1. Thêm cột service_category_id vào service_articles (nếu chưa có)
ALTER TABLE service_articles 
ADD COLUMN IF NOT EXISTS service_category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL;

-- 2. Xóa dữ liệu cũ trong services (CASCADE sẽ xóa service_articles liên quan)
TRUNCATE TABLE services CASCADE;

-- 3. Tạo 9 Dịch vụ chính của HUGs
INSERT INTO services (category_id, name, slug, short_description, display_order) VALUES
    (NULL, 'Xây dựng nội dung & Quản trị Facebook', 'quan-tri-facebook', 
     'Xây dựng nội dung, hình ảnh và duy trì sự hiện diện thương hiệu trên Facebook.', 1),
    
    (NULL, 'Xây dựng nội dung & Vận hành kênh TikTok', 'xay-kenh-tiktok', 
     'Phát triển kênh TikTok theo định hướng nội dung và hành vi người dùng.', 2),
    
    (NULL, 'Sản xuất hình ảnh & Video', 'san-xuat-video', 
     'Chụp ảnh, quay video phục vụ nội dung mạng xã hội và chiến dịch truyền thông.', 3),
    
    (NULL, 'Triển khai quảng cáo đa nền tảng', 'quang-cao-da-nen-tang', 
     'Hỗ trợ quảng cáo Facebook, TikTok, Google để tăng hiệu quả tiếp cận.', 4),
    
    (NULL, 'Thiết kế Website & SEO', 'thiet-ke-website-seo', 
     'Thiết kế website và tối ưu nội dung giúp doanh nghiệp dễ được tìm thấy trên Google.', 5),
    
    (NULL, 'Thiết kế ấn phẩm truyền thông', 'thiet-ke-an-pham', 
     'Thiết kế banner, hình ảnh, ấn phẩm phục vụ online & offline.', 6),
    
    (NULL, 'Thương mại điện tử', 'thuong-mai-dien-tu', 
     'Hỗ trợ setup và vận hành shop trên Shopee, TikTok Shop, Lazada.', 7),
    
    (NULL, 'Tổ chức sự kiện & Activation', 'to-chuc-su-kien', 
     'Lên ý tưởng và triển khai các hoạt động truyền thông trực tiếp.', 8),
    
    (NULL, 'Seeding', 'seeding', 
     'Đưa nội dung vào cộng đồng, nhóm và kênh phù hợp để tăng độ tin cậy thương hiệu.', 9);


-- =============================================
-- 4. TẠO BÀI VIẾT MẪU (SERVICE ARTICLES / PROJECTS)
-- Mỗi bài viết liên kết với Service VÀ Industry (service_category)
-- =============================================

INSERT INTO service_articles (
    service_id, 
    service_category_id,
    title, 
    content, 
    thumbnail, 
    logo,
    category,
    published, 
    featured,
    display_order
) VALUES
    -- 1. Facebook + Spa Industry
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'spa-beauty'),
     'Xây dựng Fanpage chuyên nghiệp cho Thương hiệu Spa cao cấp',
     '<h2>Mục tiêu</h2><p>Tăng nhận diện thương hiệu và tương tác cho Fanpage của một chuỗi Spa cao cấp tại Đà Nẵng.</p><h2>Giải pháp</h2><ul><li>Xây dựng bộ nhận diện thống nhất trên Facebook</li><li>Lên lịch content 30 bài/tháng</li><li>Thiết kế hình ảnh theo phong cách luxury</li></ul><h2>Kết quả</h2><p>Tăng 250% engagement sau 3 tháng triển khai.</p>',
     '/projects/facebook-project.jpg',
     NULL,
     'SOCIAL MEDIA',
     true,
     true,
     1),
    
    -- 2. Facebook + F&B Industry
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'fnb'),
     'Quản trị Fanpage F&B - Chuỗi cửa hàng Café & Bánh',
     '<h2>Thử thách</h2><p>Khách hàng mới mở thương hiệu, cần xây dựng cộng đồng từ đầu.</p><h2>Triển khai</h2><ul><li>Xây dựng content story về thương hiệu</li><li>Tổ chức minigame tương tác</li><li>Booking review từ food blogger</li></ul><h2>Kết quả</h2><p>10,000 followers trong 2 tháng đầu tiên.</p>',
     '/projects/fnb-project.jpg',
     NULL,
     'SOCIAL MEDIA',
     true,
     false,
     2),

    -- 3. TikTok + Fashion Industry
    ((SELECT id FROM services WHERE slug = 'xay-kenh-tiktok'),
     (SELECT id FROM service_categories WHERE slug = 'fashion'),
     'Viral TikTok cho Thương hiệu Thời trang Local Brand',
     '<h2>Mục tiêu</h2><p>Xây dựng kênh TikTok từ 0 cho local brand thời trang, target Gen Z.</p><h2>Chiến lược</h2><ul><li>Nghiên cứu trending sound & hashtag</li><li>Sản xuất 20 video/tháng theo các format viral</li><li>Kết hợp KOC review sản phẩm</li></ul><h2>Kết quả</h2><p>5 triệu views trong tháng đầu, 50K followers sau 2 tháng.</p>',
     '/projects/tiktok-fashion.jpg',
     NULL,
     'TIKTOK',
     true,
     true,
     1),

    -- 4. Video Production + Hotel/Travel Industry
    ((SELECT id FROM services WHERE slug = 'san-xuat-video'),
     (SELECT id FROM service_categories WHERE slug = 'hotel'),
     'TVC Quảng cáo cho Resort 5 sao',
     '<h2>Project</h2><p>Sản xuất TVC 60s giới thiệu Resort nghỉ dưỡng cao cấp.</p><h2>Quy trình</h2><ul><li>Pre-production: Script, storyboard, casting</li><li>Production: Quay 3 ngày với drone + gimbal</li><li>Post-production: Color grading, VFX, âm nhạc bản quyền</li></ul>',
     '/projects/tvc-resort.jpg',
     NULL,
     'PRODUCTION',
     true,
     true,
     1),

    -- 5. Ads + Real Estate Industry
    ((SELECT id FROM services WHERE slug = 'quang-cao-da-nen-tang'),
     (SELECT id FROM service_categories WHERE slug = 'real-estate'),
     'Chiến dịch Quảng cáo Đa nền tảng - Ngành Bất động sản',
     '<h2>Thách thức</h2><p>Tăng lead cho dự án căn hộ cao cấp trong giai đoạn mở bán.</p><h2>Triển khai</h2><ul><li>Facebook Ads: Lead Generation Campaign</li><li>Google Ads: Search + Display Network</li><li>TikTok Ads: Video ads awareness</li></ul><h2>Kết quả</h2><p>500+ leads chất lượng, CPL giảm 40%.</p>',
     '/projects/ads-realestate.jpg',
     NULL,
     'MARKETING',
     true,
     false,
     1),

    -- 6. Website & SEO + Medical Industry
    ((SELECT id FROM services WHERE slug = 'thiet-ke-website-seo'),
     (SELECT id FROM service_categories WHERE slug = 'medical'),
     'Thiết kế Website & SEO cho Phòng khám Đa khoa',
     '<h2>Yêu cầu</h2><p>Website chuyên nghiệp, tối ưu SEO local cho phòng khám y tế.</p><h2>Giải pháp</h2><ul><li>Thiết kế UI/UX thân thiện, dễ đặt lịch khám</li><li>Tích hợp blog chia sẻ kiến thức y tế</li><li>SEO on-page và local SEO (Google Business)</li></ul><h2>Kết quả</h2><p>Top 3 Google cho từ khóa "phòng khám đa khoa Đà Nẵng".</p>',
     '/projects/website-medical.jpg',
     NULL,
     'WEBSITE',
     true,
     false,
     1),

    -- 7. Design + F&B Industry
    ((SELECT id FROM services WHERE slug = 'thiet-ke-an-pham'),
     (SELECT id FROM service_categories WHERE slug = 'fnb'),
     'Bộ nhận diện thương hiệu cho Startup F&B',
     '<h2>Scope</h2><p>Thiết kế toàn bộ brand identity cho chuỗi trà sữa mới.</p><h2>Deliverables</h2><ul><li>Logo và guideline</li><li>Menu, poster, standee</li><li>Packaging (ly, túi, hộp)</li><li>Đồng phục nhân viên</li></ul>',
     '/projects/branding-fnb.jpg',
     NULL,
     'DESIGN',
     true,
     true,
     1),

    -- 8. E-commerce + Cosmetics Industry
    ((SELECT id FROM services WHERE slug = 'thuong-mai-dien-tu'),
     (SELECT id FROM service_categories WHERE slug = 'cosmetics'),
     'Setup & Vận hành TikTok Shop cho Thương hiệu Mỹ phẩm',
     '<h2>Mục tiêu</h2><p>Xây dựng kênh bán hàng trên TikTok Shop từ đầu.</p><h2>Triển khai</h2><ul><li>Setup shop, listing sản phẩm SEO</li><li>Sản xuất video review sản phẩm</li><li>Chạy Ads Shop + Affiliate</li><li>Livestream bán hàng 3 lần/tuần</li></ul><h2>Kết quả</h2><p>Doanh thu 200 triệu/tháng sau 2 tháng vận hành.</p>',
     '/projects/ecommerce-cosmetics.jpg',
     NULL,
     'E-COMMERCE',
     true,
     false,
     1),

    -- 9. Event + Interior Design Industry
    ((SELECT id FROM services WHERE slug = 'to-chuc-su-kien'),
     (SELECT id FROM service_categories WHERE slug = 'interior-design'),
     'Event Khai trương Showroom Nội thất Cao cấp',
     '<h2>Event Overview</h2><p>Tổ chức lễ khai trương showroom nội thất với 200 khách mời VIP.</p><h2>Hoạt động</h2><ul><li>Thiết kế concept & setup sân khấu</li><li>Mời KOL, báo chí tham dự</li><li>Livestream sự kiện</li><li>PR báo chí sau sự kiện</li></ul>',
     '/projects/event-furniture.jpg',
     NULL,
     'EVENT',
     true,
     false,
     1),

    -- 10. Seeding + Food Industry (Mom & Baby related)
    ((SELECT id FROM services WHERE slug = 'seeding'),
     (SELECT id FROM service_categories WHERE slug = 'mom-and-baby'),
     'Chiến dịch Seeding cho Sản phẩm Sữa chua trẻ em',
     '<h2>Chiến lược</h2><p>Tạo buzz và social proof cho sản phẩm sữa chua mới.</p><h2>Triển khai</h2><ul><li>Seeding 500 bài trên groups Facebook</li><li>Review trên các diễn đàn mẹ và bé</li><li>KOC review trên TikTok, Instagram</li></ul><h2>Kết quả</h2><p>1 triệu reach organic, sentiment tích cực 95%.</p>',
     '/projects/seeding-fmcg.jpg',
     NULL,
     'SEEDING',
     true,
     false,
     1);

-- =============================================
-- DONE! Đã thêm cột service_category_id, 
-- tạo 9 Services và 10 bài viết mẫu với Industry
-- =============================================
