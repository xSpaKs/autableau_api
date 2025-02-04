# API de Gestion des Classes et des Soutenances
Cette API permet de gérer des classes d'étudiants et d'organiser des soutenances aléatoires pour les étudiants. Elle offre des fonctionnalités pour créer, modifier et supprimer des classes et des étudiants, ainsi que pour gérer les soutenances.

## Fonctionnalités

- Gestion des classes : Créer, modifier et supprimer des classes.
- Gestion des étudiants : Ajouter, modifier et supprimer des étudiants au sein des classes.
- Soutenances : Organiser des soutenances en sélectionnant aléatoirement des étudiants pour passer au tableau.

## Contraintes

- Une seule soutenance peut être gérée à la fois.
- La soutenance est gérée côté client uniquement (par exemple, via le localStorage).
- Il est impossible d'ajouter des étudiants à une classe en temps réel pendant une soutenance.
- Un étudiant ne peut appartenir qu'à une seule classe et ne peut être ajouté qu'une seule fois par classe.
- Chaque étudiant ne peut être appelé au tableau qu'une seule fois par soutenance.

## Technologies Utilisées

- Backend : Express.js (sans autres bibliothèques, à l'exception de celle utilisée pour la connexion à la base de données).
- Base de données : MySQL
- Frontend : JavaScript pur (sans bibliothèques ni frameworks) et le framework CSS classless water.css

## Endpoints de l'API

### Gestion des Classes

- Récupérer la liste des classes
  - Méthode : GET
  - Endpoint : /classrooms
  - Réponses :
    - 200 : Liste des classes.

- Créer une classe
  - Méthode : POST
  - Endpoint : /classrooms
  - Paramètres :
    - name (obligatoire) : Nom de la classe.
  - Réponses :
    - 201 : Classe créée avec succès.
    - 409 : Une classe avec ce nom existe déjà.
    - 422 : Le paramètre "name" est manquant.

- Modifier une classe
  - Méthode : PUT ou PATCH
  - Endpoint : /classrooms/:id
  - Paramètres :
    - name (obligatoire) : Nouveau nom de la classe.
  - Réponses :
    - 200 : Classe modifiée avec succès.
    - 404 : Classe non trouvée.
    - 409 : Une classe avec ce nom existe déjà.
    - 422 : Le paramètre "name" est manquant.

- Supprimer une classe
  - Méthode : DELETE
  - Endpoint : /classrooms/:id
  - Réponses :
    - 204 : Classe supprimée avec succès.
    - 404 : Classe non trouvée.

### Gestion des Étudiants

- Récupérer la liste des étudiants d'une classe
  - Méthode : GET
  - Endpoint : /classrooms/:classroom_id/students
  - Réponses :
    - 200 : Liste des étudiants de la classe.

- Ajouter un étudiant à une classe
  - Méthode : POST
  - Endpoint : /classrooms/:classroom_id/students
  - Paramètres :
    - name (obligatoire) : Nom de l'étudiant.
  - Réponses :
    - 201 : Étudiant ajouté avec succès.
    - 404 : Classe non trouvée.
    - 409 : Un étudiant avec ce nom existe déjà dans la classe.
    - 422 : Le paramètre "name" est manquant.

- Modifier un étudiant
  - Méthode : PUT ou PATCH
  - Endpoint : /classrooms/:classroom_id/students/:student_id
  - Paramètres :
    - name (obligatoire) : Nouveau nom de l'étudiant.
  - Réponses :
    - 200 : Étudiant modifié avec succès.
    - 404 : Classe ou étudiant non trouvé.
    - 409 : Un étudiant avec ce nom existe déjà dans la classe.
    - 422 : Le paramètre "name" est manquant.

- Supprimer un étudiant
  - Méthode : DELETE
  - Endpoint : /classrooms/:classroom_id/students/:student_id
  - Réponses :
    - 204 : Étudiant supprimé avec succès.
    - 404 : Classe ou étudiant non trouvé.

## Gestion des Soutenances

La gestion des soutenances est effectuée côté client en utilisant le stockage local (par exemple, le localStorage). Un bouton permet d'appeler un étudiant au hasard pour passer au tableau. Une fois que tous les étudiants sont passés, un message l'indique.

## Installation et Lancement

### Cloner le dépôt :

- git clone https://github.com/xSpaKs/autableau_api
- cd autableau_api

### Installer les dépendances :

- npm install

### Configurer la base de données :

Mettez à jour les informations de connexion à la base de données dans app.js

### Lancer le serveur :

- npm start

Le serveur sera accessible à l'adresse http://localhost:3000.
