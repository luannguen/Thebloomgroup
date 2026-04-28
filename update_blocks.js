const fs = require('fs');
const file = 'backend/src/components/admin/visual-editor/BlockLibrary.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add items to features block
content = content.replace(
  /{ id: 'icon_image', label: 'Icon\/Ảnh minh họa', type: 'image' }/g,
  "{ id: 'icon_image', label: 'Icon/Ảnh minh họa', type: 'image' },\n            { id: 'items', label: 'Danh sách tính năng', type: 'list', itemSchema: [ { id: 'icon', label: 'Icon', type: 'image' }, { id: 'title', label: 'Tiêu đề', type: 'textarea' }, { id: 'description', label: 'Mô tả', type: 'textarea' } ] }"
);

// Change text to textarea for titles and subtitles
content = content.replace(/{ id: '([^']+)', label: '([^']+)', type: 'text'([^}]*)}/g, (match, id, label, rest) => {
    // Keep text for short things
    if (id.includes('badge') || id.includes('Link') || id.includes('link') || id.includes('Label') || id.includes('expYears') || id.includes('year') || id.includes('address') || id.includes('phone') || id.includes('email') || id.includes('range')) {
        return match;
    }
    // Change to textarea for title, subtitle, desc, name
    return `{ id: '${id}', label: '${label}', type: 'textarea'${rest}}`;
});

fs.writeFileSync(file, content);
console.log('Modified BlockLibrary.tsx');
