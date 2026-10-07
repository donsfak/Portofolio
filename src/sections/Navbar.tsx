import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { DigitalClock } from '../components/DigitalClock';
import { NAV_LINKS } from '../data/portfolio';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeSection: string;
  visible: boolean;
}

export function Navbar({ theme, onToggleTheme, activeSection, visible }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const changeLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  const themeLabel = theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode');

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="glass border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <span className="text-xl font-black gradient-text tracking-widest">SFAK</span>

          <div className="flex items-center gap-1.5 md:hidden">
            <button onClick={onToggleTheme} aria-label={themeLabel} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={toggleMenu} aria-label={t('nav.menu')} aria-expanded={isMenuOpen} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link}`} className={`nav-link ${activeSection === link ? 'nav-link-active' : ''}`}>
                {t(`nav.${link}`)}
              </a>
            ))}
            <button onClick={changeLang} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg glass hover:bg-white/10 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              {i18n.language.toUpperCase()}
            </button>
            <button onClick={onToggleTheme} aria-label={themeLabel} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun className="w-[18px] h-[18px] text-yellow-400" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <DigitalClock />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="md:hidden glass border-b border-white/[0.08] px-4 py-3 space-y-0.5">
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link}`} onClick={toggleMenu}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === link ? 'bg-purple-500/15 text-purple-500' : 'hover:bg-white/10'}`}>
              {t(`nav.${link}`)}
            </a>
          ))}
          <button onClick={changeLang} className="flex items-center gap-2 px-3 py-2.5 w-full text-left text-sm rounded-xl hover:bg-white/10 transition-colors">
            <Globe className="w-4 h-4" /> {i18n.language === 'fr' ? 'Français' : 'English'}
          </button>
        </div>
      )}
    </nav>
  );
}
