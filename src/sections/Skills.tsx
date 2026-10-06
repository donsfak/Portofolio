import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu } from 'lucide-react';
import { SKILL_CATEGORIES, type SkillAccent } from '../data/portfolio';
import { getSkillIcon } from '../lib/skillIcon';

const ACCENTS: Record<SkillAccent, { glow: string; border: string }> = {
  cyan:   { glow: 'rgba(34,211,238,0.3)',  border: 'border-cyan-400'   },
  purple: { glow: 'rgba(147,51,234,0.3)',  border: 'border-purple-400' },
  pink:   { glow: 'rgba(236,72,153,0.3)',  border: 'border-pink-400'   },
};

interface SkillCardProps {
  title: string; skills: string[]; accent: SkillAccent;
  isHovered: boolean; onHover: (hovered: boolean) => void;
}

function SkillCard({ title, skills, accent, isHovered, onHover }: SkillCardProps) {
  const { glow, border } = ACCENTS[accent];

  return (
    <div
      className={`relative bg-white dark:bg-white/[0.04] rounded-2xl p-6 shadow-sm transition-all duration-300 md:hover:-translate-y-1 ${
        isHovered ? `border-2 ${border}` : 'border border-gray-100 dark:border-white/[0.07] md:hover:border-purple-500/30'
      }`}
      style={isHovered ? { boxShadow: `0 0 28px ${glow}` } : {}}
      onMouseEnter={() => window.matchMedia('(min-width: 768px)').matches && onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold gradient-text">{title}</h3>
        <span className="text-xs text-gray-400 dark:text-gray-600 font-mono bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
          {skills.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/sk">
            <img src={getSkillIcon(skill)} alt={skill} className="w-7 h-7 group-hover/sk:scale-110 transition-transform" />
            <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="skills" className="reveal section-container border-t border-gray-100 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015]">
      <div className="section-title-bar">
        <span className="section-icon bg-pink-500/10"><Cpu className="w-6 h-6 text-pink-500" /></span>
        <h2 className="text-3xl md:text-4xl font-bold">{t('skills.title')}</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_CATEGORIES.map(cat => (
          <SkillCard key={cat.id} title={t(cat.titleKey)} skills={cat.skills} accent={cat.accent}
            isHovered={hovered === cat.id} onHover={h => setHovered(h ? cat.id : null)} />
        ))}
      </div>
    </section>
  );
}
