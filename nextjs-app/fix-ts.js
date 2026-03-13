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

            // Replace multiline or spaced `to=` inside Link (roughly)
            // Just replace ` to="` or ` to={` or `\nto=` with `href=`
            content = content.replace(/(\s)to=(["`{])/g, "$1href=$2");
            
            // Fix next/navigation useNavigate -> useRouter
            content = content.replace(/useNavigate/g, "useRouter");
            content = content.replace(/const navigate = useRouter\(\)/g, "const router = useRouter()");
            content = content.replace(/navigate\(/g, "router.push(");
            content = content.replace(/import \{ useRouter, \} from/g, "import { useRouter } from");

            // Fix LanguageSwitcher translation import
            content = content.replace(/@\/components\/sections\/lib\/translations/g, "@/lib/translations");
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

['components', 'app', 'lib'].forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (fs.existsSync(fullDir)) processDir(fullDir);
});
console.log('Fixed TS files');
