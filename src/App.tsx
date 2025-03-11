import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, ExternalLink, Code, Briefcase, User, Cpu, Moon, Sun, Menu } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
  }, [theme]);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Gérer le scroll
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const skills = [
    "flutter","mysql", "postgresql",
     "python","r", "git", "react", "typescript",
    "vite", "tailwind", "vercel", "supabase", "firebase","docker"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold">SFAK</span>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="nav-link">About</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#skills" className="nav-link">Skills</a>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 p-4">
            <a href="#about" className="block py-2" onClick={toggleMenu}>About</a>
            <a href="#experience" className="block py-2" onClick={toggleMenu}>Experience</a>
            <a href="#projects" className="block py-2" onClick={toggleMenu}>Projects</a>
            <a href="#skills" className="block py-2" onClick={toggleMenu}>Skills</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
      <div className="relative group">
        {/* Gradient Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-spin-slow"></div>
        
        {/* Photo */}
        <div className="relative rounded-full p-1 bg-white dark:bg-black ring-4 ring-white/50 dark:ring-black/50">
          <img 
            src="/assets/photo identite.jpg" 
            alt="Photo de Soro Falibeta" 
            className="w-32 h-32 rounded-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Waving Hand Emoji */}
        <div className="absolute -right-4 -bottom-2 bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg">
          <div className="text-3xl animate-waving-hand">
            👋
          </div>
        </div>
      </div>
    </div>

          <h1 className="text-8xl font-bold mt-20 mb-6 animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
            Soro <span className="gradient-text">Falibeta</span>
          </h1>
          <p className="text-3xl text-gray-600 dark:text-gray-400 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Data Scientist Junior
          </p>

          <div className="flex gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a href="https://github.com/donsfak" 
              target="_blank" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Github className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/falibeta-soro-8678b62a1/" 
              target="_blank" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="mailto:falibetasoro@gmail.com" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Mail className="w-8 h-8" />
            </a>
          </div>

          <a href="/assets/data analyste junior.pdf" download="data analyste junior.pdf" className="inline-block">
            <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-medium text-white transition-colors animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <Download className="w-5 h-5 inline-block mr-2" />
              Download CV
            </button>
          </a>
        </div>
      </header>

      <main>
        {/* About Section */}
        <section id="about" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <User className="w-8 h-8 text-blue-500" />
            <h2 className="text-4xl font-bold">About Me</h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Diplômé en informatique avec une spécialisation en développement d'application,
              je suis passionné par l'analyse de données et déterminé à me lancer dans une carrière
              de Data Analyste. Ma formation m'a doté de compétences solides en manipulation de
              données, analyse statistique et visualisation. Motivé et apprenant rapide, je suis à la
              recherche d'une première opportunité pour apporter une valeur ajoutée à une équipe
              d'analystes de données.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section-container bg-gray-100 dark:bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Briefcase className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl font-bold">Experience</h2>
          </div>
          <div className="space-y-12">
            <div className="relative pl-8 border-l-2 border-blue-500">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-2"></div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold">GNOC IN VAS ENGINEER</h3>
                <p className="text-gray-600 dark:text-gray-400">Huawei • Juillet 2024 - Décembre 2024</p>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Code className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                  Suivi des tickets et gestion des incidents.
                </li>
                <li className="flex items-start gap-2">
                  <Code className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                  Gestion des plaintes des clients.
                </li>
                <li className="flex items-start gap-2">
                  <Code className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                  Supervision et maintenance des platesformes des filiales de l'Afrique et
                  du Moyen-Orient (AMEA) du Groupe Orange.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <Code className="w-8 h-8 text-blue-500" />
            <h2 className="text-4xl font-bold">Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="project-card group">
              <img 
                src="assets/todolist.webp" 
                alt="Project 1" 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform">
                <h3 className="text-2xl font-semibold text-white mb-2">To Do app</h3>
                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  This project aims to master FLUTTER functionalities such as :
                  For Frontend : Flutter (Riverpod, Provider), 
                  For Backend : SQFLite,
                  Synchronisation : SQLite. 
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Flutter', 'SQFLite'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href="https://github.com/donsfak/Trackers_app" 
                  target="_blank"
                  className="inline-flex items-center text-white hover:text-blue-300 transition-colors"
                >
                  View Project <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            <div className="project-card group">
              <img 
                src="assets/uber.webp" 
                alt="Project 2" 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform">
                <h3 className="text-2xl font-semibold text-white mb-2">Uber Clone </h3>
                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  How to use various Google Maps APIs and Firebase features to create a fully functional Uber clone app on Flutter with a full backend.
                  Frontend : Flutter (Riverpod) + Google Maps SDK,  
                  Backend : Firebase,   
                  API : Directions API (Google),  
                  Base de données : Firestore (Firebase).  
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Flutter', 'Firebase','Google'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href="https://github.com/donsfak/uber_clone"
                  target="_blank"
                  className="inline-flex items-center text-white hover:text-blue-300 transition-colors"
                >
                  View Project <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            <div className="project-card group">
              <img 
                src="assets/uber.webp" 
                alt="Project 3" 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform">
                <h3 className="text-2xl font-semibold text-white mb-2">Drivers_app</h3>
                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                This is the second part of the uber_clone project, but this app is more for driver management.
                  Frontend : Flutter (Riverpod) + Google Maps SDK,  
                  Backend : Firebase,   
                  API : Directions API (Google),  
                  Base de données : Firestore (Firebase).                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Flutter', 'Firebase','Google'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href="https://github.com/donsfak/Drivers_app"
                  target="_blank"
                  className="inline-flex items-center text-white hover:text-blue-300 transition-colors"
                >
                  View Project <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        {/* Skills Section */}
        <section id="skills" className="section-container bg-gray-100 dark:bg-white/5">
    <div className="flex items-center gap-4 mb-12">
        <Cpu className="w-8 h-8 text-pink-500" />
        <h2 className="text-4xl font-bold">Skills</h2>
    </div>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-6 px-4">
        {skills.map((skill, index) => {
            const customIcons: { [key: string]: JSX.Element } = {
          
            };

            const iconName = skill.toLowerCase().replace(/\s+/g, '');

            return (
                <div
                    key={`${skill}-${index}`}
                    className="skill-icon group relative flex flex-col items-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300"
                >
                    <div className="w-20 h-20 flex items-center justify-center">
                        {customIcons[skill] || (
                            <img
                                src={`https://skillicons.dev/icons?i=${iconName}`}
                                alt={skill}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 grayscale contrast-75 group-hover:grayscale-0 group-hover:contrast-100"
                            />
                        )}
                    </div>
                    <span className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-sm font-medium dark:text-white bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full shadow-md">
                        {skill}
                    </span>
                </div>
            )
        })}
    </div>
</section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">© 2025 Soro Falibeta. All rights reserved.</p>
          <p className="text-gray-600 dark:text-gray-400">About this website: built with React(App Router & Server Actions), TypeScript, Tailwind CSS, Vite, Vercel hosting.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

function setVisible(arg0: boolean) {
  throw new Error('Function not implemented.');
}
function setPrevScrollPos(currentScrollPos: number) {
  throw new Error('Function not implemented.');
}

