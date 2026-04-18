import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactTranslations = {
  vi: {
    contact_us_title: "Liên hệ với chúng tôi",
    contact_us_desc: "Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn. Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất có thể.",
    full_name: "Họ và tên",
    full_name_placeholder: "Nguyễn Văn A",
    phone_number: "Số điện thoại",
    subject: "Chủ đề quan tâm",
    select_subject: "-- Chọn chủ đề --",
    subject_general: "Thông tin chung",
    subject_support: "Hỗ trợ kỹ thuật",
    subject_quote: "Yêu cầu báo giá",
    subject_partnership: "Hợp tác kinh doanh",
    subject_other: "Khác",
    message_content: "Nội dung tin nhắn",
    message_placeholder: "Hãy chia sẻ chi tiết về nhu cầu của bạn...",
    send_message_now: "Gửi liên hệ ngay",
    sent_success: "Gửi thành công!",
    sent_success_desc: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!",
    sent_fail: "Gửi thất bại",
    sent_fail_desc: "Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.",
    "Bắt buộc": "Bắt buộc",
    "Invalid email format": "Email không hợp lệ"
  },
  en: {
    contact_us_title: "Contact Us",
    contact_us_desc: "We are always ready to support you. Please leave your information, and we will respond as soon as possible.",
    full_name: "Full Name",
    full_name_placeholder: "John Doe",
    phone_number: "Phone Number",
    subject: "Subject of Interest",
    select_subject: "-- Select Subject --",
    subject_general: "General Information",
    subject_support: "Technical Support",
    subject_quote: "Request a Quote",
    subject_partnership: "Business Partnership",
    subject_other: "Other",
    message_content: "Message Content",
    message_placeholder: "Please share details about your request...",
    send_message_now: "Send Message Now",
    sent_success: "Sent Successfully!",
    sent_success_desc: "Thank you for contacting us. We will get back to you shortly!",
    sent_fail: "Failed to Send",
    sent_fail_desc: "An error occurred. Please try again later or contact our hotline directly.",
    "Bắt buộc": "Required",
    "Invalid email format": "Invalid email format"
  },
  de: {
    contact_us_title: "Kontaktieren Sie uns",
    contact_us_desc: "Wir sind immer für Sie da. Bitte hinterlassen Sie Ihre Daten, und wir werden so schnell wie möglich antworten.",
    full_name: "Vollständiger Name",
    full_name_placeholder: "Max Mustermann",
    phone_number: "Telefonnummer",
    subject: "Betreff",
    select_subject: "-- Betreff auswählen --",
    subject_general: "Allgemeine Informationen",
    subject_support: "Technischer Support",
    subject_quote: "Angebot anfordern",
    subject_partnership: "Geschäftspartnerschaft",
    subject_other: "Sonstiges",
    message_content: "Nachrichteninhalt",
    message_placeholder: "Bitte teilen Sie Details zu Ihrer Anfrage mit...",
    send_message_now: "Nachricht jetzt senden",
    sent_success: "Erfolgreich gesendet!",
    sent_success_desc: "Vielen Dank für Ihre Kontaktaufnahme. Wir werden uns in Kürze bei Ihnen melden!",
    sent_fail: "Senden fehlgeschlagen",
    sent_fail_desc: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie direkt unsere Hotline.",
    "Bắt buộc": "Erforderlich",
    "Invalid email format": "Ungültiges E-Mail-Format"
  },
  fr: {
    contact_us_title: "Contactez-nous",
    contact_us_desc: "Nous sommes toujours prêts à vous aider. Veuillez laisser vos coordonnées et nous vous répondrons dans les plus brefs délais.",
    full_name: "Nom complet",
    full_name_placeholder: "Jean Dupont",
    phone_number: "Numéro de téléphone",
    subject: "Sujet",
    select_subject: "-- Sélectionnez le sujet --",
    subject_general: "Informations générales",
    subject_support: "Support technique",
    subject_quote: "Demander un devis",
    subject_partnership: "Partenariat commercial",
    subject_other: "Autre",
    message_content: "Contenu du message",
    message_placeholder: "Veuillez partager les détails de votre demande...",
    send_message_now: "Envoyer le message",
    sent_success: "Envoyé avec succès !",
    sent_success_desc: "Merci de nous avoir contactés. Nous vous répondrons sous peu !",
    sent_fail: "Échec de l'envoi",
    sent_fail_desc: "Une erreur s'est produite. Veuillez réessayer plus tard ou contacter directement notre hotline.",
    "Bắt buộc": "Requis",
    "Invalid email format": "Format d'email invalide"
  },
  ja: {
    contact_us_title: "お問い合わせ",
    contact_us_desc: "いつでもサポートの準備ができています。情報を残していただければ、できるだけ早く返答いたします。",
    full_name: "氏名",
    full_name_placeholder: "山田 太郎",
    phone_number: "電話番号",
    subject: "ご用件",
    select_subject: "-- 件名を選択 --",
    subject_general: "一般情報",
    subject_support: "テクニカルサポート",
    subject_quote: "お見積もりのご依頼",
    subject_partnership: "ビジネスパートナーシップ",
    subject_other: "その他",
    message_content: "メッセージ内容",
    message_placeholder: "ご要望の詳細をお知らせください...",
    send_message_now: "メッセージを送信する",
    sent_success: "送信成功しました！",
    sent_success_desc: "お問い合わせありがとうございます。すぐにご連絡いたします。",
    sent_fail: "送信に失敗しました",
    sent_fail_desc: "エラーが発生しました。後でもう一度お試しいただくか、直接ホットラインにお問い合わせください。",
    "Bắt buộc": "必須",
    "Invalid email format": "無効なメール形式"
  },
  zh: {
    contact_us_title: "联系我们",
    contact_us_desc: "我们时刻准备为您提供支持。请留下您的信息，我们将尽快回复。",
    full_name: "全名",
    full_name_placeholder: "张三",
    phone_number: "电话号码",
    subject: "感兴趣的主题",
    select_subject: "-- 选择主题 --",
    subject_general: "一般信息",
    subject_support: "技术支持",
    subject_quote: "索取报价",
    subject_partnership: "业务合作伙伴",
    subject_other: "其他",
    message_content: "消息内容",
    message_placeholder: "请分享关于您需求的详细信息...",
    send_message_now: "立即发送消息",
    sent_success: "发送成功！",
    sent_success_desc: "感谢您联系我们。我们会尽快给您回复！",
    sent_fail: "发送失败",
    sent_fail_desc: "发生错误。请稍后再试或直接联系我们的热线。",
    "Bắt buộc": "必填",
    "Invalid email format": "无效的电子邮件格式"
  },
  ko: {
    contact_us_title: "문의하기",
    contact_us_desc: "우리는 항상 여러분을 지원할 준비가 되어 있습니다. 정보를 남겨주시면 가능한 한 빨리 답변을 드리겠습니다.",
    full_name: "성명",
    full_name_placeholder: "홍길동",
    phone_number: "전화번호",
    subject: "관심 주제",
    select_subject: "-- 주제 선택 --",
    subject_general: "일반 정보",
    subject_support: "기술 지원",
    subject_quote: "견적 요청",
    subject_partnership: "비즈니스 파트너십",
    subject_other: "기타",
    message_content: "메시지 내용",
    message_placeholder: "요청에 관한 자세한 내용을 공유해 주세요...",
    send_message_now: "지금 메시지 보내기",
    sent_success: "성공적으로 전송되었습니다!",
    sent_success_desc: "문의해 주셔서 감사합니다. 곧 연락드리겠습니다!",
    sent_fail: "전송 실패",
    sent_fail_desc: "오류가 발생했습니다. 나중에 다시 시도하시거나 핫라인으로 직접 문의해 주세요.",
    "Bắt buộc": "필수",
    "Invalid email format": "잘못된 이메일 형식"
  },
  ru: {
    contact_us_title: "Свяжитесь с нами",
    contact_us_desc: "Мы всегда готовы помочь. Пожалуйста, оставьте свою информацию, и мы ответим как можно скорее.",
    full_name: "Полное имя",
    full_name_placeholder: "Иван Иванов",
    phone_number: "Номер телефона",
    subject: "Тема интереса",
    select_subject: "-- Выберите тему --",
    subject_general: "Общая информация",
    subject_support: "Техническая поддержка",
    subject_quote: "Запросить расценки",
    subject_partnership: "Деловое партнерство",
    subject_other: "Другое",
    message_content: "Текст сообщения",
    message_placeholder: "Пожалуйста, поделитесь подробностями о вашем запросе...",
    send_message_now: "Отправить сообщение сейчас",
    sent_success: "Успешно отправлено!",
    sent_success_desc: "Спасибо за обращение к нам. Мы свяжемся с вами в ближайшее время!",
    sent_fail: "Не удалось отправить",
    sent_fail_desc: "Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь напрямую с нашей горячей линией.",
    "Bắt buộc": "Обязательно",
    "Invalid email format": "Неверный формат электронной почты"
  },
  hr: {
    contact_us_title: "Kontaktirajte nas",
    contact_us_desc: "Uvijek smo spremni pomoći. Molimo ostavite svoje podatke i mi ćemo vam odgovoriti u najkraćem mogućem roku.",
    full_name: "Puno ime i prezime",
    full_name_placeholder: "Ivan Horvat",
    phone_number: "Broj telefona",
    subject: "Tema interesa",
    select_subject: "-- Odaberite temu --",
    subject_general: "Opće informacije",
    subject_support: "Tehnička podrška",
    subject_quote: "Zatražite ponudu",
    subject_partnership: "Poslovno partnerstvo",
    subject_other: "Ostalo",
    message_content: "Sadržaj poruke",
    message_placeholder: "Molimo podijelite detalje o vašem zahtjevu...",
    send_message_now: "Pošalji poruku sada",
    sent_success: "Uspješno poslano!",
    sent_success_desc: "Hvala vam što ste nas kontaktirali. Uskoro ćemo vam se javiti!",
    sent_fail: "Slanje nije uspjelo",
    sent_fail_desc: "Došlo je do pogreške. Pokušajte ponovno kasnije ili direktno kontaktirajte našu otvorenu liniju.",
    "Bắt buộc": "Obavezno",
    "Invalid email format": "Nevažeći format e-pošte"
  },
  sr: {
    contact_us_title: "Kontaktirajte nas",
    contact_us_desc: "Uvek smo spremni da pomognemo. Molimo vas da ostavite svoje podatke, odgovorićemo vam u najkraćem mogućem roku.",
    full_name: "Puno ime",
    full_name_placeholder: "Petar Petrović",
    phone_number: "Broj telefona",
    subject: "Tema interesovanja",
    select_subject: "-- Izaberite temu --",
    subject_general: "Opšte informacije",
    subject_support: "Tehnička podrška",
    subject_quote: "Zatražite ponudu",
    subject_partnership: "Poslovno partnerstvo",
    subject_other: "Ostalo",
    message_content: "Sadržaj poruke",
    message_placeholder: "Molimo podelite detalje o vašem zahtevu...",
    send_message_now: "Pošaljite poruku sada",
    sent_success: "Uspešno poslato!",
    sent_success_desc: "Hvala vam što ste nas kontaktirali. Javićemo vam se uskoro!",
    sent_fail: "Slanje nije uspelo",
    sent_fail_desc: "Došlo je do greške. Pokušajte ponovo kasnije ili direktno kontaktirajte našu otvorenu liniju.",
    "Bắt buộc": "Obavezno",
    "Invalid email format": "Nevažeći format e-pošte"
  },
  sl: {
    contact_us_title: "Kontaktirajte nas",
    contact_us_desc: "Vedno smo vam pripravljeni pomagati. Prosimo, pustite svoje podatke in odgovorili vam bomo v najkrajšem možnem času.",
    full_name: "Polno ime",
    full_name_placeholder: "Janez Novak",
    phone_number: "Telefonska številka",
    subject: "Tema",
    select_subject: "-- Izberite temo --",
    subject_general: "Splošne informacije",
    subject_support: "Tehnična podpora",
    subject_quote: "Zahtevajte ponudbo",
    subject_partnership: "Poslovno partnerstvo",
    subject_other: "Drugo",
    message_content: "Vsebina sporočila",
    message_placeholder: "Prosimo, delite podrobnosti o vaši zahtevi...",
    send_message_now: "Pošljite sporočilo zdaj",
    sent_success: "Uspešno poslano!",
    sent_success_desc: "Hvala za stik z nami. Kmalu se vam bomo oglasili!",
    sent_fail: "Pošiljanje ni uspelo",
    sent_fail_desc: "Prišlo je do napake. Poskusite znova pozneje ali pa se obrnite neposredno na našo telefonsko številko za stik.",
    "Bắt buộc": "Obvezno",
    "Invalid email format": "Neveljaven format e-pošte"
  }
};

const localesDir = path.join(__dirname, 'src', 'locales');

try {
  let globalCount = 0;
  for (const [lang, strings] of Object.entries(contactTranslations)) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(langPath)) {
      let data = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      let changed = false;
      
      for (const [key, value] of Object.entries(strings)) {
        if (!data[key] || data[key] === key) { // also replace if it's identical mapping or undefined
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
