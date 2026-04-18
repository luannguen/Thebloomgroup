import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allTranslations = {
  "de": {
    "Về VVC": "Über VietVinhCorp",
    "Giới thiệu chung": "Allgemeine Einführung",
    "Hồ sơ năng lực": "Fähigkeitsprofil",
    "Tuyển dụng": "Karriere",
    "Dịch vụ & Hỗ trợ": "Dienste & Support",
    "Tư vấn kỹ thuật": "Technische Beratung",
    "Bảo trì & Sửa chữa": "Wartung & Reparatur",
    "Liên hệ báo giá": "Angebot anfordern",
    "Chính sách": "Richtlinien",
    "Chính sách bảo mật": "Datenschutzerklärung",
    "Điều khoản sử dụng": "Nutzungsbedingungen",
    "Chính sách Cookie": "Cookie-Richtlinie",
    "Sơ đồ trang": "Sitemap",
    "Trụ sở chính (HCM)": "Hauptsitz (HCMC)",
    "Văn phòng Thủ Đức": "Büro Thu Duc",
    "Văn phòng Hà Nội": "Büro Hanoi",
    "Trung tâm CSKH": "Kundendienstzentrum",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "14. Stock, HM Town Building, Nguyen Thi Minh Khai 412, Bezirk 3, HCMC",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "59 Bis, Straße Nr. 2, Bezirk Truong Tho, Thu Duc, HCMC",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "BT1 Pham Van Dong Straße, Bac Tu Liem Bezirk, Hanoi",
    "Hỗ trợ toàn quốc 24/7": "Bundesweiter Support 24/7",
    
    // Add missing capabilities translation map
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp Fähigkeitsprofil",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "Detailliertes Dokument über die Konstruktions-, Bau- und Betriebsfähigkeiten der internationalen Standard-Industriekältesysteme von VietVinhCorp."
  },
  "fr": {
    "Về VVC": "À propos de VietVinhCorp",
    "Giới thiệu chung": "Introduction générale",
    "Hồ sơ năng lực": "Profil de Capacité",
    "Tuyển dụng": "Recrutement",
    "Dịch vụ & Hỗ trợ": "Services et Support",
    "Tư vấn kỹ thuật": "Consulting technique",
    "Bảo trì & Sửa chữa": "Maintenance et Réparation",
    "Liên hệ báo giá": "Demander un devis",
    "Chính sách": "Politiques",
    "Chính sách bảo mật": "Politique de confidentialité",
    "Điều khoản sử dụng": "Conditions d'utilisation",
    "Chính sách Cookie": "Politique des cookies",
    "Sơ đồ trang": "Plan du site",
    "Trụ sở chính (HCM)": "Siège social (HCMC)",
    "Văn phòng Thủ Đức": "Bureau Thu Duc",
    "Văn phòng Hà Nội": "Bureau Hanoi",
    "Trung tâm CSKH": "Centre de service client",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "14e étage, HM Town, 412 rue Nguyen Thi Minh Khai, District 3, HCMC",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "59 Bis, Rue n° 2, Quartier Truong Tho, Thu Duc, HCMC",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "BT1 rue Pham Van Dong, District Bac Tu Liem, Hanoi",
    "Hỗ trợ toàn quốc 24/7": "Assistance nationale 24/7",
    
    "Hồ sơ năng lực Viet Vinh Corp": "Profil de Capacité VietVinhCorp",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "Document détaillé sur les capacités de conception, de construction et d'exploitation des systèmes de réfrigération industrielle aux normes internationales de VietVinhCorp."
  },
  "ja": {
    "Về VVC": "VietVinhCorpについて",
    "Giới thiệu chung": "一般的なご紹介",
    "Hồ sơ năng lực": "企業能力プロファイル",
    "Tuyển dụng": "採用情報",
    "Dịch vụ & Hỗ trợ": "サービスとサポート",
    "Tư vấn kỹ thuật": "技術コンサルティング",
    "Bảo trì & Sửa chữa": "保守と修理",
    "Liên hệ báo giá": "見積もり依頼",
    "Chính sách": "ポリシー",
    "Chính sách bảo mật": "プライバシーポリシー",
    "Điều khoản sử dụng": "利用規約",
    "Chính sách Cookie": "クッキーポリシー",
    "Sơ đồ trang": "サイトマップ",
    "Trụ sở chính (HCM)": "本社 (HCMC)",
    "Văn phòng Thủ Đức": "トゥドゥックオフィス",
    "Văn phòng Hà Nội": "ハノイオフィス",
    "Trung tâm CSKH": "カスタマーケアセンター",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "ホーチミン市3区グエンティミンカイ通り412番 HMタワー14階",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "ホーチミン市トゥドゥック市チュントォ区第2通り59ビス",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "ハノイ市バックトゥリエム区ファムヴァンドン通りBT1",
    "Hỗ trợ toàn quốc 24/7": "24時間年中無休の全国サポート",
    
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp 企業能力プロファイル",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "VietVinhCorpの国際標準の産業用冷凍システムの設計、構築、運用能力に関する詳細ドキュメント。"
  },
  "zh": {
    "Về VVC": "关于 VietVinhCorp",
    "Giới thiệu chung": "总体介绍",
    "Hồ sơ năng lực": "能力资质",
    "Tuyển dụng": "诚聘英才",
    "Dịch vụ & Hỗ trợ": "服务与支持",
    "Tư vấn kỹ thuật": "技术咨询",
    "Bảo trì & Sửa chữa": "保养与维修",
    "Liên hệ báo giá": "联系报价",
    "Chính sách": "政策",
    "Chính sách bảo mật": "隐私政策",
    "Điều khoản sử dụng": "使用条款",
    "Chính sách Cookie": "Cookie 政策",
    "Sơ đồ trang": "网站地图",
    "Trụ sở chính (HCM)": "总部 (HCMC)",
    "Văn phòng Thủ Đức": "守德办事处",
    "Văn phòng Hà Nội": "河内办事处",
    "Trung tâm CSKH": "客户服务中心",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "胡志明市第三郡阮氏明开街412号HM Town大厦14层",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "胡志明市守德市长寿坊第2街59号Bis",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "河内市北慈廉郡范文同街BT1",
    "Hỗ trợ toàn quốc 24/7": "全天候全国支持",
    
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp 能力资质",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "关于 VietVinhCorp 国际标准工业制冷系统的设计、建设和运营能力的详细文件。"
  },
  "ko": {
    "Về VVC": "VietVinhCorp 소개",
    "Giới thiệu chung": "일반 소개",
    "Hồ sơ năng lực": "기업 역량 프로필",
    "Tuyển dụng": "채용 정보",
    "Dịch vụ & Hỗ trợ": "서비스 및 지원",
    "Tư vấn kỹ thuật": "기술 컨설팅",
    "Bảo trì & Sửa chữa": "유지 보수 및 수리",
    "Liên hệ báo giá": "견적 문의",
    "Chính sách": "정책",
    "Chính sách bảo mật": "개인정보 처리방침",
    "Điều khoản sử dụng": "이용약관",
    "Chính sách Cookie": "쿠키 정책",
    "Sơ đồ trang": "사이트 맵",
    "Trụ sở chính (HCM)": "본사 (HCMC)",
    "Văn phòng Thủ Đức": "투득 지사",
    "Văn phòng Hà Nội": "하노이 지사",
    "Trung tâm CSKH": "고객 지원 센터",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "호치민시 3군 응우옌티민카이 412번지 HM 타운 빌딩 14층",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "호치민시 투득시 쯔엉토동 2번가 59 Bis",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "하노이 박뜨리엠군 팜반동 거리 BT1",
    "Hỗ trợ toàn quốc 24/7": "연중무휴 전국 지원",
    
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp 기업 역량 프로필",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "VietVinhCorp의 국제 표준 산업용 냉동 시스템의 설계, 시공 및 운영 역량에 대한 상세 문서."
  },
  "ru": {
    "Về VVC": "О VietVinhCorp",
    "Giới thiệu chung": "Общее введение",
    "Hồ sơ năng lực": "Профиль возможностей",
    "Tuyển dụng": "Карьера",
    "Dịch vụ & Hỗ trợ": "Услуги и поддержка",
    "Tư vấn kỹ thuật": "Технический консалтинг",
    "Bảo trì & Sửa chữa": "Техобслуживание и ремонт",
    "Liên hệ báo giá": "Запрос цены",
    "Chính sách": "Политика",
    "Chính sách bảo mật": "Политика конфиденциальности",
    "Điều khoản sử dụng": "Условия использования",
    "Chính sách Cookie": "Политика файлов cookie",
    "Sơ đồ trang": "Карта сайта",
    "Trụ sở chính (HCM)": "Главный офис (HCMC)",
    "Văn phòng Thủ Đức": "Офис в Ту Дык",
    "Văn phòng Hà Nội": "Офис в Ханое",
    "Trung tâm CSKH": "Центр обслуживания клиентов",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "14-й этаж, здание HM Town, 412 Nguyen Thi Minh Khai, район 3, HCMC",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "59 Bis, улица 2, район Truong Tho, город Thu Duc, HCMC",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "BT1 Pham Van Dong, район Bac Tu Liem, Ханой",
    "Hỗ trợ toàn quốc 24/7": "Круглосуточная поддержка 24/7",
    
    "Hồ sơ năng lực Viet Vinh Corp": "Профиль возможностей VietVinhCorp",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "Подробный документ о возможностях проектирования, строительства и эксплуатации промышленных холодильных систем VietVinhCorp по международным стандартам."
  },
  "hr": {
    "Về VVC": "O VietVinhCorp",
    "Giới thiệu chung": "Opći uvod",
    "Hồ sơ năng lực": "Profil sposobnosti",
    "Tuyển dụng": "Zapošljavanje",
    "Dịch vụ & Hỗ trợ": "Usluge i podrška",
    "Tư vấn kỹ thuật": "Tehničko savjetovanje",
    "Bảo trì & Sửa chữa": "Održavanje i popravak",
    "Liên hệ báo giá": "Zatražite ponudu",
    "Chính sách": "Pravila",
    "Chính sách bảo mật": "Pravila privatnosti",
    "Điều khoản sử dụng": "Uvjeti korištenja",
    "Chính sách Cookie": "Pravila o kolačićima",
    "Sơ đồ trang": "Karta web-lokacije",
    "Trụ sở chính (HCM)": "Sjedište (HCMC)",
    "Văn phòng Thủ Đức": "Ured Thu Duc",
    "Văn phòng Hà Nội": "Ured Hanoj",
    "Trung tâm CSKH": "Centar za korisničku podršku",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "14. kat, zgrada HM Town, ulica Nguyen Thi Minh Khai 412, Distrikt 3, HCMC",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "59 Bis, cesta 2, Truong Tho, grad Thu Duc, HCMC",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "BT1 Pham Van Dong, Distrikt Bac Tu Liem, Hanoj",
    "Hỗ trợ toàn quốc 24/7": "Nacionalna podrška 24/7",
    
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp Profil Sposobnosti",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "Detaljan dokument o sposobnostima projektiranja, izgradnje i upravljanja industrijskim rashladnim sustavima međunarodnih standarda tvrtke VietVinhCorp."
  },
  "sr": {
    "Về VVC": "O VietVinhCorp",
    "Giới thiệu chung": "Opšti uvod",
    "Hồ sơ năng lực": "Profil sposobnosti",
    "Tuyển dụng": "Zapošljavanje",
    "Dịch vụ & Hỗ trợ": "Usluge i podrška",
    "Tư vấn kỹ thuật": "Tehničko savetovanje",
    "Bảo trì & Sửa chữa": "Održavanje i popravka",
    "Liên hệ báo giá": "Zatražite ponudu",
    "Chính sách": "Pravila",
    "Chính sách bảo mật": "Politika privatnosti",
    "Điều khoản sử dụng": "Uslovi korišćenja",
    "Chính sách Cookie": "Politika o kolačićima",
    "Sơ đồ trang": "Mapa sajta",
    "Trụ sở chính (HCM)": "Sedište (HCMC)",
    "Văn phòng Thủ Đức": "Kancelarija Thu Duc",
    "Văn phòng Hà Nội": "Kancelarija Hanoj",
    "Trung tâm CSKH": "Centar za brigu o korisnicima",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "14. sprat, zgrada HM Town, ulica Nguien Tih Mihn Kai 412, Okrug 3, HCMC",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "59 Bis, Put br. 2, Truong Tho okrug, grad Thu Duc, HCMC",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "BT1 Ulica Pham Van Dong, Okrug Bac Tu Liem, Hanoj",
    "Hỗ trợ toàn quốc 24/7": "Nacionalna podrška 24/7",
    
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp Profil Sposobnosti",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "Detaljan dokument o sposobnostima projektovanja, izgradnje i upravljanja industrijskim rashladnim sistemima međunarodnih standarda kompanije VietVinhCorp."
  },
  "sl": {
    "Về VVC": "O VietVinhCorp",
    "Giới thiệu chung": "Splošen uvod",
    "Hồ sơ năng lực": "Profil zmogljivosti",
    "Tuyển dụng": "Zaposlovanje",
    "Dịch vụ & Hỗ trợ": "Storitve in podpora",
    "Tư vấn kỹ thuật": "Tehnično svetovanje",
    "Bảo trì & Sửa chữa": "Vzdrževanje in popravila",
    "Liên hệ báo giá": "Zahtevajte ponudbo",
    "Chính sách": "Politika",
    "Chính sách bảo mật": "Politika zasebnosti",
    "Điều khoản sử dụng": "Pogoji uporabe",
    "Chính sách Cookie": "Politika piškotkov",
    "Sơ đồ trang": "Zemljevid spletnega mesta",
    "Trụ sở chính (HCM)": "Sedež (HCMC)",
    "Văn phòng Thủ Đức": "Pisarna Thu Duc",
    "Văn phòng Hà Nội": "Pisarna Hanoj",
    "Trung tâm CSKH": "Center za podporo strankam",
    "Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM": "14. nadstropje, stavba HM Town, ulica Nguyen Thi Minh Khai 412, okrožje 3, HCMC",
    "59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM": "59 Bis, cesta 2, okrožje Truong Tho, mesto Thu Duc, HCMC",
    "BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội": "BT1 Ulica Pham Van Dong, Okrožje Bac Tu Liem, Hanoj",
    "Hỗ trợ toàn quốc 24/7": "Nacionalna podpora 24/7",
    
    "Hồ sơ năng lực Viet Vinh Corp": "VietVinhCorp Profil Zmogljivosti",
    "Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VietVinhCorp.": "Podroben dokument o zmogljivostih načrtovanja, gradnje in upravljanja mednarodno standardiziranih industrijskih hladilnih sistemov podjetja VietVinhCorp."
  }
};

const localesDir = path.join(__dirname, 'src', 'locales');

try {
  let globalCount = 0;
  for (const [lang, strings] of Object.entries(allTranslations)) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(langPath)) {
      let data = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      let changed = false;
      
      for (const [key, value] of Object.entries(strings)) {
        if (!data[key]) {
          data[key] = value;
          changed = true;
          globalCount++;
        }
      }

      if (changed) {
        const sortedData = {};
        Object.keys(data).sort((a,b) => a.localeCompare(b)).forEach(k => {
          sortedData[k] = data[k];
        });
        fs.writeFileSync(langPath, JSON.stringify(sortedData, null, 2), 'utf8');
        console.log(`Successfully updated ${lang}`);
      }
    }
  }
} catch (e) {
  console.error("Error updating languages:", e);
}
