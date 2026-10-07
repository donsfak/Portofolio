import { useTranslation } from 'react-i18next';
import { BarChart3, Cpu, Database, Globe, Rocket, Smartphone, TrendingUp } from 'lucide-react';

const SERVICES = [
  { key: 'dataAnalysis', Icon: BarChart3,  color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'ml',           Icon: Cpu,        color: 'text-pink-500',   bg: 'bg-pink-500/10'   },
  { key: 'web',          Icon: Globe,      color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
  { key: 'mobile',       Icon: Smartphone, color: 'text-cyan-500',   bg: 'bg-cyan-500/10'   },
  { key: 'db',           Icon: Database,   color: 'text-green-500',  bg: 'bg-green-500/10'  },
  { key: 'bi',           Icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="reveal section-container border-t border-gray-100 dark:border-white/[0.05]">
      <div className="section-title-bar">
        <span className="section-icon bg-purple-500/10"><Rocket className="w-6 h-6 text-purple-500" /></span>
        <h2 className="text-3xl md:text-4xl font-bold">{t('services.title')}</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map(({ key, Icon, color, bg }) => (
          <div key={key} className="service-card group p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/[0.07] to-transparent rounded-bl-3xl" />
            <span className={`service-icon inline-flex p-2.5 rounded-xl ${bg} ${color}`}><Icon className="w-9 h-9" /></span>
            <h3 className="text-sm font-bold mb-2 mt-3">{t(`services.${key}.title`)}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t(`services.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
