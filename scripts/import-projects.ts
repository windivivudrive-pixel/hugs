// Script to import project data into service_articles table
// Run this with: npx ts-node scripts/import-projects.ts

import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://mltmwwywqhehrjwrrxks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdG13d3l3cWhlaHJqd3JyeGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTc5NDQsImV4cCI6MjA4NDMzMzk0NH0.SmI6rQ3_6s78D-WWU0E7e_IgjufYNUWaSII98NA1JVI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Service slug mapping based on "Hạng mục triển khai"
const serviceMapping: Record<string, string[]> = {
    'TikTok': ['xay-kenh-tiktok'],
    'Xây kênh TikTok': ['xay-kenh-tiktok'],
    'Vận hành TikTok': ['xay-kenh-tiktok'],
    'Phát triển TikTok': ['xay-kenh-tiktok'],
    'Fanpage': ['quan-tri-page-facebook'],
    'Fanpage FB': ['quan-tri-page-facebook'],
    'Fanpage Facebook': ['quan-tri-page-facebook'],
    'Quản trị Fanpage': ['quan-tri-page-facebook'],
    'Facebook': ['quan-tri-page-facebook'],
    'Instagram': ['social-media'],
    'IG': ['social-media'],
    'Linkedin': ['social-media'],
    'SEO': ['seo'],
    'SEO Website': ['seo'],
    'Sản xuất hình ảnh': ['media-production'],
    'Sản xuất video': ['media-production'],
    'Short video': ['media-production'],
    'Thiết kế in ấn': ['thiet-ke-an-pham'],
    'Thiết kế ấn phẩm': ['thiet-ke-an-pham'],
    'Sản xuất nội dung': ['social-media'],
    'Quản trị nội dung': ['quan-tri-page-facebook'],
    'Tổ chức sự kiện': ['to-chuc-su-kien'],
};

// Project data from Google Sheet
const projects = [
    {
        name: 'Công ty cổ phần công nghiệp nhựa Đài Loan Chin Huei Plastic',
        description: 'Doanh nghiệp 100% vốn Đài Loan, 28 năm phát triển, sản xuất vật liệu nội thất nhựa cao cấp. Mục tiêu: Phát triển nhận diện thương hiệu online.',
        timeline: '2023 - 2026',
        services: ['xay-kenh-tiktok', 'quan-tri-page-facebook', 'seo', 'media-production'],
        kpi: 'TikTok: 10K follow tự nhiên/năm, Fanpage: 12K like tự nhiên/năm, Website: 5 từ khóa SEO Top Google',
        category: 'Sản xuất & Công nghiệp'
    },
    {
        name: 'Wafaifo Resort Hoi An',
        description: 'Resort boutique 4 sao tại Hội An. Mục tiêu: Gia tăng nhận diện, xây dựng nội dung nhất quán.',
        timeline: '2025 - 2026',
        services: ['xay-kenh-tiktok', 'quan-tri-page-facebook', 'social-media', 'thiet-ke-an-pham', 'media-production'],
        kpi: '',
        category: 'Khách sạn & Resort'
    },
    {
        name: 'Verita Health Hoi An',
        description: 'Thuộc Verita Global, chăm sóc sức khỏe cao cấp & y học tái tạo.',
        timeline: '2025 - 2026',
        services: ['xay-kenh-tiktok', 'quan-tri-page-facebook', 'social-media', 'thiet-ke-an-pham', 'media-production'],
        kpi: '',
        category: 'Y tế & Chăm sóc sức khỏe'
    },
    {
        name: 'KYOTO Sushi & Teppanyaki Restaurant',
        description: 'Nhà hàng Nhật cao cấp tại Đà Nẵng (Mỹ Khê).',
        timeline: '2023 - 2024',
        services: ['xay-kenh-tiktok', 'quan-tri-page-facebook', 'thiet-ke-an-pham', 'media-production'],
        kpi: '',
        category: 'F&B'
    },
    {
        name: 'Công ty thiết kế và thi công nội thất Lifehouse',
        description: 'Đơn vị Design & Build chuyên nghiệp, giải pháp không gian tinh gọn.',
        timeline: '2024 - 2026',
        services: ['xay-kenh-tiktok', 'quan-tri-page-facebook', 'thiet-ke-an-pham', 'media-production'],
        kpi: '',
        category: 'Nội thất & Xây dựng'
    },
    {
        name: 'Mai Wedding',
        description: 'Thương hiệu áo cưới cao cấp, phong cách thanh lịch.',
        timeline: '2023',
        services: ['xay-kenh-tiktok', 'social-media'],
        kpi: '',
        category: 'Thời trang & Cưới'
    },
    {
        name: 'Trường thực hành Aspace',
        description: 'Đào tạo mô hình "Learning by Doing", kỹ thuật ứng dụng.',
        timeline: '2023',
        services: ['xay-kenh-tiktok', 'quan-tri-page-facebook'],
        kpi: '',
        category: 'Giáo dục'
    },
    {
        name: 'Nam Dương Land - Casamia Balanca Hoi An',
        description: 'Chiến dịch Casamia Balanca Hoi An.',
        timeline: '2025',
        services: ['media-production'],
        kpi: '',
        category: 'Bất động sản'
    },
    {
        name: 'Khách sạn Diamond Sea',
        description: 'Khách sạn tại Đà Nẵng.',
        timeline: '',
        services: ['quan-tri-page-facebook', 'thiet-ke-an-pham'],
        kpi: '',
        category: 'Khách sạn & Resort'
    },
    {
        name: 'Draco Hotel',
        description: 'Khách sạn tại Đà Nẵng.',
        timeline: '',
        services: ['quan-tri-page-facebook', 'thiet-ke-an-pham'],
        kpi: '',
        category: 'Khách sạn & Resort'
    },
    {
        name: 'Phùng Nồng',
        description: 'Thương hiệu truyền thống.',
        timeline: '',
        services: ['xay-kenh-tiktok'],
        kpi: '',
        category: 'F&B'
    },
    {
        name: 'Trầm Hương Cao cấp',
        description: 'Thương hiệu trầm hương cao cấp.',
        timeline: '',
        services: ['xay-kenh-tiktok'],
        kpi: '',
        category: 'Lifestyle'
    },
    {
        name: 'Ryn Bar',
        description: 'Quán bar tại Đà Nẵng.',
        timeline: '',
        services: ['quan-tri-page-facebook', 'thiet-ke-an-pham'],
        kpi: '',
        category: 'F&B'
    },
    {
        name: 'Gennest',
        description: 'Thương hiệu sản phẩm.',
        timeline: '',
        services: ['social-media'],
        kpi: '',
        category: 'Lifestyle'
    },
    {
        name: 'UK Academy',
        description: 'Trung tâm đào tạo.',
        timeline: '',
        services: ['quan-tri-page-facebook'],
        kpi: '',
        category: 'Giáo dục'
    },
];

