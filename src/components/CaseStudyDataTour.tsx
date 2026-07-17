import { useEffect } from 'react';
import {
  ArrowLeft, Trophy, Users, Database, Target, Clock, CheckCircle2,
  Lightbulb, FlaskConical, GitBranch, ShieldCheck, BarChart3, Repeat,
} from 'lucide-react';

const DECISIONS = [
  {
    icon: <Clock className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-500/10',
    title: 'Valider par extrapolation temporelle, pas par validation croisée',
    quoi: 'Notre « boussole » : entraîner sur le passé, valider sur une fenêtre de futur éloigné, et répéter sur plusieurs découpages temporels (multi-fenêtres).',
    pourquoi: 'La validation croisée aléatoire mélange passé et futur : le modèle « voit » indirectement des comportements postérieurs à ceux qu\'il doit prédire, et le score devient trop optimiste. Comme le test réel était dans le futur, une CV classique nous aurait fait sélectionner les mauvais modèles avec confiance. Le multi-fenêtres ajoute une garantie : une amélioration devait être robuste sur plusieurs horizons futurs, pas sur un seul découpage chanceux.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-pink-500" />,
    bg: 'bg-pink-500/10',
    title: 'Target encoding out-of-fold sur l\'identité des comptes',
    quoi: 'Encoder les comptes par leur taux de fraude historique, calculé out-of-fold : la valeur encodée d\'une transaction ne dépend jamais de son propre label.',
    pourquoi: 'L\'identité des comptes était le signal n°1 — mais un target encoding naïf fait fuiter le label dans les features. Le modèle paraît excellent en entraînement puis s\'effondre sur les nouvelles données. La version out-of-fold capture le vrai signal sans contamination : c\'est la différence entre exploiter une information et tricher avec.',
  },
  {
    icon: <GitBranch className="w-5 h-5 text-cyan-500" />,
    bg: 'bg-cyan-500/10',
    title: 'Ensemble de 3 algorithmes + seed averaging (45 modèles)',
    quoi: 'Moyenne des prédictions de LightGBM (dominant), XGBoost et CatBoost, chacun décliné sur plusieurs seeds.',
    pourquoi: 'Chaque algorithme fait des erreurs différentes ; les moyenner annule une partie des erreurs décorrélées. Le seed averaging traite une autre source de bruit : la variance d\'entraînement. Sur un classement où quelques décimales séparent les équipes, réduire cette variance est un gain quasi gratuit — et surtout, il fiabilise la généralisation sur le test futur.',
  },
  {
    icon: <Target className="w-5 h-5 text-green-500" />,
    bg: 'bg-green-500/10',
    title: 'Le filet de sécurité structurel',
    quoi: 'L\'exploration a révélé que 100 % de la fraude se concentrait dans un seul type d\'opération, stable dans le temps — exploité comme contrainte.',
    pourquoi: 'En ML appliqué, une contrainte structurelle vérifiée vaut mieux qu\'une prédiction probabiliste. Ce filet borne le risque : quelle que soit la dérive du modèle sur les données futures, les transactions hors périmètre sont sûres. Les règles métier robustes et les modèles statistiques se complètent.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-orange-500" />,
    bg: 'bg-orange-500/10',
    title: 'Mesurer le bruit avant de croire une amélioration (bootstrap)',
    quoi: 'Ré-échantillonner nos prédictions (bootstrap) pour estimer l\'incertitude du score PR-AUC, et comparer les variantes de modèles à l\'aune de cette incertitude.',
    pourquoi: 'Sur un leaderboard, garder « ce qui monte » revient souvent à courir après du bruit d\'échantillonnage — de l\'overfitting au classement public. Le bootstrap donnait un ordre de grandeur du bruit : toute amélioration inférieure à ce seuil était ignorée. Décider avec des barres d\'erreur plutôt qu\'avec des espoirs.',
  },
  {
    icon: <Repeat className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-500/10',
    title: 'Reproductibilité totale du pipeline',
    quoi: 'Pipeline déterministe de bout en bout : seeds fixés partout, contrôle du threading, environnement figé.',
    pourquoi: 'Sans reproductibilité, impossible d\'attribuer une variation de score à un changement de code plutôt qu\'au hasard — donc impossible d\'itérer rationnellement. Quelques résultats non reproductibles en début de compétition ont suffi à nous convaincre d\'investir dans le déterminisme.',
  },
];

