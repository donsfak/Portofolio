// Portfolio content. Add a project, an experience or a skill here — the sections only render it.
// Text shown to visitors is written in both languages ({ fr, en }).

export type Localized = { fr: string; en: string };

// Section ids, in page order — drive the navbar and the active-section highlight
export const NAV_LINKS = ['about', 'experience', 'projects', 'skills', 'certifications', 'services', 'contact'] as const;

export const CASE_STUDY_DATATOUR = '#/etude-de-cas/data-tour-2026';

export const EMAIL = 'falibetasoro@gmail.com';
export const PHONE = '+225 0779316205';
export const LOCATION = "Abidjan, Côte d'Ivoire";
export const GITHUB_URL = 'https://github.com/donsfak';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/falibeta-soro-8678b62a1/';

// Months of professional experience (Huawei internship) — shown in the stats row
export const EXPERIENCE_MONTHS = 6;

export const ROLES: Localized[] = [
  { fr: 'Data Scientist Junior', en: 'Junior Data Scientist' },
  { fr: 'Apprenant IA · Orange Digital Center', en: 'AI Learner · Orange Digital Center' },
  { fr: 'Développeur Full Stack', en: 'Full Stack Developer' },
  { fr: 'Développeur Mobile', en: 'Mobile Developer' },
];

export interface Project {
  title: Localized; description: Localized; image: string;
  screenshots?: string[]; technologies: string[]; category: 'web' | 'mobile' | 'dataScience';
  github?: string; demo?: string; caseStudy?: string;
}

export type Accent = 'orange' | 'purple' | 'pink';

export interface Experience {
  role: Localized;
  organization: string;
  period: Localized;
  kind: 'work' | 'education';
  accent: Accent;
  bullets: Localized[];
  tags: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    role: { fr: 'Apprenant en Intelligence Artificielle', en: 'Artificial Intelligence Learner' },
    organization: 'Orange Digital Center · Abidjan',
    period: { fr: 'Juillet 2026 – En cours', en: 'July 2026 – Present' },
    kind: 'education',
    accent: 'orange',
    bullets: [
      { fr: 'Programme de formation en Intelligence Artificielle et Machine Learning', en: 'Training program in Artificial Intelligence and Machine Learning' },
      { fr: 'Réalisation de projets IA / ML appliqués, de la préparation des données à l’évaluation des modèles', en: 'Applied AI / ML projects, from data preparation to model evaluation' },
    ],
    tags: ['Python', 'Machine Learning', 'IA', 'Computer Vision'],
  },
  {
    role: { fr: 'GNOC IN VAS Engineer', en: 'GNOC IN VAS Engineer' },
    organization: 'Huawei Technologies',
    period: { fr: 'Juil. – Déc. 2024', en: 'Jul. – Dec. 2024' },
    kind: 'work',
    accent: 'purple',
    bullets: [
      { fr: 'Suivi des tickets et gestion des incidents pour assurer la continuité des services', en: 'Ticket tracking and incident management to ensure service continuity' },
      { fr: 'Gestion proactive des plaintes clients avec résolution rapide et efficace', en: 'Proactive handling of customer complaints with fast, effective resolution' },
      { fr: 'Supervision et maintenance des plateformes AMEA du Groupe Orange', en: 'Monitoring and maintenance of Orange Group AMEA platforms' },
    ],
    tags: ['Python', 'SQL', 'Excel', 'ITIL', 'Linux', 'Monitoring'],
  },
  {
    role: { fr: 'Master Mobiquité, Big Data & Systèmes', en: "Master's in Mobiquity, Big Data & Systems" },
    organization: "ESATIC × Université Côte d'Azur",
    period: { fr: '2024 – En cours', en: '2024 – Present' },
    kind: 'education',
    accent: 'pink',
    bullets: [
      { fr: 'Machine Learning & Intelligence Artificielle', en: 'Machine Learning & Artificial Intelligence' },
      { fr: 'Big Data : Hadoop, architectures distribuées', en: 'Big Data: Hadoop, distributed architectures' },
      { fr: 'Développement web et systèmes embarqués', en: 'Web development and embedded systems' },
    ],
    tags: ['Machine Learning', 'Big Data', 'Flutter', 'Python', 'R', 'Spark'],
  },
];

