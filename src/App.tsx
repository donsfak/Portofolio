import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Download, ExternalLink, Code, Briefcase, User, Cpu, Moon, Sun } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const skills = [
    'Flutter', 
    'SQL', 
    'MySQL', 
    'PostgreSQL',
    'PANDAS', 
    'POWER BI', 
    'Tableau', 
    'PYTHON',
    'NUMPY',
    'MATPLOTLIB',
    'R',
    'Git'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text">SFAK</span>
          <div className="flex items-center gap-8">
            <a href="#about" className="nav-link">About</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#skills" className="nav-link">Skills</a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-8xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" 
                alt="Project 1" 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform">
                <h3 className="text-2xl font-semibold text-white mb-2">To Do app</h3>
                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  This project aims to master FLUTTER functionalities such as "flutter_river pod","flutter_provider".
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
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" 
                alt="Project 2" 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform">
                <h3 className="text-2xl font-semibold text-white mb-2">Uber Clone V1</h3>
                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  How to use various Google Maps APIs and Supabase features to create a fully functional Uber clone app on Flutter with a full backend.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Flutter', 'Supabase'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href="https://github.com/donsfak/maps_clone"
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
        <section id="skills" className="section-container bg-gray-100 dark:bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl font-bold">Skills</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div 
                key={`${skill}-${index}`}
                className="skill-tag p-6 rounded-xl text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-lg font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">© 2025 Soro Falibeta. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;