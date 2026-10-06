import { useTranslation } from 'react-i18next';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-100 dark:border-white/[0.05] py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <p className="text-xl font-black gradient-text tracking-widest mb-1">SFAK</p>
        <p className="text-xs text-gray-400 mb-6">Soro Falibeta</p>
        <div className="flex gap-4 mb-6">
          <SocialLinks linkClassName="p-2 rounded-lg glass hover:bg-purple-500/10 text-gray-400 hover:text-purple-500 transition-all hover:scale-110" />
        </div>
        <p className="text-xs text-gray-500 mb-1 max-w-sm">{t('footer.description')}</p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent my-4" />
        <p className="text-[11px] text-gray-500">© {new Date().getFullYear()} Soro Falibeta — {t('footer.rights')}</p>
        <p className="text-[11px] text-gray-600 mt-1">{t('footer.builtWith')}</p>
      </div>
    </footer>
  );
}
