import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail, Download, ExternalLink, Code, Briefcase, User, Cpu, Moon, Sun, Menu, X, TrendingUp, Award, Rocket, Database, BarChart3, Smartphone, Globe, MapPin, MessageSquare, Send, Phone, ChevronUp } from 'lucide-react';
import { ProjectModal } from './components/ProjectModal';
import { GithubStats } from './components/GithubStats';
import { DigitalClock } from './components/DigitalClock';

// ─── Reusable SkillCard ────────────────────────────────────────────────────────
interface SkillCardProps {
  id: string;
  title: string;
  skills: string[];
  hoveredSkillCard: string | null;
  onHover: (id: string | null) => void;
  getIcon: (name: string) => string;
}

function SkillCard({ id, title, skills, hoveredSkillCard, onHover, getIcon }: SkillCardProps) {
  const isHovered = hoveredSkillCard === id;
  return (
    <div
      className={`relative bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm transition-all duration-300 md:hover:-translate-y-1 ${
        isHovered
          ? 'border-2 border-cyan-400'
          : 'border border-gray-100 dark:border-white/10 md:hover:border-purple-500/30'
      }`}
      style={isHovered ? { boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' } : {}}
      onMouseEnter={() => window.matchMedia('(min-width: 768px)').matches && onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <h3 className="text-xl font-bold mb-6 text-center">{title}</h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <img src={getIcon(skill)} alt={skill} className="w-8 h-8" />
            <span className="font-medium capitalize">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
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
  const statsRef = useRef<HTMLDivElement>(null);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Nav hide-on-scroll + scroll-to-top visibility
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
            if (step >= steps) {
              clearInterval(interval);
              setStats(targets);
            }
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
    { id: 'frontend', titleKey: 'skills.frontend', skills: ['react', 'typescript', 'tailwind', 'vite', 'html', 'css'] },
    { id: 'backend', titleKey: 'skills.backend', skills: ['python', 'firebase', 'supabase', 'mysql', 'postgresql', 'sqlite'] },
    { id: 'mobile', titleKey: 'skills.mobile', skills: ['flutter'] },
    { id: 'dataScience', titleKey: 'skills.dataScience', skills: ['python', 'r', 'tableau'] },
    { id: 'devops', titleKey: 'skills.devops', skills: ['git', 'docker', 'kubernetes', 'linux', 'vercel'] },
    { id: 'design', titleKey: 'skills.design', skills: ['figma', 'rive', 'ai'] },
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
    { icon: <BarChart3 className="w-12 h-12" />, title: t('services.dataAnalysis.title'), description: t('services.dataAnalysis.description') },
    { icon: <Cpu className="w-12 h-12" />, title: t('services.ml.title'), description: t('services.ml.description') },
    { icon: <Globe className="w-12 h-12" />, title: t('services.web.title'), description: t('services.web.description') },
    { icon: <Smartphone className="w-12 h-12" />, title: t('services.mobile.title'), description: t('services.mobile.description') },
    { icon: <Database className="w-12 h-12" />, title: t('services.db.title'), description: t('services.db.description') },
    { icon: <TrendingUp className="w-12 h-12" />, title: t('services.bi.title'), description: t('services.bi.description') },
  ];

  const navLinks = ['about', 'experience', 'projects', 'skills', 'services', 'contact'] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Particle Background */}
      <div className="particle-bg">
        <div className="particle w-64 h-64 bg-purple-600 top-20 left-10" style={{ animationDelay: '0s' }} />
        <div className="particle w-96 h-96 bg-pink-500 top-40 right-20" style={{ animationDelay: '2s' }} />
        <div className="particle w-80 h-80 bg-blue-500 bottom-20 left-1/4" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md transition-transform duration-300 ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text">SFAK</span>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className={`nav-link ${activeSection === link ? 'nav-link-active' : ''}`}
              >
                {t(`nav.${link}`)}
              </a>
            ))}
            <button onClick={changeLanguage} className="p-2 rounded-full hover:bg-white/10 flex items-center gap-1" aria-label="Toggle language">
              <Globe className="w-5 h-5" />
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
          <div className="md:hidden glass border-t border-white/10 p-4">
            {navLinks.map((link) => (
              <a key={link} href={`#${link}`} className="block py-2" onClick={toggleMenu}>
                {t(`nav.${link}`)}
              </a>
            ))}
            <button onClick={changeLanguage} className="flex items-center gap-2 py-2 w-full text-left">
              <Globe className="w-5 h-5" />
              <span>{i18n.language === 'fr' ? 'Français' : 'English'}</span>
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-32 md:pt-24">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-spin-slow" />
              <div className="relative rounded-full p-1 bg-white dark:bg-black ring-4 ring-white/50 dark:ring-black/50">
                <img
                  src="/assets/photo identite.jpg"
                  alt="Photo de Soro Falibeta"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute -right-4 -bottom-2 bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg">
                <div className="text-3xl animate-waving-hand">👋</div>
              </div>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mt-24 mb-6 animate-slide-up tracking-tight" style={{ animationDelay: '0.2s' }}>
            Soro <span className="gradient-text">Falibeta</span>
          </h1>
          <p className="text-2xl md:text-4xl text-gray-600 dark:text-gray-400 mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {t('hero.role')}
          </p>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
            {t('hero.tagline')}
          </p>

          <div className="flex gap-6 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a href="https://github.com/donsfak" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110">
              <Github className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/falibeta-soro-8678b62a1/" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="mailto:falibetasoro@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110">
              <Mail className="w-8 h-8" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <a href="/assets/data analyste junior.pdf" download="data analyste junior.pdf">
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
        {/* Stats Section */}
        <section ref={statsRef} className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            <div className="stat-card w-full max-w-[250px]">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <div className="stat-number">{stats.experience}</div>
              <div className="stat-label">{t('stats.experience')}</div>
            </div>
            <div className="stat-card w-full max-w-[250px]">
              <Rocket className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <div className="stat-number">{stats.projects}+</div>
              <div className="stat-label">{t('stats.projects')}</div>
            </div>
            <div className="stat-card w-full max-w-[250px]">
              <Code className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <div className="stat-number">{stats.technologies}+</div>
              <div className="stat-label">{t('stats.technologies')}</div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <User className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">{t('about.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {t('about.description1')}
              </p>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about.description2')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="glass-card flex items-start gap-4">
                <Award className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('about.education')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Master Mobiquité, Big Data et Systèmes - ESATIC</p>
                </div>
              </div>
              <div className="glass-card flex items-start gap-4">
                <Briefcase className="w-8 h-8 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('about.currentRole')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Étudiant</p>
                </div>
              </div>
              <div className="glass-card flex items-start gap-4">
                <MapPin className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t('about.location')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <Briefcase className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold">{t('experience.title')}</h2>
          </div>
          <div className="space-y-12">
            <div className="relative pl-8 border-l-2 border-purple-600">
              <div className="absolute w-4 h-4 bg-purple-600 rounded-full -left-[9px] top-2 glow-border" />
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-semibold gradient-text">GNOC IN VAS ENGINEER</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Huawei • Juillet 2024 - Décembre 2024</p>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 mt-1 text-purple-600 flex-shrink-0" />
                  Suivi des tickets et gestion des incidents pour assurer la continuité des services
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 mt-1 text-purple-600 flex-shrink-0" />
                  Gestion proactive des plaintes des clients avec résolution rapide et efficace
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 mt-1 text-purple-600 flex-shrink-0" />
                  Supervision et maintenance des plateformes des filiales de l'Afrique et du Moyen-Orient (AMEA) du Groupe Orange
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Code className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">{t('projects.title')}</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {['all', 'mobile', 'web', 'dataScience'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-btn ${activeFilter === filter ? 'filter-btn-active' : 'filter-btn-inactive'}`}
              >
                {t(`projects.filters.${filter}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-[#0f1115] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] md:hover:-translate-y-2 flex flex-col"
              >
                <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-[#0A0A0A] overflow-hidden border-b border-gray-200 dark:border-white/5 group-hover:border-cyan-500/20 transition-colors">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col bg-white dark:bg-[#0f1115]">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span key={tech}>
                          <img src={getSkillIcon(tech)} alt={tech} className="w-6 h-6 hover:scale-110 transition-transform" />
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex gap-6 mt-auto items-center">
                    {project.demo && (
                      <button
                        onClick={() => { setSelectedProject(project); setIsModalOpen(true); }}
                        className="inline-flex items-center text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        {t('projects.liveDemo')}
                      </button>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Stats */}
        <GithubStats />

        {/* Project Modal */}
        <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={selectedProject} />

        {/* Skills Section */}
        <section id="skills" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="w-8 h-8 text-pink-500" />
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
              />
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Rocket className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">{t('services.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="service-card group">
                <div className="service-icon text-purple-600 dark:text-purple-400">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Send className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">{t('contact.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">{t('contact.subtitle')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{t('contact.description')}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <a href="mailto:falibetasoro@gmail.com" className="hover:text-purple-600 transition-colors">
                    falibetasoro@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-purple-600" />
                  <span>+225 0779316205</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <span>Abidjan, Côte d'Ivoire</span>
                </div>
              </div>
            </div>

            {formSuccess ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 p-8 glass rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold text-green-400">Message sent!</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button onClick={() => setFormSuccess(false)} className="btn-secondary text-sm px-6 py-2">
                  Send another
                </button>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSuccess(true);
                }}
              >
                <div>
                  <label className="form-label">{t('contact.form.name')}</label>
                  <input type="text" name="name" className="form-input" placeholder={t('contact.form.name')} required />
                </div>
                <div>
                  <label className="form-label">{t('contact.form.email')}</label>
                  <input type="email" name="email" className="form-input" placeholder="your.email@example.com" required />
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
                  <Send className="w-5 h-5 inline-block mr-2" />
                  {t('contact.form.send')}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h3 className="text-3xl font-bold gradient-text mb-6">SFAK</h3>
          <div className="flex gap-8 mb-8">
            <a href="https://github.com/donsfak" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors transform hover:scale-110">
              <Github className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/falibeta-soro-8678b62a1/" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors transform hover:scale-110">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="mailto:falibetasoro@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors transform hover:scale-110">
              <Mail className="w-8 h-8" />
            </a>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">{t('footer.description')}</p>
          <div className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            <p>© {new Date().getFullYear()} Soro Falibeta. {t('footer.rights')}</p>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            <p>Built with React, TypeScript & Tailwind CSS</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`scroll-top-btn ${showScrollTop ? 'scroll-top-btn-visible' : ''}`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

export default App;
