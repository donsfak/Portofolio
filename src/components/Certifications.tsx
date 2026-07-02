import { useTranslation } from 'react-i18next';
import { Award, Calendar, Clock, ExternalLink, Download } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  instructor: string;
  date: string;
  hours: number;
  file: string;
  verifyUrl?: string;
  tags: string[];
  accent: 'purple' | 'cyan';
}

// To add a certificate: drop the PDF in public/assets/certifications/ and add an entry here.
const CERTIFICATIONS: Certification[] = [
  {
    title: 'Microsoft Power BI Masterclass',
    issuer: 'Udemy',
    instructor: 'Prince Patni',
    date: '2024-05-31',
    hours: 4.5,
    file: '/assets/certifications/powerbi-masterclass.pdf',
    verifyUrl: 'https://ude.my/UC-5a81dd36-de53-423c-8732-5fc4a54e6b43',
    tags: ['Power BI', 'Data Visualization', 'DAX'],
    accent: 'purple',
  },
  {
    title: 'Analyse de données avec Pandas et Python',
    issuer: 'Udemy',
    instructor: 'Ing.Seif | Europe Innovation',
    date: '2024-05-21',
    hours: 5,
    file: '/assets/certifications/pandas-python-data-analysis.pdf',
    verifyUrl: 'https://ude.my/UC-a0c757a0-e0d8-442d-b464-686241a56f6c',
    tags: ['Python', 'Pandas', 'Data Analysis'],
    accent: 'cyan',
  },
];

export function Certifications() {
  const { t, i18n } = useTranslation();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  return (
    <section id="certifications" className="section-container border-t border-gray-100 dark:border-white/[0.05]">
      <div className="section-title-bar">
        <span className="section-icon bg-yellow-500/10"><Award className="w-6 h-6 text-yellow-500" /></span>
        <h2 className="text-3xl md:text-4xl font-bold">{t('certifications.title')}</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {CERTIFICATIONS.map(cert => {
          const accentText   = cert.accent === 'purple' ? 'text-purple-500' : 'text-cyan-500';
          const accentBg     = cert.accent === 'purple' ? 'bg-purple-500/10' : 'bg-cyan-500/10';
          const accentBorder = cert.accent === 'purple' ? 'hover:border-purple-500/30' : 'hover:border-cyan-500/30';
          return (
            <div key={cert.file}
              className={`glass rounded-2xl p-5 transition-all duration-300 md:hover:-translate-y-1 ${accentBorder} flex flex-col`}>
              <div className="flex items-start gap-3 mb-3">
                <span className={`p-2.5 rounded-xl ${accentBg} flex-shrink-0`}>
                  <Award className={`w-6 h-6 ${accentText}`} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug">{cert.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{cert.issuer} · {cert.instructor}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{formatDate(cert.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />{cert.hours} {t('certifications.hours')}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {cert.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-[11px] rounded-md bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-auto pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                <a href={cert.file} target="_blank" rel="noreferrer"
                  className={`flex items-center gap-1.5 text-xs font-semibold ${accentText} hover:opacity-80 transition-opacity`}>
                  <ExternalLink className="w-3.5 h-3.5" />{t('certifications.view')}
                </a>
                <a href={cert.file} download
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                  <Download className="w-3.5 h-3.5" />{t('certifications.download')}
                </a>
                {cert.verifyUrl && (
                  <a href={cert.verifyUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors ml-auto">
                    {t('certifications.verify')}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
