const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'components');

const replacements = [
  { match: /from\s+['"]@\/lib\/supabase['"]/g, replace: "from '@/lib/types'" },
  { match: /from\s+['"]@\/components\/sections\/PageNavbar['"]/g, replace: "from '@/components/ui/PageNavbar'" },
  { match: /from\s+['"]@\/components\/sections\/FooterSection['"]/g, replace: "from '@/components/ui/FooterSection'" },
  { match: /from\s+['"]@\/components\/sections\/Navbar['"]/g, replace: "from '@/components/ui/Navbar'" },
  { match: /from\s+['"]@\/components\/sections\/ChatBot['"]/g, replace: "from '@/components/ui/ChatBot'" },
  { match: /from\s+['"]@\/components\/sections\/LoadingScreen['"]/g, replace: "from '@/components/ui/LoadingScreen'" },
  { match: /from\s+['"]@\/components\/ui\/LanguageSwitcher['"]/g, replace: "from './LanguageSwitcher'" },
  { match: /from\s+['"]\.\.\/src\/data\/news\.json['"]/g, replace: "from '@/lib/types'" },
  { match: /from\s+['"]@\/src\/data\/news\.json['"]/g, replace: "from '@/lib/types'" },
  { match: /from\s+['"]@\/components\/sections\/lib\/useDocumentHead['"]/g, replace: "from '@/lib/useDocumentHead'" },
  { match: /from\s+['"]react-router-dom['"]/g, replace: "from 'next/navigation'" },
  { match: /import\s+\{\s*Link\s*\}/g, replace: "import Link" }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;
      for (const rule of replacements) {
        if (rule.match.test(content)) {
          content = content.replace(rule.match, rule.replace);
          updated = true;
        }
      }
      if (updated) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

// Additional fix for specific UI files inter-dependencies
function fixUiDependencies() {
  const uiDir = path.join(directoryPath, 'ui');
  if (fs.existsSync(uiDir)) {
    const files = fs.readdirSync(uiDir);
    for (const file of files) {
       if (file.endsWith('.tsx')) {
         const fullPath = path.join(uiDir, file);
         let content = fs.readFileSync(fullPath, 'utf8');
         let updated = false;
         
         const uiFixes = [
           { match: /from\s+['"]@\/components\/ui\/LanguageSwitcher['"]/g, replace: "from './LanguageSwitcher'" },
           { match: /from\s+['"]@\/components\/ui\/PageNavbar['"]/g, replace: "from './PageNavbar'" },
           { match: /from\s+['"]@\/components\/ui\/FooterSection['"]/g, replace: "from './FooterSection'" }
         ];
         
         for (const rule of uiFixes) {
           if (rule.match.test(content)) {
             content = content.replace(rule.match, rule.replace);
             updated = true;
           }
         }
         if (updated) {
           fs.writeFileSync(fullPath, content, 'utf8');
           console.log(`Fixed UI dep in ${fullPath}`);
         }
       }
    }
  }
}

processDirectory(directoryPath);
fixUiDependencies();
console.log('Done fixing imports.');
