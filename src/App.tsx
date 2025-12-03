import { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Download, ExternalLink, Code, Briefcase, User, Cpu, Moon, Sun, Menu, X, TrendingUp, Award, Users, Rocket, Database, BarChart3, Smartphone, Globe, Star, Send, MapPin, Phone, MessageSquare } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({ experience: 0, projects: 0, technologies: 0, clients: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

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
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateStats = () => {
    const duration = 2000;
    const targets = { experience: 2, projects: 10, technologies: 20, clients: 5 };
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        experience: Math.floor(targets.experience * progress),
        projects: Math.floor(targets.projects * progress),
        technologies: Math.floor(targets.technologies * progress),
        clients: Math.floor(targets.clients * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targets);
      }
    }, stepDuration);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const skills = {
    frontend: ["react", "typescript", "tailwind", "vite"],
    backend: ["python", "firebase", "supabase", "mysql", "postgresql"],
    mobile: ["flutter"],
    dataScience: ["python", "r"],
    tools: ["git", "docker", "vercel"]
  };


  const projects = [
    {
      title: "Weather Insights",
      description: "Comprehensive Flutter weather application with real-time forecasts, weather alerts, air quality index, UV index, minute-by-minute precipitation, and smart clothing recommendations. Features beautiful UI with dark mode support.",
      image: "assets/weather.webp",
      technologies: ["Flutter", "Firebase", "API", "ML"],
      category: "Mobile",
      github: "https://github.com/donsfak/weather_insights",
      demo: null
    },
    {
      title: "To Do App",
      description: "Feature-rich task management application built with Flutter. Implements local data persistence with SQLite, state management with Riverpod, and a clean, intuitive user interface for efficient task tracking.",
      image: "assets/todolist.webp",
      technologies: ["Flutter", "SQLite", "Riverpod"],
      category: "Mobile",
      github: "https://github.com/donsfak/Trackers_app",
      demo: null
    },
    {
      title: "Uber Clone",
      description: "Full-featured ride-sharing application clone using Flutter and Google Maps SDK. Implements real-time location tracking, route optimization with Directions API, and Firebase backend for user authentication and data management.",
      image: "assets/uber.webp",
      technologies: ["Flutter", "Firebase", "Google Maps"],
      category: "Mobile",
      github: "https://github.com/donsfak/uber_clone",
      demo: null
    },
    {
      title: "Drivers App",
      description: "Companion application for the Uber Clone project, specifically designed for driver management. Features real-time ride requests, navigation integration, earnings tracking, and driver analytics dashboard.",
      image: "assets/uber.webp",
      technologies: ["Flutter", "Firebase", "Google Maps"],
      category: "Mobile",
      github: "https://github.com/donsfak/Drivers_app",
      demo: null
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const services = [
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Data Analysis & Visualization",
      description: "Transform raw data into actionable insights with advanced statistical analysis and compelling visualizations using Python, R, and modern BI tools."
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "Machine Learning Solutions",
      description: "Develop and deploy intelligent ML models for prediction, classification, and pattern recognition to solve complex business problems."
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Web Development",
      description: "Build modern, responsive web applications using React, TypeScript, and cutting-edge frameworks with focus on performance and user experience."
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Mobile Development",
      description: "Create beautiful, cross-platform mobile applications with Flutter, delivering native performance and seamless user experiences."
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Database Management",
      description: "Design and optimize database architectures using SQL and NoSQL solutions, ensuring data integrity, security, and scalability."
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Business Intelligence",
      description: "Implement comprehensive BI solutions with interactive dashboards and automated reporting for data-driven decision making."
    }
  ];

  const testimonials = [
    {
      name: "Client Name",
      position: "CEO, Tech Company",
      image: "https://ui-avatars.com/api/?name=Client+Name&background=9333ea&color=fff",
      text: "Outstanding work on our data analytics project. The insights provided helped us make critical business decisions.",
      rating: 5
    },
    {
      name: "Project Manager",
      position: "Lead Developer",
      image: "https://ui-avatars.com/api/?name=Project+Manager&background=ec4899&color=fff",
      text: "Excellent technical skills and great communication. Delivered the mobile app ahead of schedule with exceptional quality.",
      rating: 5
    },
    {
      name: "Startup Founder",
      position: "Founder & CTO",
      image: "https://ui-avatars.com/api/?name=Startup+Founder&background=3b82f6&color=fff",
      text: "Transformed our data infrastructure and built beautiful visualizations. Highly recommended for any data science project.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-x-hidden">
      {/* Particle Background */}
      <div className="particle-bg">
        <div className="particle w-64 h-64 bg-purple-600 top-20 left-10" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-96 h-96 bg-pink-500 top-40 right-20" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-80 h-80 bg-blue-500 bottom-20 left-1/4" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text">SFAK</span>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="nav-link">About</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-white/10 p-4">
            <a href="#about" className="block py-2" onClick={toggleMenu}>About</a>
            <a href="#experience" className="block py-2" onClick={toggleMenu}>Experience</a>
            <a href="#projects" className="block py-2" onClick={toggleMenu}>Projects</a>
            <a href="#skills" className="block py-2" onClick={toggleMenu}>Skills</a>
            <a href="#services" className="block py-2" onClick={toggleMenu}>Services</a>
            <a href="#contact" className="block py-2" onClick={toggleMenu}>Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center pt-16 relative">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-spin-slow"></div>
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

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mt-24 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Soro <span className="gradient-text">Falibeta</span>
          </h1>
          <p className="text-2xl md:text-4xl text-gray-600 dark:text-gray-400 mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Data Scientist Junior
          </p>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
            Transforming data into insights | Building intelligent solutions
          </p>

          <div className="flex gap-6 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a href="https://github.com/donsfak" 
              target="_blank" 
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110">
              <Github className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/falibeta-soro-8678b62a1/" 
              target="_blank" 
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110">
              <Linkedin className="w-8 h-8" />
            </a>
            <a href="mailto:falibetasoro@gmail.com" 
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors transform hover:scale-110">
              <Mail className="w-8 h-8" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <a href="/assets/data analyste junior.pdf" download="data analyste junior.pdf">
              <button className="btn-primary">
                <Download className="w-5 h-5 inline-block mr-2" />
                Download CV
              </button>
            </a>
            <a href="#contact">
              <button className="btn-secondary">
                <MessageSquare className="w-5 h-5 inline-block mr-2" />
                Get In Touch
              </button>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Stats Section */}
        <section ref={statsRef} className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="stat-card">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <div className="stat-number">{stats.experience}+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card">
              <Rocket className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <div className="stat-number">{stats.projects}+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-card">
              <Code className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <div className="stat-number">{stats.technologies}+</div>
              <div className="stat-label">Technologies</div>
            </div>
            <div className="stat-card">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <div className="stat-number">{stats.clients}+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <User className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Actuellement étudiant en Master Mobiquité, Big Data et Systèmes à l'ESATIC (en partenariat avec l'Université Côte d'Azur), je souhaite mettre à profit les compétences que j'ai développées lors de mon diplôme en informatique et consolidées durant un stage de six mois en analyse de données.
              </p>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Fort de cette première expérience en manipulation de données, analyse statistique et visualisation, je suis déterminé à relever de nouveaux défis et à contribuer au succès d'une équipe data innovante.
              </p>
            </div>
            <div className="space-y-4">
              <div className="glass-card flex items-start gap-4">
                <Award className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Education</h3>
                  <p className="text-gray-600 dark:text-gray-400">Master Mobiquité, Big Data et Systèmes - ESATIC</p>
                </div>
              </div>
              <div className="glass-card flex items-start gap-4">
                <Briefcase className="w-8 h-8 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Current Role</h3>
                  <p className="text-gray-600 dark:text-gray-400">GNOC IN VAS Engineer at Huawei</p>
                </div>
              </div>
              <div className="glass-card flex items-start gap-4">
                <MapPin className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <Briefcase className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold">Experience</h2>
          </div>
          <div className="space-y-12">
            <div className="relative pl-8 border-l-2 border-purple-600">
              <div className="absolute w-4 h-4 bg-purple-600 rounded-full -left-[9px] top-2 glow-border"></div>
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
            <h2 className="text-4xl md:text-5xl font-bold">Projects</h2>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {['All', 'Mobile', 'Web', 'Data Science'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-btn ${activeFilter === filter ? 'filter-btn-active' : 'filter-btn-inactive'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <div key={index} className="project-card group">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 translate-y-8 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm md:text-base">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/20 text-white backdrop-blur-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a 
                      href={project.github} 
                      target="_blank"
                      className="inline-flex items-center text-white hover:text-purple-300 transition-colors"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View Code
                    </a>
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank"
                        className="inline-flex items-center text-white hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold">Skills & Technologies</h2>
          </div>
          
          <div className="space-y-12">
            {/* Frontend */}
            <div className="skill-category">
              <h3 className="skill-category-title">Frontend Development</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {skills.frontend.map((skill, index) => (
                  <div
                    key={`frontend-${skill}-${index}`}
                    className="skill-item group"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.toLowerCase().replace(/\s+/g, '')}`}
                      alt={skill}
                    />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend & Databases */}
            <div className="skill-category">
              <h3 className="skill-category-title">Backend & Databases</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {skills.backend.map((skill, index) => (
                  <div
                    key={`backend-${skill}-${index}`}
                    className="skill-item group"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.toLowerCase().replace(/\s+/g, '')}`}
                      alt={skill}
                    />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Development */}
            <div className="skill-category">
              <h3 className="skill-category-title">Mobile Development</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {skills.mobile.map((skill, index) => (
                  <div
                    key={`mobile-${skill}-${index}`}
                    className="skill-item group"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.toLowerCase().replace(/\s+/g, '')}`}
                      alt={skill}
                    />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Science */}
            <div className="skill-category">
              <h3 className="skill-category-title">Data Science & Analytics</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {skills.dataScience.map((skill, index) => (
                  <div
                    key={`ds-${skill}-${index}`}
                    className="skill-item group"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.toLowerCase().replace(/\s+/g, '')}`}
                      alt={skill}
                    />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="skill-category">
              <h3 className="skill-category-title">Tools & Platforms</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {skills.tools.map((skill, index) => (
                  <div
                    key={`tools-${skill}-${index}`}
                    className="skill-item group"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.toLowerCase().replace(/\s+/g, '')}`}
                      alt={skill}
                    />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Rocket className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">What I Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="service-card group">
                <div className="service-icon text-purple-600 dark:text-purple-400">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-container">
          <div className="flex items-center gap-4 mb-12">
            <Star className="w-8 h-8 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold">Testimonials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section-container bg-white/5">
          <div className="flex items-center gap-4 mb-12">
            <Send className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Let's work together!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <a href="mailto:falibetasoro@gmail.com" className="hover:text-purple-600 transition-colors">
                    falibetasoro@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-purple-600" />
                  <span>Available for contact</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <span>Côte d'Ivoire</span>
                </div>
              </div>
            </div>
            <form className="space-y-6" onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              console.log('Form submitted:', data);
              alert('Thank you for your message! This is a demo form, but I will receive your message if you email me directly at falibetasoro@gmail.com'); 
            }}>
              <div>
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Your name" required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="your.email@example.com" required />
              </div>
              <div>
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="What's this about?" required />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-textarea" rows={5} placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send className="w-5 h-5 inline-block mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">SFAK</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Data Scientist & Full Stack Developer passionate about transforming data into actionable insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">About</a>
                <a href="#projects" className="block text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Projects</a>
                <a href="#skills" className="block text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Skills</a>
                <a href="#contact" className="block text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="https://github.com/donsfak" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/falibeta-soro-8678b62a1/" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:falibetasoro@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Soro Falibeta. All rights reserved.</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Built with React, TypeScript, Tailwind CSS, and Vite
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
