import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../../thebloomgroup/src');

const replacements = [
    { old: /VVC/g, new: 'Thebloomgroup' },
    { old: /Viet Vinh Corporation/g, new: 'Thebloomgroup' },
    { old: /Việt Vinh Corp/g, new: 'Thebloomgroup' },
    { old: /Việt Vinh/g, new: 'Thebloomgroup' }
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

console.log('--- Starting Code Rebranding ---');

walkDir(rootDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.json')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        replacements.forEach(r => {
            content = content.replace(r.old, r.new);
        });

        if (content !== originalContent) {
            console.log(`- Updated: ${filePath}`);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});

console.log('--- Code Rebranding Completed ---');
