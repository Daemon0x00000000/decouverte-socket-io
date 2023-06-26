# **Projet de Chat avec Socket IO**

Ce projet est une démonstration simple d'un chat en temps réel utilisant Socket IO. Il a été créé dans un but purement de découverte et peut servir de point de départ pour des projets plus avancés. Veuillez noter que certaines parties du projet, notamment l'intégration de Firebase et la gestion de la clé API, ne sont pas correctement implémentées, car le développement s'est limité à une durée de 3 heures en se basant sur la documentation de Socket IO.

## **Fonctionnalités**

- Authentification avec Firebase
- Connexion en temps réel avec plusieurs utilisateurs.
- Envoi et réception de messages en temps réel.
- Système de rooms

## **Prérequis**

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- Node.js (version 18.16.X)
- PNPM (version 8.6.2)

## **Installation**

1. Clonez ce dépôt sur votre machine locale :

```

git clone https://github.com/Daemon0x00000000/decouverte-socket-io.git

```

1. Accédez au répertoire du projet :

```

cd decouverte-socket-io

```

1. Installez les dépendances du projet à l'aide de NPM :

```

pnpm install

```

## **Utilisation**

1. Lancez l'application en exécutant la commande suivante :

```

pnpm start

```

1. Ouvrez votre navigateur et accédez à l'URL suivante : **`http://localhost:5173`**.
2. Vous pouvez maintenant commencer à utiliser le chat en temps réel. Ouvrez plusieurs fenêtres ou onglets dans votre navigateur pour simuler différentes connexions utilisateurs.

## **Limitations connues**

- Ce projet utilise une communication avec l'API REST d'Identity Tools de Firebase plutôt que d'intégrer le SDK de Firebase. Veuillez noter que cette approche peut avoir des limitations par rapport à une intégration complète du SDK de Firebase. Assurez-vous de bien comprendre les différences et d'adapter le code en conséquence si vous décidez d'utiliser cette approche dans un projet réel.
- D'autres aspects du projet, tels que la gestion des erreurs et la sécurité, ne sont pas correctement mis en place étant donné le temps de développement limité.
- Le code de ce projet n'est pas suffisamment segmenté et pourrait bénéficier d'un refactoring pour améliorer sa clarté et sa maintenabilité. De plus, veuillez noter que certaines parties du projet, notamment l'intégration de Firebase et la gestion de la clé API, ne sont pas correctement implémentées en raison du temps de développement limité.

N'hésitez pas à apporter des modifications et à adapter le projet en fonction de vos besoins spécifiques.
