const fs = require('fs');
const path = require('path');

// 1. types.ts
let typesContent = fs.readFileSync('lib/types.ts', 'utf8');
typesContent = typesContent.replace(/export interface ServiceArticle \{/g, `export interface ProjectCategory {
    id: string;
    name: string;
    slug: string;
    display_order: number;
}

export interface ServiceArticle {`);
typesContent = typesContent.replace(/service_id: string;/g, `service_id: string;
  logo?: string;
  project_category_id?: string;
  service_category_id?: string;
  project_category?: ProjectCategory;`);
typesContent = typesContent.replace(/category_color\?: string;/g, `category_color?: string;
  category_slug?: string;`);
fs.writeFileSync('lib/types.ts', typesContent);

// 2. actions.ts
let actionsContent = fs.readFileSync('lib/actions.ts', 'utf8');
actionsContent = actionsContent.replace(/export const supabase = \{/g, `export const supabase: any = {`);
actionsContent = actionsContent.replace(/export const uploadCV = async \(file: File\): Promise<string \| null> => \{[\s\S]*?\};/g, `export const uploadCV = async (file: File) => {
    console.log("Mock CV Uploaded:", file.name);
    return { url: "https://hugs.agency/mock-cv-url.pdf", error: null };
};`);
fs.writeFileSync('lib/actions.ts', actionsContent);

// 3. actions-server.ts
let actionsServerContent = fs.readFileSync('lib/actions-server.ts', 'utf8');
actionsServerContent = actionsServerContent.replace(/export const fetchNewsArticles = async \(\): Promise<NewsArticle\[\]> => \{/g, `export const fetchNewsArticles = async (limit?: number): Promise<NewsArticle[]> => {`);
actionsServerContent = actionsServerContent.replace(/export const recordArticleView = async \(articleId: string\) => \{/g, `export const recordArticleView = async (articleId: string | number) => {`);
fs.writeFileSync('lib/actions-server.ts', actionsServerContent);

// 4. components
function fixComponents(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixComponents(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/author\.total_views\.toLocaleString/g, "author.total_views?.toLocaleString");
            content = content.replace(/stripHtml\(article\.content\)/g, "stripHtml(article.content || '')");
            content = content.replace(/\(displayArticle as NewsArticle\)\.author_details\.avatar_url/g, "(displayArticle as NewsArticle).author_details?.avatar_url");
            content = content.replace(/\(displayArticle as NewsArticle\)\.author_details\.name/g, "(displayArticle as NewsArticle).author_details?.name");
            fs.writeFileSync(fullPath, content);
        }
    }
}
fixComponents('components');

console.log('Fixed more TS errors');
