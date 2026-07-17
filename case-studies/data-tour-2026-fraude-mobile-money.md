# Prédire la fraude de demain — Champion national · Data Tour 2026 🏆

> **Sous-titre :** Comment une validation « tournée vers le futur » a mené l'équipe OUTLIERS à la 1ʳᵉ place nationale en détection de fraude Mobile Money (Côte d'Ivoire).

---

## TL;DR

Avec l'équipe **OUTLIERS** (3 membres), nous avons remporté la **phase nationale du Data Tour 2026 (Côte d'Ivoire)** en détectant la fraude sur **~1,3 million de transactions Mobile Money**. Le piège du challenge : le jeu de test se situait **dans le futur** — la validation croisée classique aurait donné des scores flatteurs mais trompeurs. Nous avons donc construit toute notre méthodologie autour de l'**extrapolation temporelle** : validation multi-fenêtres « entraîner sur le passé, valider sur le futur », target encoding out-of-fold anti-fuite, et un ensemble de 45 modèles de gradient boosting.

---

## 1. Contexte & Problème

Le **Data Tour** est une compétition de data science panafricaine. Pour la phase nationale ivoirienne de l'édition 2026, le sujet était un problème très concret pour l'économie de la région : **détecter les transactions frauduleuses sur une plateforme de Mobile Money**.

L'enjeu métier est réel : le Mobile Money est le premier moyen de paiement électronique en Afrique de l'Ouest. Chaque fraude non détectée coûte de l'argent à l'opérateur et à ses clients ; chaque fausse alerte dégrade l'expérience d'un client légitime. Le modèle doit donc être **précis dans les deux sens** — d'où le choix d'une métrique adaptée (voir plus bas).

