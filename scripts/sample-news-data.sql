-- =============================================
-- Sample News Articles for NewsPage Testing
-- Run this in Supabase SQL Editor
-- =============================================

-- Clear existing sample data (optional)
-- DELETE FROM news_articles;

-- Insert sample news articles with various categories
INSERT INTO news_articles (title, slug, excerpt, content, thumbnail, category, category_color, author, published, display_order) VALUES

-- TIN MARKETING
('Điểm tin tuần: Pinterest cắt giảm 15% nhân sự để chuyển sang AI; Meta chuẩn bị thử nghiệm', 
 'pinterest-cat-giam-15-nhan-su-ai', 
 'Cùng nhìn lại các tin tức nổi bật và chiến dịch sáng tạo của các thương hiệu trong tuần qua.',
 '<p>Trong động thái mới nhất, Pinterest đã công bố cắt giảm 15% lực lượng lao động toàn cầu để tập trung vào phát triển AI và trí tuệ nhân tạo. Đây là một phần trong chiến lược chuyển đổi số của công ty...</p>',
 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
 'TIN MARKETING', '#E91E63', 'Gia Minh', true, 1),

('Spotify cùng 3 "ông lớn" âm nhạc khởi kiện 13.000 tỷ USD, Anna''s Archive đối mặt cáo buộng',
 'spotify-khoi-kien-anna-archive-13000-ty',
 'Spotify và các hãng thu âm lớn khởi kiện trang chia sẻ sách lậu với mức bồi thường kỷ lục.',
 '<p>Spotify cùng Sony, Universal và Warner đã đệ đơn kiện Anna''s Archive vì vi phạm bản quyền...</p>',
 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=600&fit=crop',
 'TIN MARKETING', '#E91E63', 'Nhã Vy', true, 2),

('NVIDIA hoàn thương vụ 100 tỷ USD với OpenAI: Dấu hiệu dịch chuyển chiến lược trí tuệ nhân tạo',
 'nvidia-openai-100-ty-usd-hop-tac',
 'Thứ Sáu (30/1) vừa qua, The Wall Street Journal (WSJ) đưa tin kế hoạch Nvidia đầu tư lên tới 100 tỷ USD vào...',
 '<p>Trong động thái mới nhất của ngành công nghệ, NVIDIA và OpenAI đã công bố thỏa thuận hợp tác trị giá 100 tỷ USD...</p>',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
 'TIN MARKETING', '#E91E63', 'Ngọc Hạnh', true, 3),

-- GÓC NHÌN
('Thường xuyên ăn một mình, sẵn sàng chi trả cho trải nghiệm cao cấp: Những thói quen ẩm thực mới',
 'thuong-xuyen-an-mot-minh-xu-huong',
 'Xu hướng "dining alone" và cơ hội cho ngành F&B cao cấp phát triển.',
 '<p>Ngày càng nhiều người tiêu dùng chọn ăn một mình tại nhà hàng cao cấp, một xu hướng đang thay đổi cách các thương hiệu F&B tiếp cận khách hàng...</p>',
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
 'GÓC NHÌN', '#9C27B0', 'Ngọc Hạnh', true, 4),

('Khi các thương hiệu kể Tết Bính Ngọ 2026 theo nhiều cách: Khoảnh khắc nhỏ trở lớn',
 'thuong-hieu-ke-tet-binh-ngo-2026',
 'Câu chuyện về những khoảnh khắc nhỏ bé nhưng ý nghĩa trong các chiến dịch Tết.',
 '<p>Tết Bính Ngọ 2026, các thương hiệu đã chọn cách kể chuyện khác biệt, tập trung vào những khoảnh khắc nhỏ nhưng đầy ý nghĩa...</p>',
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
 'GÓC NHÌN', '#9C27B0', 'Ý Nhi', true, 5),

-- KIẾN THỨC
('25+ chiến dịch nổi bật khuấy động đường đua quảng cáo Tết Bính Ngọ 2026 (Phần 4)',
 'chien-dich-quang-cao-tet-2026-phan-4',
 'Tổng hợp các chiến dịch quảng cáo Tết ấn tượng nhất từ các thương hiệu lớn.',
 '<p>Tiếp nối series về các chiến dịch Tết 2026, phần 4 sẽ điểm qua những TVC và activation ấn tượng nhất...</p>',
 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=600&fit=crop',
 'KIẾN THỨC', '#2196F3', 'Ý Nhi', true, 6),

('IKEA "bọc" cả thành phố Copenhagen bằng thùng carton để khẳng định định vị thương hiệu',
 'ikea-boc-copenhagen-carton-branding',
 'Chiến dịch out-of-home đình đám của IKEA tại Copenhagen.',
 '<p>IKEA vừa thực hiện một chiến dịch quảng cáo ngoài trời (OOH) độc đáo tại Copenhagen, phủ thùng carton lên khắp các công trình nổi tiếng...</p>',
 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
 'KIẾN THỨC', '#2196F3', 'Như Quỳnh', true, 7),

