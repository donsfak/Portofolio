import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp } from 'lucide-react';
import { GithubStats } from './components/GithubStats';
import { Certifications } from './components/Certifications';
import { CaseStudyDataTour } from './components/CaseStudyDataTour';
import { CASE_STUDY_DATATOUR, NAV_LINKS } from './data/portfolio';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Stats } from './sections/Stats';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Services } from './sections/Services';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

type Theme = 'light' | 'dark';

const readTheme = (): Theme => {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

function App() {
  const { t } = useTranslation();
  const [theme,          setTheme]          = useState<Theme>(readTheme);
  const [activeSection,  setActiveSection]  = useState('');
  const [showScrollTop,  setShowScrollTop]  = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navVisible,     setNavVisible]     = useState(true);
  const [route,          setRoute]          = useState(() => window.location.hash);
  const prevScrollPos = useRef(0);

  // Theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    try { localStorage.setItem('theme', theme); } catch { /* storage blocked */ }
  }, [theme]);

  // Scroll — registered once; the previous position lives in a ref
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavVisible(prevScrollPos.current > y || y < 10);
      prevScrollPos.current = y;
      setShowScrollTop(y > 400);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? (y / scrollable) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section
  useEffect(() => {
    const obs = NAV_LINKS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id); }, { rootMargin: '-40% 0px -55% 0px' });
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  // Hash routing (case study pages) + body scroll lock while one is open
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.body.style.overflow = route === CASE_STUDY_DATATOUR ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [route]);

  // Reveal sections on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080810] text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Scroll progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Particle bg */}
      <div className="particle-bg">
        <div className="particle w-96 h-96 bg-purple-600 top-10  left-0"    style={{ animationDelay:'0s' }} />
        <div className="particle w-80 h-80 bg-pink-500  top-1/3 right-0"   style={{ animationDelay:'3s' }} />
        <div className="particle w-72 h-72 bg-blue-600  bottom-1/4 left-1/3" style={{ animationDelay:'6s' }} />
        <div className="particle w-64 h-64 bg-cyan-500  bottom-0  right-1/4" style={{ animationDelay:'9s' }} />
      </div>

      <Navbar theme={theme} onToggleTheme={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
        activeSection={activeSection} visible={navVisible} />

      <Hero />

      <main>
        <Stats />
        <About />
        <Experience />
        <Projects />
        <GithubStats />
        <Skills />
        <Certifications />
        <Services />
        <Contact />
      </main>

      <Footer />

      {/* Scroll to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={t('hero.scrollTop')}
        className={`scroll-top-btn ${showScrollTop ? 'scroll-top-btn-visible' : ''}`}>
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Case study overlay (hash-routed, needs no server rewrites) */}
      {route === CASE_STUDY_DATATOUR && (
        <CaseStudyDataTour onBack={() => { window.location.hash = ''; }} />
      )}
    </div>
  );
}

export default App;