- **Équipe :** OUTLIERS — 3 membres
- **Mon rôle :** [À COMPLÉTER : ex. feature engineering & modélisation]
- **Résultat :** 🥇 **Champion national** (1ʳᵉ place, phase nationale, Côte d'Ivoire)

---

## 2. Données & Défi

| Caractéristique | Détail |
|---|---|
| Volume | ~1,3 M de transactions |
| Cible | Transaction frauduleuse (oui/non) |
| Déséquilibre | ~11 % de fraude — les classes sont fortement déséquilibrées |
| Métrique | **PR-AUC** (average precision) |
| Particularité | Le jeu de test est **postérieur dans le temps** au jeu d'entraînement |

Deux difficultés dominaient le problème :

**Le déséquilibre de classes.** Avec ~11 % de fraude, un modèle naïf peut afficher une accuracy élevée en se trompant sur l'essentiel. La métrique retenue, la **PR-AUC**, se concentre précisément sur la qualité du classement des cas positifs : elle récompense un modèle capable de placer les fraudes en tête de liste sans noyer les analystes sous les fausses alertes.

**L'extrapolation temporelle.** Le test était **dans le futur** par rapport à l'entraînement. C'est le scénario réel d'un modèle en production — on prédit toujours demain avec les données d'hier — mais c'est aussi un piège méthodologique : les comportements de fraude évoluent, et une validation qui mélange le temps (comme la validation croisée aléatoire) surestime systématiquement la performance. **Ce défi a dicté presque toutes nos décisions techniques.**

---

## 3. Démarche

Notre pipeline, de bout en bout :

```
Données brutes (~1,3 M transactions)
        │
        ▼
1. Exploration & analyse temporelle
   └─ Découverte : 100 % de la fraude concentrée dans un seul type
      d'opération, structure stable dans le temps → filet de sécurité
        │
        ▼
2. Feature engineering — ~50 variables, 7 familles
   └─ anomalies de solde · ratios · profils de comptes · vélocité ·
      patterns de fraude connus · target encoding out-of-fold
        │
        ▼
3. Modélisation — ensemble de gradient boosting
   └─ LightGBM (dominant) + XGBoost + CatBoost, seed averaging
      → 45 modèles au total
        │
        ▼
4. Validation par extrapolation temporelle (multi-fenêtres)
   └─ entraîner sur le passé → valider sur le futur éloigné
        │
        ▼
5. Analyse statistique du bruit (bootstrap)
   └─ distinguer les vraies améliorations du hasard
```

### Exploration : trouver la structure avant de modéliser

Avant toute modélisation, nous avons passé du temps sur l'analyse exploratoire — et elle a payé : **la totalité de la fraude se concentrait dans un seul type d'opération**, et cette structure restait **stable dans le temps**. Cette découverte a servi de **filet de sécurité** : elle borne le problème, élimine mécaniquement une partie des faux positifs et sécurise le comportement du modèle sur des données futures.

### Feature engineering : ~50 variables en 7 familles

Plutôt que de générer des features en masse, nous avons travaillé par **hypothèses métier**, organisées en familles : anomalies de solde (incohérences avant/après transaction), ratios de montants, profils de comptes, vélocité des opérations, et signatures de schémas de fraude connus.

L'**insight majeur** de la compétition : le signal le plus fort n'était pas dans les montants mais dans **l'identité des comptes** — certains comptes concentraient la fraude. Exploiter ce signal sans tricher demandait une technique précise (voir Décision n°2 ci-dessous).

### Modélisation : un ensemble qui privilégie la stabilité

Trois algorithmes de gradient boosting — **LightGBM** (contributeur dominant), **XGBoost** et **CatBoost** — combinés en ensemble, chacun entraîné avec plusieurs seeds (**seed averaging**), pour un total de **45 modèles**. L'objectif n'était pas la sophistication, mais la **réduction de la variance** : sur un test futur et bruité, la stabilité bat l'exploit ponctuel.

---

## 4. Décisions techniques clés — et leur pourquoi

### Décision 1 — Valider par extrapolation temporelle, pas par validation croisée

**Le quoi :** notre « boussole » : entraîner sur le passé, valider sur une fenêtre de futur *éloigné*, et répéter sur plusieurs découpages temporels (multi-fenêtres).

**Le pourquoi :** la validation croisée aléatoire mélange passé et futur — le modèle « voit » indirectement des comportements postérieurs à ceux qu'il doit prédire, et le score de validation devient trop optimiste. Comme le test réel était dans le futur, une CV classique nous aurait fait **sélectionner les mauvais modèles avec confiance**. Valider dans les mêmes conditions que le test (et que la production) est le seul moyen d'avoir une estimation honnête. Le multi-fenêtres ajoute une garantie : une amélioration devait être robuste sur *plusieurs* horizons futurs, pas sur un seul découpage chanceux.

### Décision 2 — Target encoding *out-of-fold* sur l'identité des comptes

**Le quoi :** encoder les comptes par leur taux de fraude historique, mais calculé **out-of-fold** : la valeur encodée d'une transaction ne dépend jamais de son propre label.

**Le pourquoi :** l'identité des comptes était le signal n°1 — mais un target encoding naïf fait **fuiter le label dans les features** (la réponse est cachée dans la question). Le modèle paraît excellent en entraînement puis s'effondre sur les nouvelles données. La version out-of-fold capture le vrai signal (« ce compte a un historique de fraude ») sans contamination. C'est la différence entre exploiter une information et tricher avec.

### Décision 3 — Ensemble de 3 algorithmes + seed averaging (45 modèles)

**Le quoi :** moyenne des prédictions de LightGBM, XGBoost et CatBoost, chacun décliné sur plusieurs seeds.

**Le pourquoi :** chaque algorithme fait des erreurs différentes ; les moyenner **annule une partie des erreurs décorrélées**. Le seed averaging traite une autre source de bruit : deux entraînements du même modèle avec des seeds différents peuvent diverger sensiblement. Sur un classement où quelques décimales séparent les équipes, réduire cette variance aléatoire est un gain quasi gratuit — et surtout, il **fiabilise la généralisation** sur le test futur.

### Décision 4 — Le filet de sécurité structurel (un seul type d'opération)

**Le quoi :** exploiter la découverte que 100 % de la fraude se trouvait dans un type d'opération, stable dans le temps.

**Le pourquoi :** en machine learning appliqué, une **contrainte structurelle vérifiée** vaut mieux qu'une prédiction probabiliste. Ce filet borne le risque : quelle que soit la dérive du modèle sur les données futures, les transactions hors périmètre sont sûres. C'est aussi un réflexe de production : les règles métier robustes et les modèles statistiques se complètent.

### Décision 5 — Mesurer le bruit du classement avant de croire une amélioration (bootstrap)

**Le quoi :** ré-échantillonner nos prédictions (bootstrap) pour estimer l'incertitude de notre score PR-AUC, et comparer les variantes de modèles **à l'aune de cette incertitude**.

**Le pourquoi :** sur un leaderboard, il est tentant d'itérer en soumettant et de garder « ce qui monte ». Mais une partie des variations n'est que du bruit d'échantillonnage : croire ces fluctuations, c'est faire de l'**overfitting au classement public**. Le bootstrap nous donnait un ordre de grandeur du bruit — une amélioration inférieure à ce seuil était ignorée, quelle que soit sa séduction. Décider avec des barres d'erreur plutôt qu'avec des espoirs.

### Décision 6 — Reproductibilité totale du pipeline

**Le quoi :** pipeline déterministe de bout en bout — seeds fixés partout, contrôle du threading (certaines opérations parallèles introduisent du non-déterminisme), environnement figé.

**Le pourquoi :** sans reproductibilité, impossible d'attribuer une variation de score à un changement de code plutôt qu'au hasard — donc impossible d'itérer rationnellement. Nous l'avons appris pendant la compétition : quelques résultats non reproductibles ont suffi à nous convaincre d'investir dans le déterminisme. C'est une leçon qui vaut bien au-delà des compétitions.

---

## 5. Résultats

- 🥇 **1ʳᵉ place de la phase nationale** du Data Tour 2026 (Côte d'Ivoire), sur la métrique PR-AUC.
- Un score **stable entre nos validations internes et le classement final** — la démonstration que la boussole d'extrapolation temporelle donnait une estimation honnête, là où une CV classique nous aurait trompés.
- Un pipeline **entièrement reproductible**, du feature engineering à la soumission.

> Au-delà du classement, le vrai résultat est méthodologique : **nous n'avons jamais été surpris par le test final.** C'est, en pratique, la définition d'une validation bien construite.

---

## 6. Ce que j'ai appris

1. **La validation est la décision la plus importante d'un projet ML.** Avant les features, avant le modèle. Si la validation ne reproduit pas les conditions réelles (ici : prédire le futur), tout le reste repose sur du sable.
2. **Les fuites de données sont silencieuses et flatteuses.** Le target encoding naïf améliorait nos scores d'entraînement — c'est précisément pour ça qu'il était dangereux. Réflexe acquis : toute feature construite à partir de la cible doit être out-of-fold.
3. **Distinguer le signal du bruit est une compétence statistique, pas une intuition.** Le bootstrap nous a évité de courir après des améliorations imaginaires.
4. **L'exploration paie.** La découverte de la concentration de la fraude dans un type d'opération — un fait simple, trouvé en regardant les données — a autant compté que les 45 modèles.
5. **La reproductibilité n'est pas un luxe d'ingénieur.** C'est la condition pour pouvoir raisonner sur ses propres résultats.

---

## 7. Visuels à ajouter

| Visuel | Légende proposée |
|---|---|
| **Diagramme du pipeline** (données → features → ensemble → validation) | « Pipeline de bout en bout : chaque étape est validée par extrapolation temporelle avant d'intégrer la solution finale. » |
| **Schéma de la validation temporelle** (frise : fenêtres d'entraînement passées → fenêtres de validation futures, en plusieurs découpages) | « La "boussole" : entraîner sur le passé, valider sur le futur éloigné, répéter sur plusieurs fenêtres. La validation croisée classique (mélange temporel) aurait surestimé nos scores. » |
| **Courbe précision-rappel** du modèle final vs baseline | « Sur des classes déséquilibrées (~11 % de fraude), la courbe PR montre ce que l'accuracy cache : la capacité à classer les fraudes en tête sans multiplier les fausses alertes. » |
| **Importance des familles de features** (barres, par famille) | « Le signal dominant : l'identité des comptes (target encoding out-of-fold), suivie des anomalies de solde. » |
| **Tableau scores validation interne vs classement final** | « L'écart minime entre notre validation interne et le score final valide la méthodologie : pas de mauvaise surprise au moment du test. » |
| **Distribution bootstrap du score** (histogramme avec intervalle) | « Le bruit du classement, quantifié : toute "amélioration" à l'intérieur de cet intervalle est indistinguable du hasard. » |

---

## 8. Compétences démontrées

`Machine Learning` `Détection de fraude` `Classes déséquilibrées` `PR-AUC`
`Feature Engineering` `Target Encoding (out-of-fold)` `Prévention des fuites de données`
`Validation temporelle` `Extrapolation` `LightGBM` `XGBoost` `CatBoost`
`Ensembling` `Seed Averaging` `Bootstrap` `Rigueur statistique`
`Reproductibilité` `Python` `Travail en équipe` `Compétition de data science`

---
---

## 📇 Version courte — carte projet (page d'accueil)

> **🏆 Détection de fraude Mobile Money — Champion national, Data Tour 2026**
>
> 1ʳᵉ place nationale (Côte d'Ivoire) sur ~1,3 M de transactions avec l'équipe OUTLIERS.
> Ensemble de 45 modèles de gradient boosting (LightGBM, XGBoost, CatBoost), target encoding
> out-of-fold anti-fuite et validation par extrapolation temporelle multi-fenêtres (métrique : PR-AUC).
>
> **Tags :** `Machine Learning` `Fraud Detection` `LightGBM` `Ensembling` `Validation temporelle` `PR-AUC`