const LESSONS = [
  'La validation est la décision la plus importante d\'un projet ML — avant les features, avant le modèle. Si elle ne reproduit pas les conditions réelles (ici : prédire le futur), tout le reste repose sur du sable.',
  'Les fuites de données sont silencieuses et flatteuses : le target encoding naïf améliorait nos scores d\'entraînement — c\'est précisément pour ça qu\'il était dangereux.',
  'Distinguer le signal du bruit est une compétence statistique, pas une intuition : le bootstrap nous a évité de courir après des améliorations imaginaires.',
  'L\'exploration paie : la concentration de la fraude dans un type d\'opération — un fait simple, trouvé en regardant les données — a autant compté que les 45 modèles.',
  'La reproductibilité n\'est pas un luxe d\'ingénieur : c\'est la condition pour pouvoir raisonner sur ses propres résultats.',
];

const SKILLS = [
  'Machine Learning', 'Détection de fraude', 'Classes déséquilibrées', 'PR-AUC',
  'Feature Engineering', 'Target Encoding (OOF)', 'Anti-fuite de données',
  'Validation temporelle', 'LightGBM', 'XGBoost', 'CatBoost', 'Ensembling',
  'Seed Averaging', 'Bootstrap', 'Reproductibilité', 'Python', 'Travail en équipe',
];

const PIPELINE = [
  { step: '01', label: 'Exploration & analyse temporelle', detail: 'Découverte clé : toute la fraude concentrée dans un seul type d\'opération, structure stable dans le temps.' },
  { step: '02', label: 'Feature engineering — ~50 variables, 7 familles', detail: 'Anomalies de solde, ratios, profils de comptes, vélocité, patterns connus, target encoding out-of-fold.' },
  { step: '03', label: 'Modélisation — ensemble de gradient boosting', detail: 'LightGBM (dominant) + XGBoost + CatBoost avec seed averaging → 45 modèles.' },
  { step: '04', label: 'Validation par extrapolation temporelle', detail: 'Entraîner sur le passé, valider sur le futur éloigné, multi-fenêtres.' },
  { step: '05', label: 'Analyse statistique du bruit', detail: 'Bootstrap du score pour distinguer les vraies améliorations du hasard.' },
];

