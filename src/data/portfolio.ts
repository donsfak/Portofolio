// Portfolio content. Add a project or an experience here — App.tsx only renders it.

export const CASE_STUDY_DATATOUR = '#/etude-de-cas/data-tour-2026';

export interface Project {
  title: string; description: string; image: string;
  screenshots?: string[]; technologies: string[]; category: 'web' | 'mobile' | 'dataScience';
  github?: string; demo?: string; caseStudy?: string;
}

export type Accent = 'orange' | 'purple' | 'pink';

export interface Experience {
  role: string;
  organization: string;
  period: string;
  kind: 'work' | 'education';
  accent: Accent;
  bullets: string[];
  tags: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    role: 'Apprenant en Intelligence Artificielle',
    organization: 'Orange Digital Center · Abidjan',
    period: 'Juillet 2026 – En cours',
    kind: 'education',
    accent: 'orange',
    bullets: [
      'Programme de formation en Intelligence Artificielle et Machine Learning',
      'Réalisation de projets IA / ML appliqués, de la préparation des données à l’évaluation des modèles',
    ],
    tags: ['Python', 'Machine Learning', 'IA', 'Computer Vision'],
  },
  {
    role: 'GNOC IN VAS Engineer',
    organization: 'Huawei Technologies',
    period: 'Juil. – Déc. 2024',
    kind: 'work',
    accent: 'purple',
    bullets: [
      'Suivi des tickets et gestion des incidents pour assurer la continuité des services',
      'Gestion proactive des plaintes clients avec résolution rapide et efficace',
      'Supervision et maintenance des plateformes AMEA du Groupe Orange',
    ],
    tags: ['Python', 'SQL', 'Excel', 'ITIL', 'Linux', 'Monitoring'],
  },
  {
    role: 'Master Mobiquité, Big Data & Systèmes',
    organization: "ESATIC × Université Côte d'Azur",
    period: '2024 – En cours',
    kind: 'education',
    accent: 'pink',
    bullets: [
      'Machine Learning & Intelligence Artificielle',
      'Big Data : Hadoop, architectures distribuées',
      'Développement web et systèmes embarqués',
    ],
    tags: ['Machine Learning', 'Big Data', 'Flutter', 'Python', 'R', 'Spark'],
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'FaceGuard — Reconnaissance faciale',
    description: "Contrôle d'accès par reconnaissance faciale en temps réel (SCRFD, ArcFace, FAISS) : 0 faux positif sur 109 inconnus, EER de 0,10 %. Plateforme web FastAPI avec enrôlement guidé et tableau de bord de présence.",
    image: 'assets/faceguard/scanner.webp',
    screenshots: ['assets/faceguard/scanner.webp', 'assets/faceguard/tableau_de_bord.webp', 'assets/faceguard/enrolement.webp', 'assets/faceguard/personnes.webp'],
    technologies: ['Python', 'OpenCV', 'FastAPI', 'Docker', 'ArcFace', 'FAISS', 'Supabase'],
    category: 'dataScience',
    github: 'https://github.com/donsfak/FaceGuard',
    demo: 'details',
  },
  { title: 'Détection de Fraude Mobile Money', description: "Champion national du Data Tour 2026 (Côte d'Ivoire) avec l'équipe OUTLIERS. Détection de fraude sur ~1,3 M de transactions : ensemble de 45 modèles de gradient boosting, target encoding out-of-fold et validation par extrapolation temporelle (métrique : PR-AUC).", image: 'assets/case-study/equipe-outliers.webp', technologies: ['Python','LightGBM','XGBoost','CatBoost'], category: 'dataScience', caseStudy: CASE_STUDY_DATATOUR, github: 'https://github.com/donsfak/Portofolio/blob/main/case-studies/data-tour-2026-fraude-mobile-money.md' },
  { title: 'Weather Insights', description: 'Comprehensive Flutter weather app with real-time forecasts, air quality index, UV index, precipitation data, and smart clothing recommendations. Built with dark mode support and beautiful animations.', image: 'assets/weather.webp', screenshots: ['assets/weather.webp'], technologies: ['Flutter','Firebase','API','ML'], category: 'mobile', github: 'https://github.com/donsfak/weather_insights', demo: 'details' },
  { title: 'To Do App',        description: 'Feature-rich task management app built with Flutter. Implements local persistence with SQLite, state management with Riverpod, and a clean UX for efficient task tracking.',                             image: 'assets/trackers_1.png', screenshots: ['assets/trackers_1.png','assets/trackers_2.png','assets/trackers_3.png'], technologies: ['Flutter','SQLite','Riverpod'], category: 'mobile', github: 'https://github.com/donsfak/Trackers_app', demo: 'details' },
];
