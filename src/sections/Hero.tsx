import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, MessageSquare } from 'lucide-react';
import { ROLES } from '../data/portfolio';
import { useLocalized } from '../lib/useLocalized';
import { SocialLinks } from './SocialLinks';

export function Hero() {
  const { t } = useTranslation();
  const l = useLocalized();
  const [roleIndex,  setRoleIndex]  = useState(0);
  const [roleFading, setRoleFading] = useState(false);

  // Rotating role
  useEffect(() => {
    let fade: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      setRoleFading(true);
      fade = setTimeout(() => { setRoleIndex((p) => (p + 1) % ROLES.length); setRoleFading(false); }, 350);
    }, 3200);
    return () => { clearInterval(iv); clearTimeout(fade); };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-24 pb-12">
      {/* Radial hero glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-purple-600/[0.07] blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-7">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full blur-md opacity-60 group-hover:opacity-90 animate-spin-slow"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899,#3b82f6)' }} />
            <div className="relative rounded-full p-[3px] bg-gray-50 dark:bg-[#080810]">
              <img src="/assets/photo identite.jpg" alt="Soro Falibeta"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
            </div>
            {/* Availability badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-lg text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-700 dark:text-gray-300">{t('hero.available')}</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-3 animate-slide-up tracking-tight" style={{ animationDelay: '0.15s' }}>
          Soro <span className="gradient-text">Falibeta</span>
        </h1>

        {/* Rotating role */}
        <div className="h-10 flex items-center justify-center mb-4 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className={`text-lg sm:text-2xl font-semibold text-gray-500 dark:text-gray-400 transition-all duration-300 ${roleFading ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'}`}>
            {l(ROLES[roleIndex])}
          </p>
        </div>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-9 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.45s' }}>
          {t('hero.tagline')}
        </p>

        {/* Socials */}
        <div className="flex gap-3 justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.55s' }}>
          <SocialLinks linkClassName="p-2.5 rounded-xl glass hover:bg-purple-500/15 hover:border-purple-500/30 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all hover:scale-110" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <a href="/assets/CV_Falibeta_Soro.pdf" download="CV_Falibeta_Soro.pdf" className="btn-primary">
            <Download className="w-4 h-4 mr-2" />{t('hero.downloadCv')}
          </a>
          <a href="#contact" className="btn-secondary">
            <MessageSquare className="w-4 h-4 mr-2" />{t('hero.getInTouch')}
          </a>
        </div>
      </div>
    </section>
  );
}
