import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Import required from TS using a dynamic approach or just executing it inside a TS environment
// We will run this file using tsx
import { translations } from './lib/translations.js';

const vi = translations.VI;

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>HUGs Agency - Dữ liệu đào tạo Bot</title>
</head>
<body>
    <h1>Thông tin chung về HUGs Agency (Trang Chủ & Giới Thiệu)</h1>

    <h2>1. Tổng quan</h2>
    <p><strong>Tên:</strong> ${vi.hero.title}</p>
    <p><strong>Slogan:</strong> ${vi.hero.subtitle}</p>
    <p><strong>Mô tả:</strong> ${vi.about.description}</p>
    <p><strong>Địa chỉ:</strong> ${vi.footer.address}</p>

    <h2>2. HUGs là ai?</h2>
    <p>${vi.about.whoContent}</p>

    <h2>3. Cách chúng tôi triển khai</h2>
    <ul>
        <li>${vi.about.howContent1}</li>
        <li>${vi.about.howContent2}</li>
        <li>${vi.about.howContentHighlight}</li>
    </ul>

    <h2>4. Tầm nhìn</h2>
    <p>${vi.about.visionContent} ${vi.about.visionHighlight1} và ${vi.about.visionHighlight2}${vi.about.visionContentEnd}</p>

    <h2>5. Con người và cấu trúc</h2>
    <p>${vi.about.peopleDesc}</p>
    <ul>
        <li>${vi.about.stats.personnel}: 30+</li>
        <li>${vi.about.stats.departments}: 6</li>
        <li>${vi.about.stats.projects}: 50+</li>
        <li>${vi.about.stats.experience}: 4</li>
    </ul>
    <p>${vi.about.structureDesc}</p>

    <h2>6. Văn hoá</h2>
    <p>${vi.about.cultureDesc}</p>
    <ul>
        <li><strong>${vi.about.values.v1.title}:</strong> ${vi.about.values.v1.desc}</li>
        <li><strong>${vi.about.values.v2.title}:</strong> ${vi.about.values.v2.desc}</li>
        <li><strong>${vi.about.values.v3.title}:</strong> ${vi.about.values.v3.desc}</li>
    </ul>
    <p><em>${vi.about.quote}</em></p>

    <h2>7. Tại sao chọn HUGs?</h2>
    <p>${vi.about.whyDesc}</p>
    <ul>
        <li><strong>${vi.about.reasons.r1.title}:</strong> ${vi.about.reasons.r1.desc}</li>
        <li><strong>${vi.about.reasons.r2.title}:</strong> ${vi.about.reasons.r2.desc}</li>
        <li><strong>${vi.about.reasons.r3.title}:</strong> ${vi.about.reasons.r3.desc}</li>
        <li><strong>${vi.about.reasons.r4.title}:</strong> ${vi.about.reasons.r4.desc}</li>
    </ul>

    <h2>8. Các phòng ban (Departments)</h2>
    <ul>
        ${Object.values(vi.departments).map(d => `<li>${d}</li>`).join('\n        ')}
    </ul>

    <h2>9. Dịch vụ (Services)</h2>
    <p>${vi.servicePage.description}</p>
    <ul>
        ${Object.keys(vi.services.items).map(k => `<li><strong>${(vi.services.items as any)[k]}</strong></li>`).join('\n        ')}
    </ul>

    <h2>10. Hệ sinh thái HUGs Network</h2>
    <p>${vi.socialSection.description}</p>
    <ul>
        ${Object.values(vi.socialSection.items).map(i => `<li><strong>${i.name}</strong>: ${i.desc}</li>`).join('\n        ')}
    </ul>
</body>
</html>`;

fs.writeFileSync('thong-tin-hugs-agency-cho-bot.html', htmlContent);
console.log('Đã tạo file thong-tin-hugs-agency-cho-bot.html thành công!');
