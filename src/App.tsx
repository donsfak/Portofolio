import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import {
  Github, Linkedin, Mail, Download, ExternalLink, Code, Briefcase, User, Cpu,
  Moon, Sun, Menu, X, TrendingUp, Award, Rocket, Database, BarChart3, Smartphone,
  Globe, MapPin, MessageSquare, Send, Phone, ChevronUp, CheckCircle2, Layers,
  Loader2, AlertCircle,
} from 'lucide-react';
import { ProjectModal } from './components/ProjectModal';
import { GithubStats } from './components/GithubStats';
import { DigitalClock } from './components/DigitalClock';

// ─── EmailJS config ────────────────────────────────────────────────────────────
// Create a free account at emailjs.com, then fill in your IDs below.
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

// ─── SkillCard ─────────────────────────────────────────────────────────────────
interface SkillCardProps {
  id: string; title: string; skills: string[];
  hoveredSkillCard: string | null; onHover: (id: string | null) => void;
  getIcon: (name: string) => string; accentColor?: string;
}

function SkillCard({ id, title, skills, hoveredSkillCard, onHover, getIcon, accentColor = 'cyan' }: SkillCardProps) {
  const isHovered = hoveredSkillCard === id;
  const glowColor  = accentColor === 'purple' ? 'rgba(147,51,234,0.3)' : accentColor === 'pink' ? 'rgba(236,72,153,0.3)' : 'rgba(34,211,238,0.3)';
  const borderCls  = accentColor === 'purple' ? 'border-purple-400' : accentColor === 'pink' ? 'border-pink-400' : 'border-cyan-400';

  return (
    <div
      className={`relative bg-white dark:bg-white/[0.04] rounded-2xl p-6 shadow-sm transition-all duration-300 md:hover:-translate-y-1 ${
        isHovered ? `border-2 ${borderCls}` : 'border border-gray-100 dark:border-white/[0.07] md:hover:border-purple-500/30'
      }`}
      style={isHovered ? { boxShadow: `0 0 28px ${glowColor}` } : {}}
      onMouseEnter={() => window.matchMedia('(min-width: 768px)').matches && onHover(id)}
      onMouseLeave={() => onHover(null)}
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
            <img src={getIcon(skill)} alt={skill} className="w-7 h-7 group-hover/sk:scale-110 transition-transform" />
            <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Rotating roles ─────────────────────────────────────────────────────────────
const ROLES = ['Data Scientist Junior', 'Full Stack Developer', 'Mobile Developer'];

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  const { t, i18n } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'
  );
  const [isMenuOpen,       setIsMenuOpen]       = useState(false);
  const [activeFilter,     setActiveFilter]     = useState('all');
  const [hoveredSkillCard, setHoveredSkillCard] = useState<string | null>(null);
  const [selectedProject,  setSelectedProject]  = useState<{ title: string; screenshots: string[] } | null>(null);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [stats,            setStats]            = useState({ experience: 0, projects: 0, technologies: 0 });
  const [hasAnimated,      setHasAnimated]      = useState(false);
  const [activeSection,    setActiveSection]    = useState('');
  const [showScrollTop,    setShowScrollTop]    = useState(false);
  const [roleIndex,        setRoleIndex]        = useState(0);
  const [roleFading,       setRoleFading]       = useState(false);
  const [formState,        setFormState]        = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError,        setFormError]        = useState('');

  const statsRef     = useRef<HTMLDivElement>(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [navVisible,    setNavVisible]    = useState(true);

  // Theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavVisible(prevScrollPos > y || y < 10);
      setPrevScrollPos(y);
      setShowScrollTop(y > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [prevScrollPos]);

  // Active section
  useEffect(() => {
    const ids = ['about', 'experience', 'projects', 'skills', 'services', 'contact'];
    const obs = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id); }, { rootMargin: '-40% 0px -55% 0px' });
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  // Rotating role
  useEffect(() => {
    const t = setInterval(() => {
      setRoleFading(true);
      setTimeout(() => { setRoleIndex((p) => (p + 1) % ROLES.length); setRoleFading(false); }, 350);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  // Stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || hasAnimated) return;
      setHasAnimated(true);
      const targets = { experience: 6, projects: 3, technologies: 20 };
      const steps = 60;
      let step = 0;
      const iv = setInterval(() => {
        step++;
        const p = step / steps;
        setStats({ experience: Math.floor(targets.experience * p), projects: Math.floor(targets.projects * p), technologies: Math.floor(targets.technologies * p) });
        if (step >= steps) { clearInterval(iv); setStats(targets); }
      }, 2000 / steps);
    }, { threshold: 0.5 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const toggleTheme  = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleMenu   = () => setIsMenuOpen(v => !v);
  const changeLang   = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  const scrollToTop  = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── Contact form submit ──────────────────────────────────────────────────────
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    // If EmailJS is not configured, fall back to mailto
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      const fd = new FormData(e.currentTarget);
      const subject = encodeURIComponent(`[Portfolio] ${fd.get('subject') || 'Message'}`);
      const body = encodeURIComponent(
        `From: ${fd.get('name')} <${fd.get('email')}>\n\n${fd.get('message')}`
      );
      window.open(`mailto:falibetasoro@gmail.com?subject=${subject}&body=${body}`);
      setFormState('success');
      return;
    }

    setFormState('sending');
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current!, EMAILJS_PUBLIC_KEY);
      setFormState('success');
      formRef.current?.reset();
    } catch {
      setFormState('error');
      setFormError(t('contact.errorDesc'));
    }
  };

  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase().replace(/\s+/g, '');
    if (n === 'rive')    return '/assets/rive.png';
    if (n === 'tableau') return '/assets/tableau.png';
    return `https://skillicons.dev/icons?i=${n}`;
  };

  const skillCategories = [
    { id: 'frontend',    titleKey: 'skills.frontend',    accent: 'cyan',   skills: ['react','typescript','tailwind','vite','html','css'] },
    { id: 'backend',     titleKey: 'skills.backend',     accent: 'purple', skills: ['python','firebase','supabase','mysql','postgresql','sqlite'] },
    { id: 'mobile',      titleKey: 'skills.mobile',      accent: 'pink',   skills: ['flutter'] },
    { id: 'dataScience', titleKey: 'skills.dataScience', accent: 'cyan',   skills: ['python','r','tableau'] },
    { id: 'devops',      titleKey: 'skills.devops',      accent: 'purple', skills: ['git','docker','kubernetes','linux','vercel'] },
    { id: 'design',      titleKey: 'skills.design',      accent: 'pink',   skills: ['figma','rive','ai'] },
  ];

  const projects = [
    { title: 'Weather Insights', description: 'Comprehensive Flutter weather app with real-time forecasts, air quality index, UV index, precipitation data, and smart clothing recommendations. Built with dark mode support and beautiful animations.', image: 'assets/weather.webp', screenshots: ['assets/weather.webp'], technologies: ['Flutter','Firebase','API','ML'], category: 'mobile', github: 'https://github.com/donsfak/weather_insights', demo: 'details' },
    { title: 'To Do App',        description: 'Feature-rich task management app built with Flutter. Implements local persistence with SQLite, state management with Riverpod, and a clean UX for efficient task tracking.',                             image: 'assets/trackers_1.png', screenshots: ['assets/trackers_1.png','assets/trackers_2.png','assets/trackers_3.png'], technologies: ['Flutter','SQLite','Riverpod'], category: 'mobile', github: 'https://github.com/donsfak/Trackers_app', demo: 'details' },
  ];

  const filteredProjects = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  const services = [
    { icon: <BarChart3 className="w-9 h-9" />, title: t('services.dataAnalysis.title'), description: t('services.dataAnalysis.description'), color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: <Cpu className="w-9 h-9" />,        title: t('services.ml.title'),           description: t('services.ml.description'),           color: 'text-pink-500',   bg: 'bg-pink-500/10'   },
    { icon: <Globe className="w-9 h-9" />,       title: t('services.web.title'),          description: t('services.web.description'),          color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
    { icon: <Smartphone className="w-9 h-9" />,  title: t('services.mobile.title'),       description: t('services.mobile.description'),       color: 'text-cyan-500',   bg: 'bg-cyan-500/10'   },
    { icon: <Database className="w-9 h-9" />,    title: t('services.db.title'),           description: t('services.db.description'),           color: 'text-green-500',  bg: 'bg-green-500/10'  },
    { icon: <TrendingUp className="w-9 h-9" />,  title: t('services.bi.title'),           description: t('services.bi.description'),           color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const navLinks = ['about','experience','projects','skills','services','contact'] as const;
  const catLabel: Record<string,string> = { mobile: 'Mobile', web: 'Web', dataScience: 'Data' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080810] text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Particle bg */}
      <div className="particle-bg">
        <div className="particle w-96 h-96 bg-purple-600 top-10  left-0"    style={{ animationDelay:'0s' }} />
        <div className="particle w-80 h-80 bg-pink-500  top-1/3 right-0"   style={{ animationDelay:'3s' }} />
        <div className="particle w-72 h-72 bg-blue-600  bottom-1/4 left-1/3" style={{ animationDelay:'6s' }} />
        <div className="particle w-64 h-64 bg-cyan-500  bottom-0  right-1/4" style={{ animationDelay:'9s' }} />
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="glass border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
            <span className="text-xl font-black gradient-text tracking-widest">SFAK</span>

            <div className="flex items-center gap-1.5 md:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-5">
              {navLinks.map(link => (
                <a key={link} href={`#${link}`} className={`nav-link ${activeSection === link ? 'nav-link-active' : ''}`}>
                  {t(`nav.${link}`)}
                </a>
              ))}
              <button onClick={changeLang} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg glass hover:bg-white/10 transition-colors">
                <Globe className="w-3.5 h-3.5" />
                {i18n.language.toUpperCase()}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-yellow-400" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <DigitalClock />
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="md:hidden glass border-b border-white/[0.08] px-4 py-3 space-y-0.5">
            {navLinks.map(link => (
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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center relative pt-24 pb-12">
        {/* Radial hero glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-purple-600/[0.07] blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-7">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full blur-md opacity-60 group-hover:opacity-90 animate-spin-slow"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899,#3b82f6)' }} />
              <div className="relative rounded-full p-[3px] bg-gray-50 dark:bg-[#080810]">
                <img src="/assets/photo identite.jpg" alt="Soro Falibeta"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
              </div>
              {/* Availability badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-lg text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-700 dark:text-gray-300">{t('hero.available')}</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-3 animate-slide-up tracking-tight" style={{ animationDelay: '0.15s' }}>
            Soro <span className="gradient-text">Falibeta</span>
          </h1>

          {/* Rotating role */}
          <div className="h-10 flex items-center justify-center mb-4 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <p className={`text-lg sm:text-2xl font-semibold text-gray-500 dark:text-gray-400 transition-all duration-350 ${roleFading ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'}`}>
              {ROLES[roleIndex]}
            </p>
          </div>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-9 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.45s' }}>
            {t('hero.tagline')}
          </p>

          {/* Socials */}
          <div className="flex gap-3 justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.55s' }}>
            {[
              { href: 'https://github.com/donsfak',                              icon: <Github className="w-5 h-5" /> },
              { href: 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/',   icon: <Linkedin className="w-5 h-5" /> },
              { href: 'mailto:falibetasoro@gmail.com',                           icon: <Mail className="w-5 h-5" /> },
            ].map(({ href, icon }) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="p-2.5 rounded-xl glass hover:bg-purple-500/15 hover:border-purple-500/30 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all hover:scale-110">
                {icon}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <a href="/assets/CV_Falibeta_Soro.pdf" download="CV_Falibeta_Soro.pdf">
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />{t('hero.downloadCv')}
              </button>
            </a>
            <a href="#contact">
              <button className="btn-secondary">
                <MessageSquare className="w-4 h-4 mr-2" />{t('hero.getInTouch')}
              </button>
            </a>
          </div>
        </div>
      </section>

      <main>
        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <section ref={statsRef} className="max-w-4xl mx-auto px-4 pb-16 md:pb-24">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />, val: `${stats.experience}`, label: t('stats.experience') },
              { icon: <Rocket     className="w-6 h-6 text-pink-500   mx-auto mb-2" />, val: `${stats.projects}+`, label: t('stats.projects')    },
              { icon: <Code       className="w-6 h-6 text-blue-500   mx-auto mb-2" />, val: `${stats.technologies}+`, label: t('stats.technologies') },
            ].map(({ icon, val, label }) => (
              <div key={label} className="stat-card py-6 group">
                {icon}
                <div className="stat-number group-hover:scale-110 transition-transform duration-300">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── About ──────────────────────────────────────────────────────── */}
        <section id="about" className="section-container border-t border-gray-100 dark:border-white/[0.05]">
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
                { icon: <Award className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-500/10', title: t('about.education'), val: 'Master Mobiquité, Big Data & Systèmes — ESATIC' },
                { icon: <Briefcase className="w-5 h-5 text-pink-500" />, bg: 'bg-pink-500/10',   title: t('about.currentRole'), val: 'Étudiant en Master' },
                { icon: <MapPin className="w-5 h-5 text-blue-500" />,    bg: 'bg-blue-500/10',   title: t('about.location'),    val: "Abidjan, Côte d'Ivoire" },
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

        {/* ── Experience ─────────────────────────────────────────────────── */}
        <section id="experience" className="section-container border-t border-gray-100 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015]">
          <div className="section-title-bar">
            <span className="section-icon bg-pink-500/10"><Briefcase className="w-6 h-6 text-pink-500" /></span>
            <h2 className="text-3xl md:text-4xl font-bold">{t('experience.title')}</h2>
          </div>

          <div className="relative max-w-3xl">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-transparent" />

            {/* Huawei */}
            <div className="relative pl-10 mb-10">
              <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full bg-purple-500 border-2 border-white dark:border-[#080810] glow-border" />
              <div className="glass rounded-2xl p-5 hover:border-purple-500/25 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold gradient-text">GNOC IN VAS Engineer</h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5"><Briefcase className="w-3 h-3" />Huawei Technologies</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20 whitespace-nowrap">
                    Juil. – Déc. 2024
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {[
                    'Suivi des tickets et gestion des incidents pour assurer la continuité des services',
                    'Gestion proactive des plaintes clients avec résolution rapide et efficace',
                    'Supervision et maintenance des plateformes AMEA du Groupe Orange',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {['Python','SQL','Excel','ITIL','Linux','Monitoring'].map(t => (
                    <span key={t} className="px-2 py-0.5 text-[11px] rounded-md bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="relative pl-10">
              <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full bg-pink-500 border-2 border-white dark:border-[#080810] shadow-[0_0_12px_rgba(236,72,153,0.6)]" />
              <div className="glass rounded-2xl p-5 hover:border-pink-500/25 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold gradient-text-blue">Master Mobiquité, Big Data & Systèmes</h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5"><Award className="w-3 h-3" />ESATIC × Université Côte d'Azur</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-500 border border-pink-500/20 whitespace-nowrap">
                    2024 – En cours
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {[
                    'Machine Learning, Deep Learning & Intelligence Artificielle',
                    'Big Data : Hadoop, Spark, architectures distribuées',
                    'Développement mobile avancé (Flutter) et systèmes embarqués',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-pink-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {['Machine Learning','Big Data','Flutter','Python','R','Spark'].map(t => (
                    <span key={t} className="px-2 py-0.5 text-[11px] rounded-md bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects ───────────────────────────────────────────────────── */}
        <section id="projects" className="section-container border-t border-gray-100 dark:border-white/[0.05]">
          <div className="section-title-bar">
            <span className="section-icon bg-blue-500/10"><Layers className="w-6 h-6 text-blue-500" /></span>
            <h2 className="text-3xl md:text-4xl font-bold">{t('projects.title')}</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {['all','mobile','web','dataScience'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`filter-btn ${activeFilter === f ? 'filter-btn-active' : 'filter-btn-inactive'}`}>
                {t(`projects.filters.${f}`)}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {filteredProjects.map((project, i) => (
              <div key={i} className="group relative bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.07] hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(147,51,234,0.15)] md:hover:-translate-y-1.5 flex flex-col">
                {/* Category badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-black/60 text-white backdrop-blur-sm">
                    {catLabel[project.category] ?? project.category}
                  </span>
                </div>
                {/* Image */}
                <div className="relative w-full aspect-video bg-gray-100 dark:bg-black/40 overflow-hidden">
                  <img src={project.image} alt={project.title}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{project.title}</h3>
                    <div className="flex gap-1">
                      {project.technologies.slice(0,4).map(tech => (
                        <img key={tech} src={getSkillIcon(tech)} alt={tech} className="w-5 h-5" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-2 py-0.5 text-[11px] rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    {project.demo && (
                      <button onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                        className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 font-semibold transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />{t('projects.liveDemo')}
                      </button>
                    )}
                    <a href={project.github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors">
                      <Github className="w-3.5 h-3.5" />GitHub
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

        {/* ── Skills ─────────────────────────────────────────────────────── */}
        <section id="skills" className="section-container border-t border-gray-100 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015]">
          <div className="section-title-bar">
            <span className="section-icon bg-pink-500/10"><Cpu className="w-6 h-6 text-pink-500" /></span>
            <h2 className="text-3xl md:text-4xl font-bold">{t('skills.title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map(cat => (
              <SkillCard key={cat.id} id={cat.id} title={t(cat.titleKey)} skills={cat.skills}
                hoveredSkillCard={hoveredSkillCard} onHover={setHoveredSkillCard}
                getIcon={getSkillIcon} accentColor={cat.accent} />
            ))}
          </div>
        </section>

        {/* ── Services ───────────────────────────────────────────────────── */}
        <section id="services" className="section-container border-t border-gray-100 dark:border-white/[0.05]">
          <div className="section-title-bar">
            <span className="section-icon bg-purple-500/10"><Rocket className="w-6 h-6 text-purple-500" /></span>
            <h2 className="text-3xl md:text-4xl font-bold">{t('services.title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <div key={i} className="service-card group p-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/[0.07] to-transparent rounded-bl-3xl" />
                <span className={`service-icon inline-flex p-2.5 rounded-xl ${s.bg} ${s.color}`}>{s.icon}</span>
                <h3 className="text-sm font-bold mb-2 mt-3">{s.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <section id="contact" className="section-container border-t border-gray-100 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015]">
          <div className="section-title-bar">
            <span className="section-icon bg-purple-500/10"><Send className="w-6 h-6 text-purple-500" /></span>
            <h2 className="text-3xl md:text-4xl font-bold">{t('contact.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left info */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('contact.subtitle')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{t('contact.description')}</p>
              <div className="space-y-2.5 mb-6">
                {[
                  { icon: <Mail className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-500/10', label: 'falibetasoro@gmail.com', href: 'mailto:falibetasoro@gmail.com' },
                  { icon: <Phone className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-500/10', label: '+225 0779316205' },
                  { icon: <MapPin className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-500/10', label: "Abidjan, Côte d'Ivoire" },
                ].map(({ icon, bg, label, href }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl glass hover:border-purple-500/25 transition-all">
                    <span className={`p-2 rounded-lg ${bg}`}>{icon}</span>
                    {href
                      ? <a href={href} className="text-sm font-medium hover:text-purple-600 transition-colors">{label}</a>
                      : <span className="text-sm font-medium">{label}</span>
                    }
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { href: 'https://github.com/donsfak',                             icon: <Github className="w-4 h-4" />,   label: 'GitHub'   },
                  { href: 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/', icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                ].map(({ href, icon, label }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass hover:bg-purple-500/10 hover:border-purple-500/25 text-sm font-medium transition-all">
                    {icon}{label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: form */}
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 p-10 glass rounded-2xl min-h-[320px]">
                <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-400" />
                </div>
                <h4 className="text-lg font-bold text-green-400">{t('contact.successTitle')}</h4>
                <p className="text-sm text-gray-500">{t('contact.successDesc')}</p>
                <button onClick={() => setFormState('idle')} className="btn-secondary text-xs px-5 py-2">
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form ref={formRef} className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">{t('contact.form.name')}</label>
                    <input type="text" name="from_name" className="form-input" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="form-label">{t('contact.form.email')}</label>
                    <input type="email" name="from_email" className="form-input" placeholder="john@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="form-label">{t('contact.form.subject')}</label>
                  <input type="text" name="subject" className="form-input" placeholder={t('contact.form.subjectPlaceholder')} required />
                </div>
                <div>
                  <label className="form-label">{t('contact.form.message')}</label>
                  <textarea name="message" className="form-textarea" rows={5} placeholder={t('contact.form.messagePlaceholder')} required />
                </div>
                {formState === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}
                  </div>
                )}
                <button type="submit" disabled={formState === 'sending'} className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed">
                  {formState === 'sending'
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('contact.form.sending')}</>
                    : <><Send className="w-4 h-4 mr-2" />{t('contact.form.send')}</>
                  }
                </button>
                <p className="text-[11px] text-center text-gray-400">
                  {!EMAILJS_SERVICE_ID && '⚡ Opens your email client · '}
                  {t('contact.privacy')}
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-white/[0.05] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <p className="text-xl font-black gradient-text tracking-widest mb-1">SFAK</p>
          <p className="text-xs text-gray-400 mb-6">Soro Falibeta</p>
          <div className="flex gap-4 mb-6">
            {[
              { href: 'https://github.com/donsfak',                             icon: <Github className="w-5 h-5" />   },
              { href: 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/', icon: <Linkedin className="w-5 h-5" /> },
              { href: 'mailto:falibetasoro@gmail.com',                          icon: <Mail className="w-5 h-5" />    },
            ].map(({ href, icon }) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="p-2 rounded-lg glass hover:bg-purple-500/10 text-gray-400 hover:text-purple-500 transition-all hover:scale-110">
                {icon}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-1 max-w-sm">{t('footer.description')}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent my-4" />
          <p className="text-[11px] text-gray-500">© {new Date().getFullYear()} Soro Falibeta — {t('footer.rights')}</p>
          <p className="text-[11px] text-gray-600 mt-1">Built with React · TypeScript · Tailwind CSS</p>
        </div>
      </footer>

      {/* Scroll to top */}
      <button onClick={scrollToTop} aria-label="Scroll to top" className={`scroll-top-btn ${showScrollTop ? 'scroll-top-btn-visible' : ''}`}>
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

export default App;
