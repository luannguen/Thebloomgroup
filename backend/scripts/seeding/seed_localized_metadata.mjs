import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const languages = ['en', 'de', 'fr', 'ru', 'ja', 'ko', 'zh', 'hr', 'sl', 'sr'];

const titles = {
  en: "VIETVINH Corporation - Leading Industrial Refrigeration Solutions in Vietnam",
  de: "VIETVINH Corporation - Führende industrielle Kältelösungen in Vietnam",
  fr: "VIETVINH Corporation - Solutions de réfrigération industrielle de pointe au Vietnam",
  ru: "VIETVINH Corporation - Ведущие промышленные холодильные решения во Вьетнаме",
  ja: "VIETVINH Corporation - ベトナムを代表する産業用冷凍ソリューション",
  ko: "VIETVINH Corporation - 베트남 최고의 산업용 냉동 솔루션",
  zh: "VIETVINH Corporation - 越南领先的工业制冷解决方案",
  hr: "VIETVINH Corporation - Vodeća rješenja industrijskog hlađenja u Vijetnamu",
  sl: "VIETVINH Corporation - Vodilne rešitve za industrijsko hlajenje v Vietnamu",
  sr: "VIETVINH Corporation - Vodeća rešenja industrijskog hlađenja u Vijetnamu"
};

const descriptions = {
  en: "Comprehensive refrigeration solutions for all projects. Prestige, Quality, Efficiency.",
  de: "Umfassende Kältelösungen für alle Projekte. Ansehen, Qualität, Effizienz.",
  fr: "Solutions de réfrigération complètes pour tous les projets. Prestige, Qualité, Efficacité.",
  ru: "Комплексные холодильные решения для всех проектов. Престиж, Качество, Эффективность.",
  ja: "あらゆるプロジェクトに対応する包括的な冷凍ソリューション。信頼、品質、効率。",
  ko: "모든 프로젝트를 위한 종합 냉동 솔루션. 신뢰, 품질, 효율.",
  zh: "适用于所有项目的全面制冷解决方案。信誉、质量、效率。",
  hr: "Sveobuhvatna rješenja hlađenja za sve projekte. Ugled, Kvaliteta, Učinkovitost.",
  sl: "Celovite rešitve hlajenja za vse projekte. Ugled, Kakovost, Učinkovitost.",
  sr: "Sveobuhvatna rešenja hlađenja za sve projekte. Ugled, Kvalitet, Efikasnost."
};

async function seedSettings() {
  try {
    await client.connect();
    console.log('Connected to Database');

    for (const lang of languages) {
      const settings = [
        { key: `site_title_${lang}`, value: titles[lang] },
        { key: `site_description_${lang}`, value: descriptions[lang] },
        { key: `site_keywords_${lang}`, value: "refrigeration, vvc, hvac, mep, vvc corp" },
        { key: `copyright_text_${lang}`, value: `© 2024 VVC. All rights reserved.` },
        { key: `contact_address_${lang}`, value: "123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam" }
      ];

      for (const s of settings) {
        await client.query(
          'INSERT INTO public.site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
          [s.key, s.value]
        );
      }
      console.log(`Seeded metadata for ${lang}`);
    }

    console.log('All metadata seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seedSettings();
