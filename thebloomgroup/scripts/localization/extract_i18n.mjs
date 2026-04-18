import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Script này quét toàn bộ mã nguồn để tìm các key i18n t('key', 'default')
 * và cập nhật vào file translation.json của vi và en.
 */

const LOCALES_DIR = './src/locales';
const SOURCE_DIR = './src';

async function extractTranslations() {
  console.log('--- Đang bắt đầu trích xuất i18n keys ---');

  const files = await glob(`${SOURCE_DIR}/**/*.{ts,tsx}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts']
  });

  const translations = {};
  
  // Regex tìm t('key', 'default') hoặc t("key", "default")
  // hỗ trợ cả nháy đơn và nháy kép, và có thể có tham số khác
  const tRegex = /t\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*/g;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = tRegex.exec(content)) !== null) {
      const key = match[1];
      const defaultValue = match[2];
      translations[key] = defaultValue;
    }
  }

  console.log(`Tìm thấy ${Object.keys(translations).length} unique keys.`);

  // Cập nhật cho VI và EN
  const langs = ['vi', 'en'];
  
  for (const lang of langs) {
    const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
    const dirPath = path.dirname(filePath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let existingData = {};
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // Merge: Ưu tiên nội dung đã dịch trong file hiện tại, 
    // nếu chưa có thì lấy default value từ mã nguồn
    const mergedData = { ...translations, ...existingData };

    // Sắp xếp key theo bảng chữ cái để dễ quản lý
    const sortedData = {};
    Object.keys(mergedData).sort().forEach(key => {
      sortedData[key] = mergedData[key];
    });

    fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2), 'utf8');
    console.log(`Đã cập nhật ${filePath}`);
  }

  console.log('--- Hoàn tất trích xuất i18n ---');
}

extractTranslations().catch(console.error);