-- CASE STUDY
('TVC "ngược" của AIA – Dài gần 3 phút, sản phẩm không xuất hiện',
 'tvc-nguoc-aia-3-phut-khong-san-pham',
 'Trong dòng chảy văn hóa Việt Nam, có những giá trị không phô trương mà vẫn để lại dấu ấn.',
 '<p>AIA đã thực hiện một TVC dài gần 3 phút, không hề xuất hiện sản phẩm bảo hiểm, mà tập trung hoàn toàn vào câu chuyện cảm xúc...</p>',
 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
 'CASE STUDY', '#FF9800', 'Mỹ Tằng', true, 8),

('Rộn ràng mùa văn nghệ Year End Party: Người "đam mê trải nghiệm" tập dợt đến tận... Tết',
 'van-nghe-year-end-party-2026',
 'Câu chuyện vui về những buổi tập văn nghệ Year End Party kéo dài đến sát Tết.',
 '<p>Mùa Year End Party lại về, và những buổi tập văn nghệ luôn là "đặc sản" không thể thiếu của các công ty...</p>',
 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
 'CASE STUDY', '#FF9800', 'Nhã Vy', true, 9),

-- TOP LIST
('Sức mua của Gen Alpha dự kiến chạm mốc 5,5 nghìn tỷ USD vào năm 2029: Khám phá sức mạnh thế hệ mới',
 'gen-alpha-suc-mua-5-5-nghin-ty-2029',
 'Khám phá sức mua khổng lồ của thế hệ Alpha và cơ hội cho các thương hiệu.',
 '<p>Theo nghiên cứu mới nhất, thế hệ Alpha (sinh từ 2010-2024) được dự đoán sẽ có sức mua lên đến 5.5 nghìn tỷ USD vào năm 2029...</p>',
 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&h=600&fit=crop',
 'TOP LIST', '#00BCD4', 'Như Quỳnh', true, 10),

('4 chiến dịch nổi bật tuần qua: BABYMONSTER là Đại sứ thương hiệu Sunsilk tại thị trường Việt Nam',
 '4-chien-dich-noi-bat-babymonster-sunsilk',
 '4 chiến dịch nổi bật tuần qua: BABYMONSTER là Đại sứ thương hiệu Sunsilk tại thị trường Việt Nam.',
 '<p>BABYMONSTER chính thức trở thành Đại sứ thương hiệu của Sunsilk tại Việt Nam, đánh dấu bước tiến mới trong chiến lược tiếp thị của thương hiệu...</p>',
 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
 'TOP LIST', '#00BCD4', 'Như Quỳnh', true, 11),

-- PODCAST
('Podcast #12: Làm sao để xây dựng personal brand trong ngành Marketing?',
 'podcast-12-personal-brand-marketing',
 'Chia sẻ từ các chuyên gia về xây dựng thương hiệu cá nhân trong ngành Marketing.',
 '<p>Trong tập podcast này, chúng tôi trò chuyện với các chuyên gia hàng đầu về cách xây dựng personal brand hiệu quả...</p>',
 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop',
 'PODCAST', '#4CAF50', 'HUGs Team', true, 12),

-- TIN HUGS
('HUGs Agency mở rộng văn phòng mới tại trung tâm Đà Nẵng',
 'hugs-agency-van-phong-moi-da-nang-2026',
 'Văn phòng mới của HUGs Agency với không gian sáng tạo và hiện đại.',
 '<p>Chúng tôi vui mừng thông báo về việc mở rộng văn phòng mới tại trung tâm thành phố Đà Nẵng, không gian làm việc sáng tạo và hiện đại...</p>',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
 'TIN HUGS', '#eb2166', 'HUGs Team', true, 13),

-- ĐANG HOT
('Chuyển dân văn phòng về quê ăn Tết: Đếm ngược từng cái thở, hành trình trở về quê hương',
 'chuyen-ve-que-an-tet-dem-nguoc-2026',
 'Giữa những ngày cuối năm bận rộn, hành trình về quê ăn Tết của dân văn phòng luôn là câu chuyện đặc biệt.',
 '<p>Hành trình về quê ăn Tết của dân văn phòng năm nay được ghi lại với những khoảnh khắc xúc động...</p>',
 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=800&h=600&fit=crop',
 'ĐANG HOT', '#FF5722', 'Nhã Vy', true, 14),

('Pandora Việt Nam khởi đầu năm 2026 với hành trình "Kiến tạo kỷ ức rực rỡ"',
 'pandora-viet-nam-2026-kien-tao-ky-uc',
 'Pandora Việt Nam khởi đầu năm 2026 với hành trình "Kiến tạo kỷ ức rực rỡ".',
 '<p>Thương hiệu trang sức Pandora chính thức khởi động chiến dịch đầu năm 2026 với thông điệp "Kiến tạo kỷ ức rực rỡ"...</p>',
 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
 'ĐANG HOT', '#FF5722', 'HUGs Team', true, 15),

