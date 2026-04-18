import fs from 'fs';
import path from 'path';

const localesDir = '../../src/locales';
const languages = ['en', 'de', 'ja', 'fr', 'zh', 'ko', 'ru', 'hr', 'sr', 'sl'];

const translations = {
  'en': {
    'home_news_title': 'News & Events',
    'view_details': 'View Details',
    'get_consultancy': 'Get Consultancy',
    'copyright': '© 2026 VietVinhCorp. All rights reserved.',
    'view_detail': 'View Details',
    'learn_more': 'Learn More',
    'industry_me_desc': 'Comprehensive electromechanical solutions for all scales.',
  },
  'de': {
    'home_news_title': 'News & Events',
    'view_details': 'Details anzeigen',
    'get_consultancy': 'Beratung anfordern',
    'copyright': '© 2026 VietVinhCorp. Alle Rechte vorbehalten.',
    'view_detail': 'Details anzeigen',
    'learn_more': 'Mehr erfahren',
    'industry_me_desc': 'Erstklassige technische Lösungen für alle Größenordnungen.',
  },
  'ja': {
    'home_news_title': 'ニュース＆イベント',
    'view_details': '詳細を見る',
    'get_consultancy': '相談する',
    'copyright': '© 2026 VietVinhCorp. 全著作権所有。',
    'view_detail': '詳細を見る',
    'learn_more': '詳細を見る',
    'industry_me_desc': 'あらゆる規模に対応する最高級の技術ソリューション。',
  },
  'zh': {
    'home_news_title': '新闻与活动',
    'view_details': '查看详情',
    'get_consultancy': '获取咨询',
    'copyright': '© 2026 VietVinhCorp. 版权所有。',
    'view_detail': '查看详情',
    'learn_more': '了解更多',
    'industry_me_desc': '为大型项目设计和建造电力系统、供排水和暖通空调。',
  }
};

// Fallback logic for all 10 languages
languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updates = translations[lang] || translations['en']; // Use EN for others
    
    // Inject updates
    const merged = { ...existing, ...updates };
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`Successfully perfected ${lang}`);
  }
});