// Events data
const events = [
    {
        name: 'Chestertons - Lễ ra mắt Đại sứ quán Anh',
        description: 'Thương hiệu BĐS toàn cầu (London 1805). Tổ chức lễ ra mắt tại Đại sứ quán Anh (Sự kiện riêng tư, ngoại giao & doanh nghiệp).',
        timeline: '2022',
        services: ['to-chuc-su-kien'],
        kpi: '',
        category: 'Sự kiện doanh nghiệp'
    },
    {
        name: 'OCB - RB Kick-off toàn quốc',
        description: 'Ngân hàng Phương Đông. Chương trình RB Kick-off toàn quốc tại TP.HCM.',
        timeline: '2019',
        services: ['to-chuc-su-kien'],
        kpi: '',
        category: 'Sự kiện doanh nghiệp'
    },
    {
        name: 'Champion Lee - Lễ khai trương chiến lược',
        description: 'Tập đoàn quốc tế sản xuất nhãn mác & may mặc. Lễ khai trương chiến lược tại Việt Nam.',
        timeline: '2017',
        services: ['to-chuc-su-kien'],
        kpi: '',
        category: 'Sự kiện doanh nghiệp'
    },
    {
        name: 'Rau má Ramix - Lễ khai trương',
        description: 'Thương hiệu đồ uống địa phương (Healthy lifestyle). Tổ chức lễ khai trương tại Đà Nẵng; Thiết kế & thi công sự kiện; Điều phối nhân sự/MC; Truyền thông.',
        timeline: '',
        services: ['to-chuc-su-kien', 'thiet-ke-an-pham'],
        kpi: '',
        category: 'Sự kiện khai trương'
    },
    {
        name: 'Chin Huei Cup - Giải đấu thể thao nội bộ',
        description: 'Giải đấu thể thao nội bộ doanh nghiệp. Tổ chức & vận hành trọn gói: Concept, kịch bản, thiết kế nhận diện, điều phối giải đấu, sản xuất hình ảnh/video.',
        timeline: '',
        services: ['to-chuc-su-kien', 'thiet-ke-an-pham', 'media-production'],
        kpi: '',
        category: 'Sự kiện thể thao'
    },
];

async function importData() {
    console.log('🚀 Starting import...');

    // First, fetch all services to get their IDs
    const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, slug');

    if (servicesError || !servicesData) {
        console.error('❌ Error fetching services:', servicesError);
        return;
    }

    const serviceIdMap = new Map<string, string>();
    servicesData.forEach(s => serviceIdMap.set(s.slug, s.id));

    console.log('📋 Found services:', Array.from(serviceIdMap.keys()));

    // Combine projects and events
    const allProjects = [...projects, ...events];
    let order = 1;

    for (const project of allProjects) {
        // Insert into each relevant service
        for (const serviceSlug of project.services) {
            const serviceId = serviceIdMap.get(serviceSlug);

            if (!serviceId) {
                console.log(`⚠️ Service not found: ${serviceSlug}`);
                continue;
            }

            const contentHtml = `
                <h2>Về dự án</h2>
                <p>${project.description}</p>
                ${project.timeline ? `<p><strong>Thời gian triển khai:</strong> ${project.timeline}</p>` : ''}
                ${project.kpi ? `<h3>KPI đạt được</h3><p>${project.kpi}</p>` : ''}
            `.trim();

            const { error: insertError } = await supabase
                .from('service_articles')
                .insert({
                    service_id: serviceId,
                    title: project.name,
                    content: contentHtml,
                    category: project.category,
                    published: true,
                    display_order: order,
                });

            if (insertError) {
                console.error(`❌ Error inserting ${project.name}:`, insertError);
            } else {
                console.log(`✅ Inserted: ${project.name} → ${serviceSlug}`);
            }
        }
        order++;
    }

    console.log('🎉 Import completed!');
}

importData();
