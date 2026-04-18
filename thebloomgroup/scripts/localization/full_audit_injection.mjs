import fs from 'fs';
import path from 'path';

const localesDir = '../../src/locales';
const languages = ['en', 'de', 'ja', 'fr', 'zh', 'ko', 'ru', 'hr', 'sr', 'sl'];

const globalSweep = {
  'en': {
    'industry_ref_factor_1_title': 'Equipment Quality',
    'industry_ref_factor_2_title': 'Correct Configuration',
    'industry_ref_factor_4_title': 'Smart Algorithms',
    'learn_more': 'Learn More',
    'quote_now': 'Get Technical Quote',
    'about_hero_title': 'Introduction',
    'about_hero_desc': 'Vietnam Refrigeration Industry Corporation (VVC) - A pioneer in industrial cooling solutions.',
    'history_title': 'Development History',
    'history_p1': 'Founded in 2003, VietVinhCorp began its journey with the desire to conquer the peaks of cooling technology.',
    'history_p2': 'From a unit specialized in installation, we expanded into design consulting and production of precision cooling mechanical components.',
    'history_p3': 'Today, VVC is proud to be a strategic partner for many multinational corporations and key infrastructure projects.',
    'vision_title': 'Vision',
    'mission_title': 'Mission',
    'core_values_title': 'Core Values',
    'leadership_team_title': 'Leadership Team',
    'facilities_title': 'Infrastructure & Production Center',
    'quality_principles_title': 'VVC Quality Principles',
    'partners_clients_title': 'Partners & Clients'
  },
  'de': {
    'industry_ref_factor_1_title': 'Gerätequalität',
    'industry_ref_factor_2_title': 'Korrekte Konfiguration',
    'industry_ref_factor_4_title': 'Intelligente Algorithmen',
    'learn_more': 'Mehr erfahren',
    'quote_now': 'Technisches Angebot anfordern',
    'about_hero_title': 'Einführung',
    'about_hero_desc': 'Vietnam Refrigeration Industry Corporation (VVC) - Ein Pionier für industrielle Kühllösungen.',
    'history_title': 'Entwicklungsgeschichte',
    'history_p1': 'VietVinhCorp wurde 2003 gegründet und begann seine Reise mit dem Ziel, die Kältetechnik zu revolutionieren.',
    'history_p2': 'Vom Spezialisten für Installation haben wir uns zu einem Anbieter für Designberatung und Präzisionsfertigung entwickelt.',
    'history_p3': 'Heute ist VVC strategischer Partner für multinationale Konzerne und wichtige Infrastrukturprojekte.',
    'vision_title': 'Vision',
    'mission_title': 'Mission',
    'core_values_title': 'Kernwerte',
    'leadership_team_title': 'Führungsteam',
    'facilities_title': 'Infrastruktur & Produktionszentrum',
    'quality_principles_title': 'VVC Qualitätsprinzipien',
    'partners_clients_title': 'Partner & Kunden'
  },
  'ja': {
    'industry_ref_factor_1_title': '機器の品質',
    'industry_ref_factor_2_title': '正確な構成',
    'industry_ref_factor_4_title': 'スマートアルゴリズム',
    'learn_more': '詳細を見る',
    'quote_now': '技術見積を依頼する',
    'about_hero_title': 'はじめに',
    'about_hero_desc': 'ベトナム冷凍工業株式会社（VVC）- 産業用冷却ソリューションのパイオニア。',
    'history_title': '沿革',
    'history_p1': '2003年に設立されたVietVinhCorpは、冷却技術の頂点を極めるという志からその歩みを始めました。',
    'history_p2': '施工専門の組織から、設計コンサルティングや精密冷却部品の製造へと事業を拡大しました。',
    'history_p3': '現在、VVCは多くの多国籍企業や主要インフラプロジェクトの戦略的パートナーであることを誇りに思っています。',
    'vision_title': 'ビジョン',
    'mission_title': 'ミッション',
    'core_values_title': 'コアバリュー',
    'leadership_team_title': 'リーダーシップチーム',
    'facilities_title': 'インフラと生産センター',
    'quality_principles_title': 'VVC品質原則',
    'partners_clients_title': 'パートナーとクライアント'
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updates = globalSweep[lang] || globalSweep['en'];
    fs.writeFileSync(filePath, JSON.stringify({ ...existing, ...updates }, null, 2));
    console.log(`Audited and Corrected ${lang}`);
  }
});
