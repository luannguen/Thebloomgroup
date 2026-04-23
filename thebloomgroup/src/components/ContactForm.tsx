import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useContactForm } from "@/hooks/useContactForm";
import { useTranslation } from 'react-i18next';
import { useAntiSpam } from "@/hooks/useAntiSpam";
import { useSettings } from "@/hooks/useSettings";

const ContactForm = () => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    handleChange,
    handleSelectChange,
    submit,
    isSubmitting,
    submitStatus,
  } = useContactForm();

  const { HoneypotField, isBot } = useAntiSpam();

  const { settings } = useSettings();
  const [verified, setVerified] = useState(false);
  const isCaptchaEnabled = settings['enable_captcha'] === 'true';

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBot()) {
      // Fake success for bots
      return;
    }
    if (isCaptchaEnabled && !verified) {
      return;
    }
    submit(e);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('contact_us_title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('contact_us_desc')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-5 p-8 md:p-12">
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-8 flex items-center shadow-sm">
                  <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <div>
                    <h4 className="font-bold text-lg">{t('sent_success')}</h4>
                    <p>{t('sent_success_desc')}</p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-8 flex items-center shadow-sm">
                  <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <h4 className="font-bold text-lg">{t('sent_fail')}</h4>
                    <p>{t('sent_fail_desc')}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Honeypot */}
                <HoneypotField />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className={`block text-sm font-semibold mb-1 transition-colors ${errors.name ? 'text-red-500' : 'text-gray-700'}`}>
                      {t('full_name')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('full_name_placeholder')}
                      className={`h-12 px-4 rounded-lg border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200 ${errors.name ? 'border-red-500 focus:ring-red-200' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className={`block text-sm font-semibold mb-1 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('email_placeholder', { defaultValue: 'email@example.com' })}
                      className={`h-12 px-4 rounded-lg border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200 ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="phone" className={`block text-sm font-semibold mb-1 transition-colors ${errors.phone ? 'text-red-500' : 'text-gray-700'}`}>
                      {t('phone_number')}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                      className={`h-12 px-4 rounded-lg border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200 ${errors.phone ? 'border-red-500 focus:ring-red-200' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className={`block text-sm font-semibold mb-1 transition-colors ${errors.subject ? 'text-red-500' : 'text-gray-700'}`}>
                      {t('subject')}
                    </label>
                    <Select value={formData.subject} onValueChange={handleSelectChange}>
                      <SelectTrigger className={`h-12 px-4 rounded-lg border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200 ${errors.subject ? 'border-red-500 focus:ring-red-200' : ''}`}>
                        <SelectValue placeholder={t('select_subject')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{t('subject_general')}</SelectItem>
                        <SelectItem value="support">{t('subject_support')}</SelectItem>
                        <SelectItem value="quote">{t('subject_quote')}</SelectItem>
                        <SelectItem value="partnership">{t('subject_partnership')}</SelectItem>
                        <SelectItem value="other">{t('subject_other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">{errors.subject}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className={`block text-sm font-semibold mb-1 transition-colors ${errors.message ? 'text-red-500' : 'text-gray-700'}`}>
                    {t('message_content')} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('message_placeholder')}
                    className={`resize-none p-4 rounded-lg border-gray-200 focus:border-primary focus:ring-primary transition-all duration-200 ${errors.message ? 'border-red-500 focus:ring-red-200' : ''}`}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">{errors.message}</p>}
                </div>

                {isCaptchaEnabled && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-inner animate-in fade-in duration-500">
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => setVerified(!verified)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${verified ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}
                      >
                        {verified && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 select-none cursor-pointer" onClick={() => setVerified(!verified)}>
                        Tôi không phải là người máy
                      </span>
                    </div>
                    <div className="flex flex-col items-center opacity-40">
                      <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="h-6 w-6 grayscale" />
                      <span className="text-[8px] font-bold uppercase mt-0.5 tracking-tighter">reCAPTCHA</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 text-center md:text-left">
                  <Button
                    type="submit"
                    disabled={isSubmitting || (isCaptchaEnabled && !verified)}
                    className="w-full md:w-auto px-10 py-4 h-auto text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('sending')}...
                      </>
                    ) : t('send_message_now')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;