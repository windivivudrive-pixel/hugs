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

            // Fix LanguageSwitcher
            content = content.replace(/from\s+['"]@\/components\/sections\/LanguageSwitcher['"]/g, "from '@/components/ui/LanguageSwitcher'");
            
            // Fix lib files
            content = content.replace(/from\s+['"]@\/components\/sections\/lib\/(formUtils|slugUtils|staticData|useDocumentHead)['"]/g, "from '@/lib/$1'");
            
            // Fix viewTracker supabase import
            if (fullPath.endsWith('viewTracker.ts')) {
                content = content.replace(/from\s+['"]\.\/supabase['"]/g, "from '@/lib/actions'");
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed paths in:', fullPath);
            }
        }
    }
}

['components', 'app', 'lib'].forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (fs.existsSync(fullDir)) {
        processDir(fullDir);
    }
});
console.log('Done fixing paths.');
