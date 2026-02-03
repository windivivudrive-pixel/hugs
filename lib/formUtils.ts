/**
 * Form utilities for HUGs Agency
 * - Honeypot anti-spam
 * - Rate limiting
 * - Google Form submission helper
 */

// ========== RATE LIMITING ==========
const RATE_LIMIT_KEY = 'hugs_form_submissions';
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface SubmissionRecord {
    timestamp: number;
    formType: string;
}

export const checkRateLimit = (formType: string): boolean => {
    try {
        const data: SubmissionRecord[] = JSON.parse(
            localStorage.getItem(RATE_LIMIT_KEY) || '[]'
        );
        const now = Date.now();

        // Filter submissions within the time window for this form type
        const recent = data.filter(
            (record) =>
                now - record.timestamp < WINDOW_MS &&
                record.formType === formType
        );

        return recent.length < MAX_SUBMISSIONS;
    } catch {
        return true; // Allow if localStorage fails
    }
};

export const recordSubmission = (formType: string): void => {
    try {
        const data: SubmissionRecord[] = JSON.parse(
            localStorage.getItem(RATE_LIMIT_KEY) || '[]'
        );
        const now = Date.now();

        // Clean old records and add new one
        const updated = data
            .filter((record) => now - record.timestamp < WINDOW_MS)
            .concat({ timestamp: now, formType });

        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated));
    } catch {
        // Ignore localStorage errors
    }
};

// ========== HONEYPOT VALIDATION ==========
export const validateHoneypot = (honeypotValue: string): boolean => {
    // If honeypot field is filled, it's likely a bot
    return !honeypotValue || honeypotValue.trim() === '';
};

// ========== GOOGLE FORM SUBMISSION ==========
interface GoogleFormConfig {
    formActionUrl: string;
    entries: Record<string, string>;
}

export const submitToGoogleForm = async (
    config: GoogleFormConfig,
    data: Record<string, string | string[]>
): Promise<{ success: boolean; message: string }> => {
    try {
        const formData = new FormData();

        // Map data to Google Form entry IDs
        Object.entries(data).forEach(([key, value]) => {
            const entryId = config.entries[key];
            if (entryId) {
                if (Array.isArray(value)) {
                    // For checkbox/multi-select fields
                    value.forEach((v) => formData.append(entryId, v));
                } else {
                    formData.append(entryId, value);
                }
            }
        });

        // Submit to Google Form (no-cors mode)
        await fetch(config.formActionUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
        });

        return { success: true, message: 'Gửi thành công!' };
    } catch (error) {
        console.error('Form submission error:', error);
        return { success: false, message: 'Có lỗi xảy ra. Vui lòng thử lại.' };
    }
};

// ========== FILE UTILITIES ==========
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
};

export const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
};

export const isAllowedFileType = (
    filename: string,
    allowedExtensions: string[]
): boolean => {
    const ext = getFileExtension(filename);
    return allowedExtensions.includes(ext);
};

// ========== FORM CONFIGS ==========
export const CTA_FORM_CONFIG: GoogleFormConfig = {
    formActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-ayfr6necV38Q5yvhCy4LFRyQVhPxDUww10ycFIi3fVKESQ/formResponse',
    entries: {
        fullName: 'entry.598121209',
        email: 'entry.192294861',
        phone: 'entry.253522908',
        description: 'entry.663226597',
        interests: 'entry.1121049197',
    },
};

export const RECRUITMENT_FORM_CONFIG: GoogleFormConfig = {
    formActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeRFBFO8WrL7JiuYYY1WA_B_vk5S8OtCCqmKENYiX1qjFZehQ/formResponse',
    entries: {
        fullName: 'entry.836330583',
        position: 'entry.1555290481',
        email: 'entry.1783821993',
        phone: 'entry.68746479',
        portfolio: 'entry.1556646817',
        cvUrl: 'entry.421962903',
        message: 'entry.987937138',
    },
};

// Service options for CTA form
export const SERVICE_OPTIONS = [
    'Xây dựng nội dung & Quản trị Facebook',
    'Xây dựng nội dung & vận hành kênh TikTok',
    'Sản xuất hình ảnh & video',
    'Triển khai quảng cáo đa nền tảng',
    'Thiết kế website & SEO',
    'Thiết kế ấn phẩm truyền thông',
    'Thương mại điện tử',
    'Tổ chức sự kiện & activation',
    'Seeding',
];
