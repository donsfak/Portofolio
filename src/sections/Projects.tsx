import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, ExternalLink, Github, Layers } from 'lucide-react';
import { ProjectModal } from '../components/ProjectModal';
import { PROJECTS, type Project } from '../data/portfolio';
import { getSkillIcon, NO_ICON_TECHS } from '../lib/skillIcon';
import { useLocalized } from '../lib/useLocalized';

const FILTERS = ['all', 'mobile', 'web', 'dataScience'] as const;
const CATEGORY_LABEL: Record<Project['category'], string> = { mobile: 'Mobile', web: 'Web', dataScience: 'Data' };

export function Projects() {
  const { t } = useTranslation();
  const l = useLocalized();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  const filteredProjects = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <>
      <section id="projects" className="reveal section-container border-t border-gray-100 dark:border-white/[0.05]">
        <div className="section-title-bar">
          <span className="section-icon bg-blue-500/10"><Layers className="w-6 h-6 text-blue-500" /></span>
          <h2 className="text-3xl md:text-4xl font-bold">{t('projects.title')}</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`filter-btn ${activeFilter === f ? 'filter-btn-active' : 'filter-btn-inactive'}`}>
              {t(`projects.filters.${f}`)}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <div key={project.title.fr} className="group relative bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.07] hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(147,51,234,0.15)] md:hover:-translate-y-1.5 flex flex-col">
              {/* Category badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-black/60 text-white backdrop-blur-sm">
                  {CATEGORY_LABEL[project.category]}
                </span>
              </div>
              {/* Image */}
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-black/40 overflow-hidden">
                <img src={project.image} alt={l(project.title)}
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-bold group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{l(project.title)}</h3>
                  <div className="flex gap-1">
                    {project.technologies.filter(tech => !NO_ICON_TECHS.has(tech.toLowerCase())).slice(0,4).map(tech => (
                      <img key={tech} src={getSkillIcon(tech)} alt={tech} className="w-5 h-5" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 mb-4">{l(project.description)}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-2 py-0.5 text-[11px] rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-4 mt-auto">
                  {project.caseStudy && (
                    <a href={project.caseStudy}
                      className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-500 font-semibold transition-colors">
                      <Award className="w-3.5 h-3.5" />{t('projects.caseStudy')}
                    </a>
                  )}
                  {project.demo && project.screenshots && (
                    <button onClick={() => setSelected(project)}
                      className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 font-semibold transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />{t('projects.liveDemo')}
                    </button>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors">
                      <Github className="w-3.5 h-3.5" />GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outside the section: .reveal's transform would trap position:fixed */}
      <ProjectModal isOpen={selected !== null} onClose={closeModal}
        project={selected && { title: l(selected.title), screenshots: selected.screenshots ?? [] }} />
    </>
  );
}
