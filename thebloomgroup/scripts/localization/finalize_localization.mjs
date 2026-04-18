import fs from 'fs';
import path from 'path';

const localesDir = '../../src/locales';
const languages = ['en', 'de', 'ja', 'fr', 'zh', 'ko', 'ru', 'hr', 'sr', 'sl'];

const globalBatch = {
  'en': {
    'tech_detail_ca_feature1': '24/7 monitoring of O2, CO2, N2 and Ethylene',
    'tech_detail_ca_feature2': 'Extends storage life up to 12 months (apples, pears)',
    'tech_detail_ca_feature3': 'Prevents growth of bacteria and natural mold',
    'tech_detail_ca_feature4': 'Minimizes product weight loss proportion',
    'tech_detail_iqf_feature1': 'Continuous operation with automatic conveyor',
    'tech_detail_iqf_feature2': 'Rapidly reaches -18°C core temperature',
    'tech_detail_iqf_feature3': 'Products do not stick, maintaining original shape',
    'tech_detail_iqf_feature4': '20% energy savings vs traditional tech',
    'tech_detail_ripening_feature1': 'Precise Ethylene control per stage',
    'tech_detail_ripening_feature2': 'Forced ventilation for even heat distribution',
    'tech_detail_ripening_feature3': 'Fully automated heating/cooling process',
    'tech_detail_ripening_feature4': 'Optimizes logistics and supply chain',
    'tech_detail_blast_feature1': 'Flexible capacity 1-50 tons per batch',
    'tech_detail_blast_feature2': 'Optimized air velocity for different food types',
    'tech_detail_blast_feature3': 'High-efficiency two-stage compressor',
    'tech_detail_blast_feature4': 'Insulated PIR panels (150-200mm thickness)',
    'quote_now': 'Get Technical Quote',
    'back': 'Go Back'
  },
  'de': {
    'tech_detail_ca_feature1': '24/7-Überwachung von O2, CO2, N2 und Ethylen',
    'tech_detail_ca_feature2': 'Verlängert die Lagerfähigkeit auf bis zu 12 Monate',
    'tech_detail_ca_feature3': 'Verhindert das Wachstum von Bakterien und Schimmel',
    'tech_detail_ca_feature4': 'Minimiert den Gewichtsverlust des Produkts',
    'tech_detail_iqf_feature1': 'Kontinuierlicher Betrieb mit Förderband',
    'tech_detail_iqf_feature2': 'Schnelles Erreichen der Kerntemperatur von -18°C',
    'tech_detail_iqf_feature3': 'Produkte kleben nicht zusammen',
    'tech_detail_iqf_feature4': '20% Energieeinsparung gegenüber herkömmlicher Technik',
    'tech_detail_ripening_feature1': 'Präzise Ethylensteuerung pro Stufe',
    'tech_detail_ripening_feature2': 'Zwangsbelüftung für gleichmäßige Wärmeverteilung',
    'tech_detail_ripening_feature3': 'Vollautomatisierter Heiz-/Kühlprozess',
    'tech_detail_ripening_feature4': 'Optimiert Logistik- und Lieferkettenzeiten',
    'tech_detail_blast_feature1': 'Flexible Kapazität von 1 bis 50 Tonnen/Charge',
    'tech_detail_blast_feature2': 'Optimierte Luftgeschwindigkeit für Lebensmittel',
    'tech_detail_blast_feature3': 'Hocheffizienter zweistufiger Kompressor',
    'tech_detail_blast_feature4': 'Isolierte PIR-Paneele (150-200mm Dicke)',
    'quote_now': 'Angebot anfordern',
    'back': 'Zurück'
  },
  'ja': {
    'tech_detail_ca_feature1': 'O2、CO2、N2、エチレンの24時間365日監視',
    'tech_detail_ca_feature2': '保存期間を最大12ヶ月まで延長（リンゴ、梨など）',
    'tech_detail_ca_feature3': '細菌や天然カビの増殖を抑制',
    'tech_detail_ca_feature4': '製品の重量減少率を最小限に抑制',
    'tech_detail_iqf_feature1': '自動コンベアによる連続運転',
    'tech_detail_iqf_feature2': '製品の中心温度-18°Cに急速到達',
    'tech_detail_iqf_feature3': '製品同士が固着せず、元の形状を維持',
    'tech_detail_iqf_feature4': '従来技術比で20%のエネルギー削減',
    'tech_detail_ripening_feature1': '段階に応じた正確なエチレン濃度制御',
    'tech_detail_ripening_feature2': '均一な熱分布を保証する強制換気システム',
    'tech_detail_ripening_feature3': '加熱・冷却プロセスの完全自動化',
    'tech_detail_ripening_feature4': '物流とサプライチェーンの時間を最適化',
    'tech_detail_blast_feature1': '1バッチあたり1トンから50トンの柔軟な容量',
    'tech_detail_blast_feature2': '食品の種類に合わせて最適化された風速',
    'tech_detail_blast_feature3': '高効率2段階圧縮機システム',
    'tech_detail_blast_feature4': '厚さ150-200mmの絶縁PIRパネル構造',
    'quote_now': '技術見積を依頼する',
    'back': '戻る'
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updates = globalBatch[lang] || globalBatch['en'];
    fs.writeFileSync(filePath, JSON.stringify({ ...existing, ...updates }, null, 2));
    console.log(`Updated ${lang}`);
  }
});
