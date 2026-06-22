import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Github, Linkedin, Mail, Download, ExternalLink, Code, Briefcase, User, Cpu,
  Moon, Sun, Menu, X, TrendingUp, Award, Rocket, Database, BarChart3, Smartphone,
  Globe, MapPin, MessageSquare, Send, Phone, ChevronUp, CheckCircle2, Layers
} from 'lucide-react';
import { ProjectModal } from './components/ProjectModal';
import { GithubStats } from './components/GithubStats';
import { DigitalClock } from './components/DigitalClock';

// ─── SkillCard ────────────────────────────────────────────────────────────────
interface SkillCardProps {
  id: string;
  title: string;
  skills: string[];
  hoveredSkillCard: string | null;
  onHover: (id: string | null) => void;
  getIcon: (name: string) => string;
  accentColor?: string;
}

function SkillCard({ id, title, skills, hoveredSkillCard, onHover, getIcon, accentColor = 'cyan' }: SkillCardProps) {
  const isHovered = hoveredSkillCard === id;
  const glowColor = accentColor === 'purple' ? 'rgba(147,51,234,0.35)' : accentColor === 'pink' ? 'rgba(236,72,153,0.35)' : 'rgba(34,211,238,0.35)';
  const borderActive = accentColor === 'purple' ? 'border-purple-400' : accentColor === 'pink' ? 'border-pink-400' : 'border-cyan-400';

  return (
    <div
      className={`relative bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm transition-all duration-300 md:hover:-translate-y-1 ${
        isHovered ? `border-2 ${borderActive}` : 'border border-gray-100 dark:border-white/10 md:hover:border-purple-500/30'
      }`}
      style={isHovered ? { boxShadow: `0 0 24px ${glowColor}` } : {}}
      onMouseEnter={() => window.matchMedia('(min-width: 768px)').matches && onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <h3 className="text-xl font-bold mb-6 text-center gradient-text">{title}</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/skill">
            <img src={getIcon(skill)} alt={skill} className="w-8 h-8 group-hover/skill:scale-110 transition-transform" />
            <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{skill}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-4 right-4 text-xs text-gray-400 dark:text-gray-600 font-mono">
        {skills.length} tools
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const ROLES = ['Data Scientist Junior', 'Full Stack Developer', 'Mobile Developer'];

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredSkillCard, setHoveredSkillCard] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ title: string; screenshots: string[] } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ experience: 0, projects: 0, technologies: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleFading, setRoleFading] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  // Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setNavVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setShowScrollTop(currentScrollPos > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Active section detection
  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'skills', 'services', 'contact'];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Rotating role text
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleFading(true);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setRoleFading(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const targets = { experience: 6, projects: 3, technologies: 20 };
          const steps = 60;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            const p = step / steps;
            setStats({
              experience: Math.floor(targets.experience * p),
              projects: Math.floor(targets.projects * p),
              technologies: Math.floor(targets.technologies * p),
            });
            if (step >= steps) { clearInterval(interval); setStats(targets); }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const changeLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const getSkillIcon = (skillName: string) => {
    const normalized = skillName.toLowerCase().replace(/\s+/g, '');
    if (normalized === 'rive') return '/assets/rive.png';
    if (normalized === 'tableau') return '/assets/tableau.png';
    return `https://skillicons.dev/icons?i=${normalized}`;
  };

  const skillCategories = [
    { id: 'frontend',    titleKey: 'skills.frontend',    accent: 'cyan',   skills: ['react', 'typescript', 'tailwind', 'vite', 'html', 'css'] },
    { id: 'backend',     titleKey: 'skills.backend',     accent: 'purple', skills: ['python', 'firebase', 'supabase', 'mysql', 'postgresql', 'sqlite'] },
    { id: 'mobile',      titleKey: 'skills.mobile',      accent: 'pink',   skills: ['flutter'] },
    { id: 'dataScience', titleKey: 'skills.dataScience', accent: 'cyan',   skills: ['python', 'r', 'tableau'] },
    { id: 'devops',      titleKey: 'skills.devops',      accent: 'purple', skills: ['git', 'docker', 'kubernetes', 'linux', 'vercel'] },
    { id: 'design',      titleKey: 'skills.design',      accent: 'pink',   skills: ['figma', 'rive', 'ai'] },
  ];

  const projects = [
    {
      title: 'Weather Insights',
      description: 'Comprehensive Flutter weather application with real-time forecasts, weather alerts, air quality index, UV index, minute-by-minute precipitation, and smart clothing recommendations. Features beautiful UI with dark mode support.',
      image: 'assets/weather.webp',
      screenshots: ['assets/weather.webp'],
      technologies: ['Flutter', 'Firebase', 'API', 'ML'],
      category: 'mobile',
      github: 'https://github.com/donsfak/weather_insights',
      demo: 'details',
    },
    {
      title: 'To Do App',
      description: 'Feature-rich task management application built with Flutter. Implements local data persistence with SQLite, state management with Riverpod, and a clean, intuitive user interface for efficient task tracking.',
      image: 'assets/trackers_1.png',
      screenshots: ['assets/trackers_1.png', 'assets/trackers_2.png', 'assets/trackers_3.png'],
      technologies: ['Flutter', 'SQLite', 'Riverpod'],
      category: 'mobile',
      github: 'https://github.com/donsfak/Trackers_app',
      demo: 'details',
    },
  ];

  const filteredProjects = activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter);

  const services = [
    { icon: <BarChart3 className="w-10 h-10" />, title: t('services.dataAnalysis.title'), description: t('services.dataAnalysis.description'), color: 'text-purple-500' },
    { icon: <Cpu className="w-10 h-10" />,        title: t('services.ml.title'),           description: t('services.ml.description'),           color: 'text-pink-500'   },
    { icon: <Globe className="w-10 h-10" />,       title: t('services.web.title'),          description: t('services.web.description'),          color: 'text-blue-500'   },
    { icon: <Smartphone className="w-10 h-10" />,  title: t('services.mobile.title'),       description: t('services.mobile.description'),       color: 'text-cyan-500'   },
    { icon: <Database className="w-10 h-10" />,    title: t('services.db.title'),           description: t('services.db.description'),           color: 'text-green-500'  },
    { icon: <TrendingUp className="w-10 h-10" />,  title: t('services.bi.title'),           description: t('services.bi.description'),           color: 'text-orange-500' },
  ];

  const navLinks = ['about', 'experience', 'projects', 'skills', 'services', 'contact'] as const;

  const categoryLabel: Record<string, string> = { mobile: 'Mobile', web: 'Web', dataScience: 'Data' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Particle Background */}
      <div className="particle-bg">
        <div className="particle w-72 h-72 bg-purple-600 top-20 left-10"   style={{ animationDelay: '0s' }} />
        <div className="particle w-96 h-96 bg-pink-500   top-40 right-20"  style={{ animationDelay: '2s' }} />
        <div className="particle w-80 h-80 bg-blue-500   bottom-20 left-1/4" style={{ animationDelay: '4s' }} />
        <div className="particle w-48 h-48 bg-cyan-500   bottom-40 right-1/3" style={{ animationDelay: '6s' }} />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text tracking-widest">SFAK</span>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link} href={`#${link}`} className={`nav-link ${activeSection === link ? 'nav-link-active' : ''}`}>
                {t(`nav.${link}`)}
              </a>
            ))}
            <button onClick={changeLanguage} className="p-2 rounded-full hover:bg-white/10 flex items-center gap-1" aria-label="Toggle language">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">{i18n.language === 'fr' ? 'FR' : 'EN'}</span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <DigitalClock />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/10 px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <a key={link} href={`#${link}`} onClick={toggleMenu}
                className={`block py-2 px-3 rounded-lg transition-colors ${activeSection === link ? 'text-purple-500 bg-purple-500/10' : 'hover:bg-white/10'}`}>
                {t(`nav.${link}`)}
              </a>
            ))}
            <button onClick={changeLanguage} className="flex items-center gap-2 py-2 px-3 w-full rounded-lg hover:bg-white/10 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{i18n.language === 'fr' ? 'Français' : 'English'}</span>
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center relative pt-32 md:pt-24">
        {/* Radial glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-spin-slow" />
              <div className="relative rounded-full p-1 bg-white dark:bg-black">
                <img
                  src="/assets/photo identite.jpg"
                  alt="Soro Falibeta"
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Status badge */}
              <div className="absolute -right-2 -bottom-2 bg-white dark:bg-gray-900 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-gray-100 dark:border-white/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('hero.available')}</span>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 animate-slide-up tracking-tight" style={{ animationDelay: '0.2s' }}>
            Soro <span className="gradient-text">Falibeta</span>
          </h1>

          {/* Rotating role */}
          <div className="h-12 flex items-center justify-center mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className={`text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-400 transition-all duration-400 ${roleFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
              {ROLES[roleIndex]}
            </p>
          </div>

          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
            {t('hero.tagline')}
          </p>

          <div className="flex gap-6 justify-center mb-10 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { href: 'https://github.com/donsfak', icon: <Github className="w-7 h-7" /> },
              { href: 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/', icon: <Linkedin className="w-7 h-7" /> },
              { href: 'mailto:falibetasoro@gmail.com', icon: <Mail className="w-7 h-7" /> },
            ].map(({ href, icon }) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="p-3 rounded-full glass hover:bg-purple-500/20 hover:border-purple-500/40 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                {icon}
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <a href="/assets/CV_Falibeta_Soro.pdf" download="CV_Falibeta_Soro.pdf">
              <button className="btn-primary">
                <Download className="w-5 h-5 inline-block mr-2" />
                {t('hero.downloadCv')}
              </button>
            </a>
            <a href="#contact">
              <button className="btn-secondary">
                <MessageSquare className="w-5 h-5 inline-block mr-2" />
                {t('hero.getInTouch')}
              </button>
            </a>
          </div>
        </div>
      </section>

      <main>
        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <section ref={statsRef} className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {[
              { icon: <TrendingUp className="w-10 h-10 mx-auto mb-3 text-purple-500" />, value: `${stats.experience}`, label: t('stats.experience') },
              { icon: <Rocket        className="w-10 h-10 mx-auto mb-3 text-pink-500"   />, value: `${stats.projects}+`, label: t('stats.projects')    },
              { icon: <Code          className="w-10 h-10 mx-auto mb-3 text-blue-500"   />, value: `${stats.technologies}+`, label: t('stats.technologies') },
            ].map(({ icon, value, label }) => (
              <div key={label} className="stat-card w-full max-w-[260px] group">
                {icon}
                <div className="stat-number group-hover:scale-110 transition-transform duration-300">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── About ────────────────────────────────────────────────────────── */}
        <section id="about" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <User className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t('about.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {t('about.description1')}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {t('about.description2')}
              </p>
              {/* Quick facts */}
              <div className="flex flex-wrap gap-2">
                {['Python', 'Flutter', 'React', 'SQL', 'Machine Learning'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: <Award className="w-7 h-7 text-purple-600" />, title: t('about.education'), value: 'Master Mobiquité, Big Data et Systèmes — ESATIC' },
                { icon: <Briefcase className="w-7 h-7 text-pink-500" />, title: t('about.currentRole'), value: 'Étudiant en Master' },
                { icon: <MapPin className="w-7 h-7 text-blue-500" />, title: t('about.location'), value: "Abidjan, Côte d'Ivoire" },
              ].map(({ icon, title, value }) => (
                <div key={title} className="glass-card flex items-start gap-4 hover:border-purple-500/30 transition-all">
                  <div className="p-2 rounded-xl bg-white/10 flex-shrink-0">{icon}</div>
                  <div>
                    <h3 className="font-semibold text-base mb-0.5">{title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{value}</p>
                  </div>
                </div>
              ))}
              {/* Availability */}
              <div className="glass-card flex items-center gap-4 border-green-500/30 bg-green-500/5">
                <div className="p-2 rounded-xl bg-green-500/10 flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5 text-green-500">{t('about.available')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{t('about.availableDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience ───────────────────────────────────────────────────── */}
        <section id="experience" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-xl bg-pink-500/10">
              <Briefcase className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t('experience.title')}</h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-600 via-pink-500 to-transparent ml-[7px] md:ml-0 md:left-8" />

            <div className="pl-10 md:pl-20">
              {/* Huawei */}
              <div className="relative mb-16">
                <div className="absolute -left-10 md:-left-20 top-2 w-4 h-4 bg-purple-600 rounded-full glow-border border-2 border-white dark:border-black" />
                <div className="glass rounded-2xl p-6 md:p-8 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold gradient-text">GNOC IN VAS Engineer</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Huawei Technologies
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-semibold border border-purple-500/20 self-start md:self-auto whitespace-nowrap">
                      Juil. 2024 – Déc. 2024
                    </span>
                  </div>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm mb-5">
                    {[
                      "Suivi des tickets et gestion des incidents pour assurer la continuité des services",
                      "Gestion proactive des plaintes clients avec résolution rapide et efficace",
                      "Supervision et maintenance des plateformes AMEA (Afrique & Moyen-Orient) du Groupe Orange",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'SQL', 'Excel', 'ITIL', 'Linux', 'Monitoring'].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 text-xs rounded-lg bg-white/10 dark:bg-white/5 border border-white/10 text-gray-600 dark:text-gray-400 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="relative">
                <div className="absolute -left-10 md:-left-20 top-2 w-4 h-4 bg-pink-500 rounded-full border-2 border-white dark:border-black shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
                <div className="glass rounded-2xl p-6 md:p-8 hover:border-pink-500/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold" style={{ background: 'linear-gradient(135deg,rgb(236 72 153),rgb(59 130 246))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Master Mobiquité, Big Data & Systèmes
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                        <Award className="w-4 h-4" /> ESATIC × Université Côte d'Azur
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 text-xs font-semibold border border-pink-500/20 self-start md:self-auto whitespace-nowrap">
                      2024 – En cours
                    </span>
                  </div>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm mb-5">
                    {[
                      "Machine Learning, Deep Learning & Intelligence Artificielle",
                      "Big Data : Hadoop, Spark, architectures distribuées",
                      "Développement mobile avancé (Flutter) et systèmes embarqués",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-pink-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {['Machine Learning', 'Big Data', 'Flutter', 'Python', 'R', 'Spark'].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 text-xs rounded-lg bg-white/10 dark:bg-white/5 border border-white/10 text-gray-600 dark:text-gray-400 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects ─────────────────────────────────────────────────────── */}
        <section id="projects" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Layers className="w-7 h-7 text-blue-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t('projects.title')}</h2>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {['all', 'mobile', 'web', 'dataScience'].map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`filter-btn ${activeFilter === filter ? 'filter-btn-active' : 'filter-btn-inactive'}`}>
                {t(`projects.filters.${filter}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={index}
                className="group relative bg-white dark:bg-[#0f1115] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] md:hover:-translate-y-2 flex flex-col"
              >
                {/* Category badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/10">
                    {categoryLabel[project.category] ?? project.category}
                  </span>
                </div>

                <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-[#0A0A0A] overflow-hidden border-b border-gray-200 dark:border-white/5">
                  <img src={project.image} alt={project.title}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <img key={tech} src={getSkillIcon(tech)} alt={tech} className="w-6 h-6 hover:scale-110 transition-transform" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 mb-5 line-clamp-3 text-sm flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-xs rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-auto items-center">
                    {project.demo && (
                      <button onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium transition-colors">
                        <ExternalLink className="w-4 h-4" /> {t('projects.liveDemo')}
                      </button>
                    )}
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Stats */}
        <GithubStats />
        <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} />

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        <section id="skills" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-xl bg-pink-500/10">
              <Cpu className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t('skills.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((cat) => (
              <SkillCard
                key={cat.id}
                id={cat.id}
                title={t(cat.titleKey)}
                skills={cat.skills}
                hoveredSkillCard={hoveredSkillCard}
                onHover={setHoveredSkillCard}
                getIcon={getSkillIcon}
                accentColor={cat.accent}
              />
            ))}
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────────── */}
        <section id="services" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Rocket className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t('services.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="service-card group relative overflow-hidden">
                {/* Gradient corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-3xl" />
                <div className={`service-icon ${service.color} mb-5`}>{service.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        <section id="contact" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Send className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">{t('contact.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">{t('contact.subtitle')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">{t('contact.description')}</p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Mail className="w-5 h-5 text-purple-600" />, label: 'falibetasoro@gmail.com', href: 'mailto:falibetasoro@gmail.com' },
                  { icon: <Phone className="w-5 h-5 text-purple-600" />, label: '+225 0779316205' },
                  { icon: <MapPin className="w-5 h-5 text-purple-600" />, label: "Abidjan, Côte d'Ivoire" },
                ].map(({ icon, label, href }) => (
                  <div key={label} className="flex items-center gap-4 p-3 rounded-xl glass hover:border-purple-500/30 transition-all">
                    <div className="p-2 rounded-lg bg-purple-500/10">{icon}</div>
                    {href
                      ? <a href={href} className="text-sm hover:text-purple-600 transition-colors font-medium">{label}</a>
                      : <span className="text-sm font-medium">{label}</span>
                    }
                  </div>
                ))}
              </div>
              {/* Social links */}
              <div className="flex gap-3">
                {[
                  { href: 'https://github.com/donsfak', icon: <Github className="w-5 h-5" />, label: 'GitHub' },
                  { href: 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/', icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
                ].map(({ href, icon, label }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-purple-500/10 hover:border-purple-500/30 text-sm font-medium transition-all">
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>

            {formSuccess ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 p-10 glass rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold text-green-400">{t('contact.successTitle')}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('contact.successDesc')}</p>
                <button onClick={() => setFormSuccess(false)} className="btn-secondary text-sm px-6 py-2">
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setFormSuccess(true); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">{t('contact.form.name')}</label>
                    <input type="text" name="name" className="form-input" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="form-label">{t('contact.form.email')}</label>
                    <input type="email" name="email" className="form-input" placeholder="john@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="form-label">{t('contact.form.subject')}</label>
                  <input type="text" name="subject" className="form-input" placeholder={t('contact.form.subject')} required />
                </div>
                <div>
                  <label className="form-label">{t('contact.form.message')}</label>
                  <textarea name="message" className="form-textarea" rows={5} placeholder={t('contact.form.message')} required />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4 inline-block mr-2" />
                  {t('contact.form.send')}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h3 className="text-3xl font-bold gradient-text mb-2 tracking-widest">SFAK</h3>
          <p className="text-xs text-gray-500 mb-6">Soro Falibeta</p>
          <div className="flex gap-6 mb-8">
            {[
              { href: 'https://github.com/donsfak', icon: <Github className="w-6 h-6" /> },
              { href: 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/', icon: <Linkedin className="w-6 h-6" /> },
              { href: 'mailto:falibetasoro@gmail.com', icon: <Mail className="w-6 h-6" /> },
            ].map(({ href, icon }) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="p-2 rounded-full glass hover:bg-purple-500/10 text-gray-500 hover:text-purple-500 transition-all transform hover:scale-110">
                {icon}
              </a>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6 text-sm">{t('footer.description')}</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6" />
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Soro Falibeta — {t('footer.rights')}</p>
          <p className="text-xs text-gray-600 dark:text-gray-600 mt-2">Built with React, TypeScript & Tailwind CSS</p>
        </div>
      </footer>

      {/* Scroll to top */}
      <button onClick={scrollToTop} aria-label="Scroll to top"
        className={`scroll-top-btn ${showScrollTop ? 'scroll-top-btn-visible' : ''}`}>
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

export default App;