export const PROJECTS: Project[] = [
  {
    title: { fr: 'FaceGuard — Reconnaissance faciale', en: 'FaceGuard — Face Recognition' },
    description: {
      fr: "Contrôle d'accès par reconnaissance faciale en temps réel (SCRFD, ArcFace, FAISS) : 0 faux positif sur 109 inconnus, EER de 0,10 %. Plateforme web FastAPI avec enrôlement guidé et tableau de bord de présence.",
      en: 'Real-time face recognition access control (SCRFD, ArcFace, FAISS): 0 false positives on 109 unknown people, 0.10% EER. FastAPI web platform with guided enrollment and an attendance dashboard.',
    },
    image: 'assets/faceguard/scanner.webp',
    screenshots: ['assets/faceguard/scanner.webp', 'assets/faceguard/tableau_de_bord.webp', 'assets/faceguard/enrolement.webp', 'assets/faceguard/personnes.webp'],
    technologies: ['Python', 'OpenCV', 'FastAPI', 'Docker', 'ArcFace', 'FAISS', 'Supabase'],
    category: 'dataScience',
    github: 'https://github.com/donsfak/FaceGuard',
    demo: 'details',
  },
  {
    title: { fr: 'Détection de Fraude Mobile Money', en: 'Mobile Money Fraud Detection' },
    description: {
      fr: "Champion national du Data Tour 2026 (Côte d'Ivoire) avec l'équipe OUTLIERS. Détection de fraude sur ~1,3 M de transactions : ensemble de 45 modèles de gradient boosting, target encoding out-of-fold et validation par extrapolation temporelle (métrique : PR-AUC).",
      en: "National champion of Data Tour 2026 (Côte d'Ivoire) with team OUTLIERS. Fraud detection on ~1.3M transactions: an ensemble of 45 gradient boosting models, out-of-fold target encoding and temporal extrapolation validation (metric: PR-AUC).",
    },
    image: 'assets/case-study/equipe-outliers.webp',
    technologies: ['Python', 'LightGBM', 'XGBoost', 'CatBoost'],
    category: 'dataScience',
    caseStudy: CASE_STUDY_DATATOUR,
    github: 'https://github.com/donsfak/Portofolio/blob/main/case-studies/data-tour-2026-fraude-mobile-money.md',
  },
  {
    title: { fr: 'Weather Insights', en: 'Weather Insights' },
    description: {
      fr: "Application météo Flutter complète : prévisions en temps réel, indice de qualité de l'air, indice UV, précipitations et recommandations vestimentaires intelligentes. Mode sombre et animations soignées.",
      en: 'Comprehensive Flutter weather app with real-time forecasts, air quality index, UV index, precipitation data, and smart clothing recommendations. Built with dark mode support and beautiful animations.',
    },
    image: 'assets/weather.webp',
    screenshots: ['assets/weather.webp'],
    technologies: ['Flutter', 'Firebase', 'API', 'ML'],
    category: 'mobile',
    github: 'https://github.com/donsfak/weather_insights',
    demo: 'details',
  },
  {
    title: { fr: 'To Do App', en: 'To Do App' },
    description: {
      fr: "Application de gestion de tâches en Flutter : persistance locale avec SQLite, gestion d'état avec Riverpod et une interface claire pour suivre ses tâches efficacement.",
      en: 'Feature-rich task management app built with Flutter. Implements local persistence with SQLite, state management with Riverpod, and a clean UX for efficient task tracking.',
    },
    image: 'assets/trackers_1.png',
    screenshots: ['assets/trackers_1.png', 'assets/trackers_2.png', 'assets/trackers_3.png'],
    technologies: ['Flutter', 'SQLite', 'Riverpod'],
    category: 'mobile',
    github: 'https://github.com/donsfak/Trackers_app',
    demo: 'details',
  },
];

export type SkillAccent = 'cyan' | 'purple' | 'pink';

export const SKILL_CATEGORIES: { id: string; titleKey: string; accent: SkillAccent; skills: string[] }[] = [
  { id: 'frontend',    titleKey: 'skills.frontend',    accent: 'cyan',   skills: ['react','typescript','tailwind','vite','html','css'] },
  { id: 'backend',     titleKey: 'skills.backend',     accent: 'purple', skills: ['python','fastapi','firebase','supabase','mysql','postgresql','sqlite'] },
  { id: 'mobile',      titleKey: 'skills.mobile',      accent: 'pink',   skills: ['flutter'] },
  { id: 'dataScience', titleKey: 'skills.dataScience', accent: 'cyan',   skills: ['python','opencv','r','tableau'] },
  { id: 'devops',      titleKey: 'skills.devops',      accent: 'purple', skills: ['git','docker','kubernetes','linux','vercel'] },
  { id: 'design',      titleKey: 'skills.design',      accent: 'pink',   skills: ['figma','rive','ai'] },
];

// Distinct technologies across all skill cards — shown in the stats row
export const TECHNOLOGY_COUNT = new Set(SKILL_CATEGORIES.flatMap(c => c.skills)).size;
