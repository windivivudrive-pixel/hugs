const fs = require('fs');
const path = require('path');

// 1. types.ts
let typesContent = fs.readFileSync('lib/types.ts', 'utf8');
if (!typesContent.includes('export interface ServiceCategory')) {
    typesContent = typesContent.replace(/export interface ProjectCategory \{/, `export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}
export interface ProjectCategory {`);
}
typesContent = typesContent.replace(/export interface NewsArticle \{/, `export interface NewsArticle {
  author_id?: string;
  published?: boolean;
  display_order?: number;`);
// fix category for ServiceArticle
typesContent = typesContent.replace(/service_category_id\?: string;/g, `service_category_id?: string;
  category?: string;`);
fs.writeFileSync('lib/types.ts', typesContent);

// 2. actions.ts (mock signatures)
let actionsContent = fs.readFileSync('lib/actions.ts', 'utf8');
actionsContent = actionsContent.replace(/export const uploadThumbnail = async \(\): Promise<string \| null> => null;/g, `export const uploadThumbnail = async (file: File, folder?: string) => ({ url: "https://mock", error: null });`);
actionsContent = actionsContent.replace(/export const deleteThumbnail = async \(\): Promise<void> => \{\};/g, `export const deleteThumbnail = async (url: string) => {};`);
fs.writeFileSync('lib/actions.ts', actionsContent);

// 3. actions-server.ts
let actionsServerContent = fs.readFileSync('lib/actions-server.ts', 'utf8');
actionsServerContent = actionsServerContent.replace(/export const fetchNewsArticles = async \(\)/g, `export const fetchNewsArticles = async (limit?: number)`);
actionsServerContent = actionsServerContent.replace(/export const recordArticleView = async \(articleId: string\)/g, `export const recordArticleView = async (articleId: string | number)`);
fs.writeFileSync('lib/actions-server.ts', actionsServerContent);

// 4. wordpress.ts
let wpContent = fs.readFileSync('lib/wordpress.ts', 'utf8');
wpContent = wpContent.replace(/view_count: 0,/g, 'views: 0,');
fs.writeFileSync('lib/wordpress.ts', wpContent);

// 5. fix useSearchParams in AllProjectPage.tsx and ProjectsPage.tsx
function fixSearchParams(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const \[searchParams\] = useSearchParams\(\);/g, `const searchParams = useSearchParams();\n    const router = useRouter();`);
    content = content.replace(/const \[searchParams, setSearchParams\] = useSearchParams\(\);/g, `const searchParams = useSearchParams();\n    const router = useRouter();`);
    content = content.replace(/setSearchParams\(\{ service: service\.slug \}\)/g, "router.push(`?service=${service.slug}`)");
    
    // ensure useRouter is imported
    if (content.match(/useRouter/)) {
        if (!content.includes('import { useRouter }')) {
            content = content.replace(/import \{ useSearchParams \} from 'next\/navigation';/, `import { useSearchParams, useRouter } from 'next/navigation';`);
        }
    }
    
    // Any AllProjectPage or AdminPage s => s.slug
    content = content.replace(/servicesData\.find\(s => s\.slug/g, `servicesData.find((s: any) => s.slug`);
    
    fs.writeFileSync(file, content);
}

fixSearchParams('components/AllProjectPage.tsx');
fixSearchParams('components/ProjectsPage.tsx');

console.log('Fixed TS pass 3');
