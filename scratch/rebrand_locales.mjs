import fs from 'fs';
import path from 'path';

const localesDir = 'f:/code duan/Thebloomgroup/thebloomgroup/src/locales';

const replacements = [
  { search: /Việt Vinh Industries Corporation/gi, replace: 'Thebloomgroup' },
  { search: /VIETVINH INDUSTRIES CORPORATION/gi, replace: 'Thebloomgroup' },
  { search: /Việt Vinh Corporation/gi, replace: 'Thebloomgroup' },
  { search: /Việt Vinh Corp/gi, replace: 'Thebloomgroup' },
  { search: /VietVinhCorp/gi, replace: 'Thebloomgroup' },
  { search: /Việt Vinh/gi, replace: 'Thebloomgroup' },
  { search: /Viet Vinh/gi, replace: 'Thebloomgroup' },
  { search: /VIETVINH/g, replace: 'THEBLOOMGROUP' }, // Upper case version
  { search: /VVC/g, replace: 'Thebloomgroup' },
  { search: /Thuong Thien Technologies/gi, replace: 'Thebloomgroup' },
  { search: /vietvinhcorp\.com/gi, replace: 'thebloomgroup.vn' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.json')) {
      processFile(filePath);
    }
  });
}

console.log('Starting localization rebranding...');
walkDir(localesDir);
console.log('Finished localization rebranding.');