-- Additional 10 records
('Meta ra mắt Threads phiên bản Web: Cạnh tranh trực tiếp với X (Twitter)',
 'meta-threads-web-canh-tranh-x',
 'Meta chính thức ra mắt phiên bản web của Threads, đối thủ trực tiếp với X.',
 '<p>Sau thành công ban đầu trên mobile, Meta đã chính thức ra mắt Threads phiên bản web...</p>',
 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop',
 'TIN MARKETING', '#E91E63', 'Gia Minh', true, 16),

('5 xu hướng Content Marketing sẽ thống trị năm 2026',
 '5-xu-huong-content-marketing-2026',
 'Những xu hướng content marketing quan trọng nhất mà các marketer cần biết.',
 '<p>Năm 2026 đánh dấu sự thay đổi lớn trong cách tiếp cận content marketing...</p>',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
 'KIẾN THỨC', '#2196F3', 'Như Quỳnh', true, 17),

('Apple Vision Pro: Tương lai của marketing trải nghiệm?',
 'apple-vision-pro-marketing-trai-nghiem',
 'Liệu Apple Vision Pro có mở ra kỷ nguyên mới cho experiential marketing?',
 '<p>Với sự ra mắt của Apple Vision Pro, nhiều marketer đang đặt câu hội về tương lai của marketing trải nghiệm...</p>',
 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop',
 'GÓC NHÌN', '#9C27B0', 'Ngọc Hạnh', true, 18),

('Case Study: Chiến dịch viral của Durex Việt Nam trong dịp Valentine 2026',
 'case-study-durex-valentine-2026',
 'Phân tích chiến dịch Valentine viral của Durex và bài học cho các thương hiệu.',
 '<p>Durex Việt Nam đã tạo nên cơn sốt trên mạng xã hội với chiến dịch Valentine độc đáo...</p>',
 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop',
 'CASE STUDY', '#FF9800', 'Mỹ Tằng', true, 19),

('Top 10 Agency sáng tạo nhất miền Trung 2026',
 'top-10-agency-mien-trung-2026',
 'Danh sách 10 agency sáng tạo hàng đầu khu vực miền Trung năm 2026.',
 '<p>Miền Trung đang chứng kiến sự phát triển mạnh mẽ của các agency sáng tạo...</p>',
 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
 'TOP LIST', '#00BCD4', 'Ý Nhi', true, 20),

('Podcast #13: Bí quyết xây dựng team Marketing hiệu quả',
 'podcast-13-xay-dung-team-marketing',
 'Chia sẻ kinh nghiệm quản lý và xây dựng đội ngũ marketing từ các leader.',
 '<p>Trong tập podcast này, chúng tôi trò chuyện với các Marketing Manager về cách xây dựng team...</p>',
 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop',
 'PODCAST', '#4CAF50', 'HUGs Team', true, 21),

('HUGs Agency đạt giải Vàng tại Vietnam PR Awards 2026',
 'hugs-agency-giai-vang-pr-awards-2026',
 'HUGs Agency vinh dự nhận giải Vàng hạng mục Social Media Campaign.',
 '<p>Tại lễ trao giải Vietnam PR Awards 2026, HUGs Agency đã xuất sắc giành giải Vàng...</p>',
 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=600&fit=crop',
 'TIN HUGS', '#eb2166', 'HUGs Team', true, 22),

('TikTok Shop: Cơ hội và thách thức cho các nhà bán hàng năm 2026',
 'tiktok-shop-co-hoi-thach-thuc-2026',
 'Phân tích thị trường TikTok Shop và chiến lược cho các nhà bán hàng.',
 '<p>TikTok Shop đang trở thành kênh bán hàng quan trọng với doanh thu tăng vọt...</p>',
 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=600&fit=crop',
 'ĐANG HOT', '#FF5722', 'Nhã Vy', true, 23),

('Influencer Marketing 2026: Micro hay Macro - Đâu là lựa chọn tốt hơn?',
 'influencer-marketing-micro-macro-2026',
 'So sánh hiệu quả giữa Micro và Macro Influencer trong chiến dịch marketing.',
 '<p>Câu hỏi về việc lựa chọn giữa Micro và Macro Influencer vẫn luôn gây tranh cãi...</p>',
 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
 'KIẾN THỨC', '#2196F3', 'Ngọc Hạnh', true, 24),

('Vinamilk và bài học về CSR Marketing bền vững',
 'vinamilk-bai-hoc-csr-marketing-ben-vung',
 'Phân tích chiến lược CSR của Vinamilk và bài học cho các thương hiệu Việt.',
 '<p>Vinamilk đã xây dựng thành công hình ảnh thương hiệu bền vững qua các hoạt động CSR...</p>',
 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
 'CASE STUDY', '#FF9800', 'Gia Minh', true, 25);
