const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;

            // Replace imports ending with lib/supabase or similar
            content = content.replace(/from\s+['"].*?lib\/supabase['"]/g, "from '@/lib/actions'");
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed supabase imports in:', fullPath);
            }
        }
    }
}

['components', 'app'].forEach(dir => processDir(path.join(__dirname, dir)));
console.log('Done fixing Supabase imports.');
