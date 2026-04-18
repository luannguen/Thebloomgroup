import fs from 'fs';
import path from 'path';

const localesDir = '../../src/locales';
const languages = ['en', 'de', 'ja', 'fr', 'zh', 'ko', 'ru', 'hr', 'sr', 'sl'];

const translations = {
  'sr': {
    'industry_lifecycle_title': 'Vrhunski životni ciklus usluga',
    'industry_lifecycle_desc': 'Pratimo klijente od ideacije do stabilnog rada i održavanja.',
    'lifecycle_s1_title': 'Savetovanje i projektovanje',
    'lifecycle_s1_desc': 'Anketa i predlog optimalnih tehničkih rešenja.',
    'lifecycle_s2_title': 'Izgradnja i instalacija',
    'lifecycle_s2_desc': 'Profesionalna izvedba prema strogim rokovima.',
    'lifecycle_s3_title': 'Rad i podrška',
    'lifecycle_s3_desc': 'Obezbeđivanje stabilnog rada sistema 24/7.',
    'lifecycle_s4_title': 'Održavanje i popravka',
    'lifecycle_s4_desc': 'Posvećena i precizna postprodajna usluga.',
    'explore_service_details': 'Istražite detalje usluge',
    'home_news_title': 'Vesti i događaji',
    'home_news_subtitle': 'Budite u toku sa našim najnovijim aktivnostima, tehnologijama i uvidima u industriju.',
    'view_all_news_posts': 'Pogledajte sve vesti',
    'SỰ KIỆN': 'DOGAĐAJI',
    'TIN CÔNG TY': 'VESTI KOMPANIJE',
    'TIN TỨC': 'VESTI',
    'copyright': '© 2026 VietVinhCorp. Sva prava zadržana.',
    'view_details': 'Prikaži detalje',
    'get_consultancy': 'Zatražite savet'
  },
  'en': {
    'industry_lifecycle_title': 'Comprehensive Service Lifecycle',
    'industry_lifecycle_desc': 'We accompany customers from ideation to stable operation.',
    'lifecycle_s1_title': 'Consulting & Design',
    'lifecycle_s1_desc': 'Survey and propose optimal technical solutions.',
    'lifecycle_s2_title': 'Construction & Installation',
    'lifecycle_s2_desc': 'Professional execution following strict schedules.',
    'lifecycle_s3_title': 'Operation & Support',
    'lifecycle_s3_desc': 'Ensuring stable and reliable 24/7 system operation.',
    'lifecycle_s4_title': 'Maintenance & Repair',
    'lifecycle_s4_desc': 'Dedicated and precise after-sales service.',
    'explore_service_details': 'Explore Service Details',
    'home_news_title': 'News & Events',
    'home_news_subtitle': 'Stay updated with our latest activities, advanced technology and industry insights.',
    'view_all_news_posts': 'View All News',
    'SỰ KIỆN': 'EVENTS',
    'TIN CÔNG TY': 'COMPANY NEWS',
    'TIN TỨC': 'NEWS',
    'copyright': '© 2026 VietVinhCorp. All rights reserved.'
  },
  'de': {
    'industry_lifecycle_title': 'Umfassender Service-Lebenszyklus',
    'industry_lifecycle_desc': 'Wir begleiten Kunden von der Idee bis zum stabilen Betrieb.',
    'lifecycle_s1_title': 'Beratung & Planung',
    'lifecycle_s2_title': 'Bau & Installation',
    'lifecycle_s3_title': 'Betrieb & Support',
    'lifecycle_s4_title': 'Wartung & Reparatur',
    'explore_service_details': 'Service-Details erkunden',
    'home_news_title': 'News & Events',
    'home_news_subtitle': 'Bleiben Sie informiert über unsere neuesten Aktivitäten und Technologien.',
    'view_all_news_posts': 'Alle News ansehen',
    'SỰ KIỆN': 'EVENTS',
    'TIN CÔNG TY': 'UNTERNEHMENS-NEWS',
    'copyright': '© 2026 VietVinhCorp. Alle Rechte vorbehalten.'
  },
  'ja': {
    'industry_lifecycle_title': '包括的なサービスライフサイクル',
    'industry_lifecycle_desc': '構想から安定稼働まで、お客様に寄り添います。',
    'lifecycle_s1_title': 'コンサルティング・設計',
    'lifecycle_s2_title': '施工・据付',
    'lifecycle_s3_title': '運用・サポート',
    'lifecycle_s4_title': 'メンテナンス・修理',
    'explore_service_details': 'サービスの詳細を見る',
    'home_news_title': 'ニュース＆イベント',
    'home_news_subtitle': '最新の活動や技術に関する情報をお届けします。',
    'view_all_news_posts': 'すべてのニュースを見る',
    'SỰ KIỆN': 'イベント',
    'TIN CÔNG TY': '企業ニュース',
    'copyright': '© 2026 VietVinhCorp. 全著作権所有。'
  },
  'zh': {
    'industry_lifecycle_title': '全方位服务生命周期',
    'industry_lifecycle_desc': '从构思到稳定运营，我们全程陪伴客户。',
    'lifecycle_s1_title': '咨询与设计',
    'lifecycle_s2_title': '施工与安装',
    'lifecycle_s3_title': '运营与支持',
    'lifecycle_s4_title': '维护与修理',
    'explore_service_details': '探索服务详情',
    'home_news_title': '新闻与活动',
    'home_news_subtitle': '时刻关注我们的最新动态和技术见解。',
    'view_all_news_posts': '查看所有新闻',
    'SỰ KIỆN': '活动',
    'TIN CÔNG TY': '公司新闻',
    'copyright': '© 2026 VietVinhCorp. 版权所有。'
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updates = translations[lang] || translations['en']; 
    const merged = { ...existing, ...updates };
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`Successfully perfected ${lang}`);
  }
});
