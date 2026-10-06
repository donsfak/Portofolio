import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Rocket, TrendingUp } from 'lucide-react';
import { EXPERIENCE_MONTHS, PROJECTS, TECHNOLOGY_COUNT } from '../data/portfolio';

const TARGETS = { experience: EXPERIENCE_MONTHS, projects: PROJECTS.length, technologies: TECHNOLOGY_COUNT };

export function Stats() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ experience: 0, projects: 0, technologies: 0 });

  // Count up once, the first time the row scrolls into view
  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      const steps = 60;
      let step = 0;
      iv = setInterval(() => {
        step++;
        const p = step / steps;
        setStats({ experience: Math.floor(TARGETS.experience * p), projects: Math.floor(TARGETS.projects * p), technologies: Math.floor(TARGETS.technologies * p) });
        if (step >= steps) { clearInterval(iv); setStats(TARGETS); }
      }, 2000 / steps);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); clearInterval(iv); };
  }, []);

  return (
    <section ref={ref} className="reveal max-w-4xl mx-auto px-4 pb-16 md:pb-24">
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />, val: `${stats.experience}`,     label: t('stats.experience')   },
          { icon: <Rocket     className="w-6 h-6 text-pink-500   mx-auto mb-2" />, val: `${stats.projects}`,       label: t('stats.projects')     },
          { icon: <Code       className="w-6 h-6 text-blue-500   mx-auto mb-2" />, val: `${stats.technologies}+`,  label: t('stats.technologies') },
        ].map(({ icon, val, label }) => (
          <div key={label} className="stat-card py-6 group">
            {icon}
            <div className="stat-number group-hover:scale-110 transition-transform duration-300">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
