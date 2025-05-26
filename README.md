#  Application de Notes avec Recherche
Ce projet a pour but de développer une application de prise de notes simple, interactive et fonctionnelle. L’utilisateur peut :

    Créer des notes avec un titre et un contenu.

    Rechercher des notes par mot-clé dans le titre ou le contenu.

    Filtrer les notes par date de création (cette semaine, ce mois, etc.).

    Modifier ou supprimer une note existante.

    Sauvegarder automatiquement les notes dans le localStorage du navigateur pour une conservation entre les sessions.

L'objectif principal est de fournir une interface claire et intuitive pour gérer facilement des notes personnelles.

##  Fonctionnalités

- *Création de notes* avec un titre, un contenu et une date d’enregistrement automatique.
- *Recherche dynamique* par mot-clé (dans le titre ou le contenu).
- *Filtrage par date* :
  - Aujourd’hui
  - Cette semaine
  - Ce mois-ci
- *Modification et suppression* de notes existantes.
- *Stockage local* avec localStorage (pas besoin de base de données).
- *Interface simple et responsive* avec des boutons clairs pour chaque action.

##  Démonstration

![Interface principale](assets\interface.png)
Interface principale du app

![Ajout d'une note](assets\Ajout.png)
Ajout d’une nouvelle note avec titre et contenu

![Recherche](assets\Recherche.png)
Recherche d’une note par mot-clé

![Filtrage](assets\Filtrage.png)
Filtrage des notes de cette semaine

##  Structure du projet
notes-app/
├── index.html         # Interface utilisateur
├── style.css          # Styles de l’application
├── script.js          # Logique JavaScript
├── README.md          # Ce fichier
└── assets/            # Captures d'écran et vidéos de démonstration

##  Technologies utilisées

- *HTML5* – structure de l’application
- *CSS3* – style responsive et clair
- *JavaScript (vanilla)* – logique fonctionnelle et interaction
- *localStorage* – stockage persistant côté navigateur

##  Comment exécuter l'application

1. *Cloner le dépôt* :
   ```bash
   git clone https://github.com/Laila-004/app-notes-recherche.git
   cd app-notes-recherche
   code .
2. **Ouvrez le fichier index.html dans un navigateur moderne (Chrome, Firefox, Edge...).

3. **Commencez à créer, modifier ou rechercher vos notes.

Aucune installation supplémentaire n’est nécessaire, l’application fonctionne entièrement en local dans le navigateur.