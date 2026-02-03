-- =============================================
-- INSERT 10 SAMPLE PROJECTS FOR 'Xây dựng nội dung & Quản trị Facebook'
-- Service Slug: 'quan-tri-facebook'
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
    -- 1. Facebook + Spa Industry (Luxury)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'spa-beauty'),
     'Quản trị Fanpage Chuỗi Spa & Clinic 5 Sao',
     '<h2>Mục tiêu</h2><p>Tái định vị thương hiệu Spa chuẩn 5 sao trên nền tảng Facebook.</p><h2>Triển khai</h2><ul><li>Thiết kế moodboard màu Gold & White sang trọng</li><li>Sản xuất content video short-form giới thiệu liệu trình</li><li>Chạy ads minigame tặng voucher trải nghiệm</li></ul><h2>Kết quả</h2><p>Tăng 300% lượt inbox đặt lịch sau 1 tháng.</p>',
     'https://picsum.photos/800/600?random=fb1',
     NULL,
     'SOCIAL MEDIA',
     true,
     true,
     1),

    -- 2. Facebook + F&B (Milktea)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'fnb'),
     'Xây dựng cộng đồng cho Thương hiệu Trà sữa GenZ',
     '<h2>Thách thức</h2><p>Cạnh tranh gay gắt, cần viral content để tiếp cận giới trẻ.</p><h2>Giải pháp</h2><ul><li>Sáng tạo nhân vật mascot thương hiệu</li><li>Bắt trend meme đang hot trên mạng xã hội</li><li>Seeding hội nhóm ăn uống </li></ul><h2>Thành tựu</h2><p>Page đạt 10k like organic, bài viral đạt 500k reach.</p>',
     'https://picsum.photos/800/600?random=fb2',
     NULL,
     'CREATIVE CONTENT',
     true,
     true,
     2),

    -- 3. Facebook + Real Estate
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'real-estate'),
     'Fanpage Dự án Căn hộ Cao cấp Ven sông',
     '<h2>Yêu cầu</h2><p>Truyền tải thông điệp sống xanh, đẳng cấp thượng lưu.</p><h2>Content Direction</h2><ul><li>Viết bài storytelling về phong cách sống</li><li>Thiết kế album ảnh dạng tạp chí (magazine style)</li><li>Livestream tiến độ dự án hàng tuần</li></ul>',
     'https://picsum.photos/800/600?random=fb3',
     NULL,
     'REAL ESTATE',
     true,
     false,
     3),

    -- 4. Facebook + Education (English Center)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'education'),
     'Tuyển sinh Khóa học Tiếng Anh Giao tiếp',
     '<h2>Mục tiêu</h2><p>Thu hút học viên đăng ký khóa học mới qua Fanpage.</p><h2>Triển khai</h2><ul><li>Quay video testimonial học viên cũ</li><li>Chia sẻ tips học tiếng Anh mỗi ngày</li><li>Chạy lead form ads lấy data tư vấn</li></ul><h2>Kết quả</h2><p>Thu về 200 data/tháng với chi phí tối ưu.</p>',
     'https://picsum.photos/800/600?random=fb4',
     NULL,
     'EDUCATION',
     true,
     true,
     4),

    -- 5. Facebook + Fashion (Men's wear)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'fashion'),
     'Rebranding Fanpage Thương hiệu Vest Nam',
     '<h2>Vấn đề</h2><p>Hình ảnh cũ kỹ, tương tác kém, chưa ra đơn từ Page.</p><h2>Thay đổi</h2><ul><li>Chụp bộ ảnh lookbook concept Gentleman</li><li>Viết content tư vấn phối đồ (mix & match)</li><li>Tổ chức give away vest trị giá 5 triệu</li></ul>',
     'https://picsum.photos/800/600?random=fb5',
     NULL,
     'FASHION',
     true,
     false,
     5),

    -- 6. Facebook + Medical (Dental Clinic)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'medical'),
     'Xây dựng Uy tín cho Nha khoa Thẩm mỹ',
     '<h2>Định hướng</h2><p>Biến Fanpage thành kênh tư vấn nha khoa đáng tin cậy.</p><h2>Nội dung</h2><ul><li>Video bác sĩ tư vấn chuyên môn</li><li>Livestream ca làm răng thực tế</li><li>Album feedback khách hàng "Nụ cười mới"</li></ul>',
     'https://picsum.photos/800/600?random=fb6',
     NULL,
     'MEDICAL',
     true,
     false,
     6),

    -- 7. Facebook + Technology (Laptop Store)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'technology'),
     'Thúc đẩy doanh số Laptop Mùa tựu trường',
     '<h2>Chiến dịch</h2><p>Back to School - Giá rẻ bất ngờ.</p><h2>Hoạt động</h2><ul><li>Review laptop sinh viên giá tốt</li><li>Minigame đoán giá nhận quà công nghệ</li><li>Chạy ads carousel các dòng máy best-seller</li></ul>',
     'https://picsum.photos/800/600?random=fb7',
     NULL,
     'RETAIL',
     true,
     true,
     7),

    -- 8. Facebook + Interior (Furniture)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'interior-design'),
     'Fanpage Showroom Nội thất Nhập khẩu',
     '<h2>Yêu cầu</h2><p>Thể hiện sự tinh tế, sang trọng của sản phẩm nội thất Ý.</p><h2>Giải pháp</h2><ul><li>Content tập trung vào chi tiết, chất liệu sản phẩm</li><li>Sử dụng hình ảnh thực tế tại nhà khách hàng</li><li>Chia sẻ kiến thức decor nhà cửa</li></ul>',
     'https://picsum.photos/800/600?random=fb8',
     NULL,
     'INTERIOR',
     true,
     false,
     8),

    -- 9. Facebook + Mom & Baby
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'mom-and-baby'),
     'Cộng đồng Mẹ bỉm sữa - Shop Mẹ & Bé',
     '<h2>Mục tiêu</h2><p>Tương tác cao, tạo niềm tin cho các mẹ bỉm.</p><h2>Content</h2><ul><li>Chia sẻ kinh nghiệm chăm con khoa học</li><li>Tổ chức cuộc thi ảnh "Bé yêu"</li><li>Livestream xả kho giá sốc hàng tuần</li></ul>',
     'https://picsum.photos/800/600?random=fb9',
     NULL,
     'COMMUNITY',
     true,
     true,
     9),

    -- 10. Facebook + Resort (Travel)
    ((SELECT id FROM services WHERE slug = 'quan-tri-facebook'),
     (SELECT id FROM service_categories WHERE slug = 'hotel'),
     'Quảng bá Khu nghỉ dưỡng 4 mùa',
     '<h2>Concept</h2><p>Mỗi mùa một vẻ đẹp riêng tại Resort.</p><h2>Thực thi</h2><ul><li>Video flycam toàn cảnh resort</li><li>Bài viết review trải nghiệm 2 ngày 1 đêm</li><li>Chạy ưu đãi combo hè cho gia đình</li></ul>',
     'https://picsum.photos/800/600?random=fb10',
     NULL,
     'TRAVEL',
     true,
     false,
     10);
