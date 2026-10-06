import { useTranslation } from 'react-i18next';
import { Award, Briefcase, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES, type Accent } from '../data/portfolio';
import { useLocalized } from '../lib/useLocalized';

// Full class names (not built dynamically) so Tailwind keeps them in the build
const ACCENT_STYLES: Record<Accent, { dot: string; badge: string; check: string; hover: string; title: string }> = {
  orange: { dot: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]', badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20', check: 'text-orange-500', hover: 'hover:border-orange-500/25', title: 'gradient-text' },
  purple: { dot: 'bg-purple-500 glow-border',                            badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20', check: 'text-purple-500', hover: 'hover:border-purple-500/25', title: 'gradient-text' },
  pink:   { dot: 'bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)]',   badge: 'bg-pink-500/10 text-pink-500 border-pink-500/20',       check: 'text-pink-500',   hover: 'hover:border-pink-500/25',   title: 'gradient-text-blue' },
};

export function Experience() {
  const { t } = useTranslation();
  const l = useLocalized();

  return (
    <section id="experience" className="reveal section-container border-t border-gray-100 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015]">
      <div className="section-title-bar">
        <span className="section-icon bg-pink-500/10"><Briefcase className="w-6 h-6 text-pink-500" /></span>
        <h2 className="text-3xl md:text-4xl font-bold">{t('experience.title')}</h2>
      </div>

      <div className="relative max-w-3xl">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-transparent" />

        {EXPERIENCES.map((exp, i) => {
          const a = ACCENT_STYLES[exp.accent];
          const Icon = exp.kind === 'work' ? Briefcase : Award;
          return (
            <div key={exp.role.fr} className={`relative pl-10 ${i < EXPERIENCES.length - 1 ? 'mb-10' : ''}`}>
              <div className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-white dark:border-[#080810] ${a.dot}`} />
              <div className={`glass rounded-2xl p-5 transition-all ${a.hover}`}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className={`text-base font-bold ${a.title}`}>{l(exp.role)}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5"><Icon className="w-3 h-3" />{exp.organization}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${a.badge}`}>
                    {l(exp.period)}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {exp.bullets.map(item => (
                    <li key={item.fr} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${a.check}`} />{l(item)}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[11px] rounded-md bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
