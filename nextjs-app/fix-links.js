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

            // Replace <Link to= with <Link href=
            content = content.replace(/<Link\s+to=/g, "<Link href=");
            
            // Fix import Link from 'next/navigation' to 'next/link' (next/navigation is for hooks, next/link is for the component)
            content = content.replace(/import\s+\{([^}]*)Link([^}]*)\}\s+from\s+['"]next\/navigation['"]/g, (match, prefix, suffix) => {
                const newInner = `${prefix}${suffix}`.replace(/,\s*,/g, ',').replace(/^,|,$/g, '').trim();
                let replacement = `import Link from 'next/link';\n`;
                if (newInner) {
                    replacement += `import { ${newInner} } from 'next/navigation';`;
                }
                return replacement;
            });
            content = content.replace(/import\s+Link\s+from\s+['"]next\/navigation['"]/g, "import Link from 'next/link'");
            
            // Fix useLocation / useHistory ? next/navigation uses usePathname, useRouter
            // the user didn't mention it failing for useNavigate so maybe they don't exist much, but we'll see next build.

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed Links in:', fullPath);
            }
        }
    }
}

['components', 'app', 'lib'].forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (fs.existsSync(fullDir)) processDir(fullDir);
});
console.log('Done fixing Links.');