export function CaseStudyDataTour({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    document.title = 'Data Tour 2026 — Étude de cas | Soro Falibeta';
    return () => { document.title = 'Soro Falibeta | Data Scientist & Full Stack Developer'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-gray-50 dark:bg-[#080810] text-gray-900 dark:text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 glass border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au portfolio
          </button>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Étude de cas</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Hero */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
              <Trophy className="w-3.5 h-3.5" /> Champion national
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20">
              Data Tour 2026 · Côte d'Ivoire
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Prédire la fraude de <span className="gradient-text">demain</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Comment une validation « tournée vers le futur » a mené l'équipe OUTLIERS à la 1ʳᵉ place
            nationale en détection de fraude Mobile Money.
          </p>
        </header>

        {/* TL;DR */}
        <div className="glass rounded-2xl p-6 mb-12 border-l-4 !border-l-purple-500">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">TL;DR</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Avec l'équipe <strong>OUTLIERS</strong> (3 membres), nous avons remporté la phase nationale du
            Data Tour 2026 en détectant la fraude sur <strong>~1,3 million de transactions Mobile Money</strong>.
            Le piège du challenge : le jeu de test se situait <strong>dans le futur</strong> — la validation croisée
            classique aurait donné des scores flatteurs mais trompeurs. Nous avons donc tout construit autour de
            l'<strong>extrapolation temporelle</strong> : validation multi-fenêtres, target encoding out-of-fold
            anti-fuite, et un ensemble de 45 modèles de gradient boosting.
          </p>
        </div>

        {/* Key figures */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: <Trophy className="w-5 h-5 text-yellow-500" />, val: '1ʳᵉ', label: 'Place nationale' },
            { icon: <Database className="w-5 h-5 text-cyan-500" />, val: '1,3 M', label: 'Transactions' },
            { icon: <GitBranch className="w-5 h-5 text-purple-500" />, val: '45', label: 'Modèles en ensemble' },
            { icon: <Users className="w-5 h-5 text-pink-500" />, val: '3', label: 'Membres · OUTLIERS' },
          ].map(({ icon, val, label }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">{icon}</div>
              <div className="text-2xl font-bold gradient-text">{val}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Contexte */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="section-icon bg-purple-500/10"><Lightbulb className="w-5 h-5 text-purple-500" /></span>
            Contexte & Problème
          </h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Le <strong>Data Tour</strong> est une compétition de data science panafricaine (la « Coupe d'Afrique
              des Nations de Science de Données »). Pour la phase nationale ivoirienne de l'édition 2026, le sujet
              était un problème très concret pour l'économie de la région : <strong>détecter les transactions
              frauduleuses sur une plateforme de Mobile Money</strong>.
            </p>
            <p>
              L'enjeu métier est réel : le Mobile Money est le premier moyen de paiement électronique en Afrique de
              l'Ouest. Chaque fraude non détectée coûte de l'argent à l'opérateur et à ses clients ; chaque fausse
              alerte dégrade l'expérience d'un client légitime. Le modèle doit être précis dans les deux sens.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Mon rôle :</strong> modélisation & expérimentation — construction et test des modèles,
              pilotage des itérations, avec une contribution au feature engineering et à la méthodologie de validation.
            </p>
          </div>
        </section>

        {/* Données & défi */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="section-icon bg-cyan-500/10"><Database className="w-5 h-5 text-cyan-500" /></span>
            Données & Défi
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {[
              { k: 'Volume', v: '~1,3 M de transactions' },
              { k: 'Déséquilibre', v: '~11 % de fraude' },
              { k: 'Métrique', v: 'PR-AUC (average precision)' },
              { k: 'Particularité', v: 'Test postérieur dans le temps' },
            ].map(({ k, v }) => (
              <div key={k} className="glass rounded-xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{k}</p>
                <p className="text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              <strong>Le déséquilibre de classes.</strong> Avec ~11 % de fraude, un modèle naïf peut afficher une
              accuracy élevée en se trompant sur l'essentiel. La <strong>PR-AUC</strong> se concentre sur la qualité
              du classement des cas positifs : elle récompense un modèle capable de placer les fraudes en tête de
              liste sans noyer les analystes sous les fausses alertes.
            </p>
            <p>
              <strong>L'extrapolation temporelle.</strong> Le test était dans le futur par rapport à l'entraînement.
              C'est le scénario réel d'un modèle en production — on prédit toujours demain avec les données d'hier —
              mais c'est aussi un piège méthodologique : une validation qui mélange le temps surestime
              systématiquement la performance. <strong>Ce défi a dicté presque toutes nos décisions techniques.</strong>
            </p>
          </div>
        </section>

        {/* Démarche / pipeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="section-icon bg-pink-500/10"><FlaskConical className="w-5 h-5 text-pink-500" /></span>
            Démarche
          </h2>
          <div className="relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500" />
            <div className="space-y-4">
              {PIPELINE.map(({ step, label, detail }) => (
                <div key={step} className="relative pl-12">
                  <span className="absolute left-0 top-1 w-10 h-10 rounded-full glass flex items-center justify-center text-xs font-bold gradient-text">
                    {step}
                  </span>
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm font-bold mb-1">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figure className="mt-8">
            <img src="/assets/case-study/courbes-pr.webp" alt="Courbes précision-rappel out-of-fold des trois modèles"
              className="rounded-2xl border border-gray-200 dark:border-white/10 w-full bg-white" loading="lazy" />
            <figcaption className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
              Courbes précision-rappel (out-of-fold) des trois modèles de l'ensemble face à la baseline aléatoire.
              Sur des classes déséquilibrées, c'est cette courbe — pas l'accuracy — qui révèle la capacité à classer
              les fraudes en tête sans multiplier les fausses alertes.
            </figcaption>
          </figure>
        </section>

        {/* Décisions techniques */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span className="section-icon bg-orange-500/10"><Target className="w-5 h-5 text-orange-500" /></span>
            Décisions techniques clés
          </h2>
          <p className="text-sm text-gray-500 mb-6">Pour chaque décision : le quoi, et surtout le pourquoi.</p>
          <div className="space-y-4">
            {DECISIONS.map(({ icon, bg, title, quoi, pourquoi }, i) => (
              <div key={title} className="glass rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className={`p-2 rounded-lg ${bg} flex-shrink-0`}>{icon}</span>
                  <h3 className="text-sm font-bold leading-snug pt-1.5">{i + 1}. {title}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Le quoi — </span>{quoi}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="font-bold text-purple-600 dark:text-purple-400">Le pourquoi — </span>{pourquoi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Résultats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="section-icon bg-yellow-500/10"><Trophy className="w-5 h-5 text-yellow-500" /></span>
            Résultats
          </h2>
          <ul className="space-y-2.5 mb-6">
            {[
              '1ʳᵉ place de la phase nationale du Data Tour 2026 (Côte d\'Ivoire), sur la métrique PR-AUC.',
              'Un score stable entre nos validations internes et le classement final — la preuve que la boussole d\'extrapolation temporelle donnait une estimation honnête.',
              'Un pipeline entièrement reproductible, du feature engineering à la soumission.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
          <blockquote className="glass rounded-2xl p-5 border-l-4 !border-l-yellow-500 text-sm text-gray-700 dark:text-gray-300 italic mb-8">
            Au-delà du classement, le vrai résultat est méthodologique : nous n'avons jamais été surpris par le
            test final. C'est, en pratique, la définition d'une validation bien construite.
          </blockquote>
          <div className="grid sm:grid-cols-2 gap-4 items-start">
            <figure>
              <img src="/assets/case-study/certificat-data-tour.webp" alt="Certificat d'Excellence — 1ère place, phase nationale du Data Tour 2026"
                className="rounded-2xl border border-gray-200 dark:border-white/10 w-full" loading="lazy" />
              <figcaption className="text-xs text-gray-500 text-center mt-2">
                Certificat d'Excellence — 1ʳᵉ place au classement général de la phase nationale.
              </figcaption>
            </figure>
            <figure>
              <img src="/assets/case-study/equipe-outliers.webp" alt="Équipe OUTLIERS — Data Tour 2026, Côte d'Ivoire"
                className="rounded-2xl border border-gray-200 dark:border-white/10 w-full" loading="lazy" />
              <figcaption className="text-xs text-gray-500 text-center mt-2">
                L'équipe OUTLIERS : Ake Mobio Ivan junior, Soro Falibeta, Djibo Hamidou.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Leçons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="section-icon bg-green-500/10"><Lightbulb className="w-5 h-5 text-green-500" /></span>
            Ce que j'ai appris
          </h2>
          <ol className="space-y-3">
            {LESSONS.map((lesson, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {lesson}
              </li>
            ))}
          </ol>
        </section>

        {/* Compétences */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Compétences démontrées</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <span key={skill} className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Footer nav */}
        <div className="pt-8 border-t border-gray-100 dark:border-white/[0.05] flex justify-center">
          <button onClick={onBack} className="btn-secondary text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au portfolio
          </button>
        </div>
      </article>
    </div>
  );
}
