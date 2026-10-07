import { useTranslation } from 'react-i18next';
import { Award, Briefcase, CheckCircle2, MapPin, User } from 'lucide-react';
import { LOCATION } from '../data/portfolio';

export function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="reveal section-container border-t border-gray-100 dark:border-white/[0.05]">
      <div className="section-title-bar">
        <span className="section-icon bg-purple-500/10"><User className="w-6 h-6 text-purple-500" /></span>
        <h2 className="text-3xl md:text-4xl font-bold">{t('about.title')}</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-[15px]">{t('about.description1')}</p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-[15px]">{t('about.description2')}</p>
          <div className="flex flex-wrap gap-2">
            {['Python','Flutter','React','SQL','Machine Learning','TypeScript'].map(tag => (
              <span key={tag} className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[
            { icon: <Award className="w-5 h-5 text-purple-500" />,   bg: 'bg-purple-500/10', title: t('about.education'),   val: 'Master Mobiquité, Big Data & Systèmes — ESATIC' },
            { icon: <Briefcase className="w-5 h-5 text-pink-500" />, bg: 'bg-pink-500/10',   title: t('about.currentRole'), val: t('about.currentRoleValue') },
            { icon: <MapPin className="w-5 h-5 text-blue-500" />,    bg: 'bg-blue-500/10',   title: t('about.location'),    val: LOCATION },
          ].map(({ icon, bg, title, val }) => (
            <div key={title} className="glass-card flex items-start gap-3">
              <span className={`p-2 rounded-lg ${bg} flex-shrink-0`}>{icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{val}</p>
              </div>
            </div>
          ))}
          <div className="glass-card flex items-center gap-3 border-green-500/25 bg-green-500/[0.04]">
            <span className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-green-500">{t('about.available')}</p>
              <p className="text-xs text-gray-500">{t('about.availableDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
