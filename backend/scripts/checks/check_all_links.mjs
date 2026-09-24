import fs from 'fs';
import path from 'path';

const srcDir = 'f:/code duan/Thebloomgroup/thebloomgroup/src';

const links = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/to=["'](\/[^"']*)["']/g);
      for (const m of matches) {
        links.add(m[1]);
      }
    }
  }
}

walk(srcDir);
console.log('=== All hardcoded internal links found in frontend code ===');
const sorted = Array.from(links).sort();
sorted.forEach(l => console.log(l));
