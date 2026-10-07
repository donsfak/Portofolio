import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { AlertCircle, CheckCircle2, Github, Linkedin, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, LOCATION, PHONE } from '../data/portfolio';

// ─── EmailJS config ────────────────────────────────────────────────────────────
// Create a free account at emailjs.com, then set these in a .env file.
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';
const EMAILJS_READY = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

export function Contact() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Honeypot: hidden field that only bots fill in
    if ((fd.get('company') as string)?.length) {
      setFormState('success');
      return;
    }

    // If EmailJS is not configured, fall back to mailto
    if (!EMAILJS_READY) {
      const subject = encodeURIComponent(`[Portfolio] ${fd.get('subject') || 'Message'}`);
      const body = encodeURIComponent(
        `From: ${fd.get('from_name')} <${fd.get('from_email')}>\n\n${fd.get('message')}`
      );
      window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
      setFormState('success');
      return;
    }

    setFormState('sending');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current!, EMAILJS_PUBLIC_KEY);
      setFormState('success');
      formRef.current?.reset();
    } catch {
      setFormState('error');
    }
  };

  return (
    <section id="contact" className="reveal section-container border-t border-gray-100 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015]">
      <div className="section-title-bar">
        <span className="section-icon bg-purple-500/10"><Send className="w-6 h-6 text-purple-500" /></span>
        <h2 className="text-3xl md:text-4xl font-bold">{t('contact.title')}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('contact.subtitle')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{t('contact.description')}</p>
          <div className="space-y-2.5 mb-6">
            {[
              { icon: <Mail className="w-4 h-4 text-purple-500" />,   label: EMAIL,    href: `mailto:${EMAIL}` },
              { icon: <Phone className="w-4 h-4 text-purple-500" />,  label: PHONE,    href: `tel:${PHONE.replace(/\s+/g, '')}` },
              { icon: <MapPin className="w-4 h-4 text-purple-500" />, label: LOCATION },
            ].map(({ icon, label, href }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl glass hover:border-purple-500/25 transition-all">
                <span className="p-2 rounded-lg bg-purple-500/10">{icon}</span>
                {href
                  ? <a href={href} className="text-sm font-medium hover:text-purple-600 transition-colors">{label}</a>
                  : <span className="text-sm font-medium">{label}</span>
                }
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { href: GITHUB_URL,   icon: <Github className="w-4 h-4" />,   label: 'GitHub'   },
              { href: LINKEDIN_URL, icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
            ].map(({ href, icon, label }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass hover:bg-purple-500/10 hover:border-purple-500/25 text-sm font-medium transition-all">
                {icon}{label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        {formState === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 p-10 glass rounded-2xl min-h-[320px]">
            <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-400" />
            </div>
            <h4 className="text-lg font-bold text-green-400">{t('contact.successTitle')}</h4>
            <p className="text-sm text-gray-500">{t('contact.successDesc')}</p>
            <button onClick={() => setFormState('idle')} className="btn-secondary text-xs px-5 py-2">
              {t('contact.sendAnother')}
            </button>
          </div>
        ) : (
          <form ref={formRef} className="space-y-4" onSubmit={handleFormSubmit}>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
              className="absolute opacity-0 -z-10 h-0 w-0 pointer-events-none" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="cf-name" className="form-label">{t('contact.form.name')}</label>
                <input type="text" id="cf-name" name="from_name" className="form-input" placeholder="John Doe" maxLength={100} required />
              </div>
              <div>
                <label htmlFor="cf-email" className="form-label">{t('contact.form.email')}</label>
                <input type="email" id="cf-email" name="from_email" className="form-input" placeholder="john@email.com" maxLength={150} required />
              </div>
            </div>
            <div>
              <label htmlFor="cf-subject" className="form-label">{t('contact.form.subject')}</label>
              <input type="text" id="cf-subject" name="subject" className="form-input" placeholder={t('contact.form.subjectPlaceholder')} maxLength={150} required />
            </div>
            <div>
              <label htmlFor="cf-message" className="form-label">{t('contact.form.message')}</label>
              <textarea id="cf-message" name="message" className="form-textarea" rows={5} placeholder={t('contact.form.messagePlaceholder')} maxLength={3000} required />
            </div>
            {formState === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{t('contact.errorDesc')}
              </div>
            )}
            <button type="submit" disabled={formState === 'sending'} className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed">
              {formState === 'sending'
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('contact.form.sending')}</>
                : <><Send className="w-4 h-4 mr-2" />{t('contact.form.send')}</>
              }
            </button>
            <p className="text-[11px] text-center text-gray-400">
              {!EMAILJS_READY && t('contact.mailtoNote')}
              {t('contact.privacy')}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
