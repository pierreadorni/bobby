# Bobby

## Principe

Bobby est un outil du Simde UTC permettant la gestion du matériel
des associations dans les locaux de l'UTC et par extension les réservations de ce
dernier.

Il est codé à l'aide des frameworks Laravel pour l'API et 
AngularJs pour le frontend.

## Mettre en local Bobby

###	Initialisation de Composer

Vous devez installer [Composer](https://getcomposer.org/download/). 

```
composer update
composer install
```

### Initialisation des config

Créer le fichier `.env` à partir de `env.example`.

Pour renseigner les configurations spécifiques du ficher `.env` 
(authentification avec le Portail : CLIENT_ID, etc ...) veuillez contacter le Simde.

### Mise en place de la BDD

Dans le fichier `.env`, configurez les points suivants :

```
DB_DATABASE=bobby
DB_USERNAME=root
DB_PASSWORD=
```

Migrer les tables
```
php artisan migrate
```

Remplir les bases de données test
```
php artisan db:seed
```

### Finaliser l'installation des dépendances


Générer la clé pour php artisan
```
php artisan key:generate
```

Installer les dépendances du frontend (npm):
```
npm install
```

Gulp
```
gulp
```

### Faire tourner l'application en local

Une fois toutes les étapes précédentes effectuées,
deux consoles terminal sont nécessaires pour
lancer les commandes suivantes et faire tourner 
l'application en lcoal:

Lancer le serveur
```
php artisan serve
```

Observer les modifications dans le frontend
```
gulp watch
```

## Architecture de l'application

### API

Pour tous les éléments suivants, n'hésitez pas à consulter
les fichiers/dossiers mentionnés pour comprendre ce
qu'ils font précisément et comment ils le font.

#### Model

Tous les fichiers des modèles sont dans le dossier `app`.
Les modèles sont les suivants : 
* Booking
* BookingLine
* Bug
* Item
* ItemPlace
* ItemType
* Log
* User
Les controlleurs, validations, migrations, ... découleront de ce schéma.

#### Controllers

Les controllers gèrent toute la logique. A la réception d'une requête ils vérifient
l'authentification, les autorisations, appelent le modèle pour récupérer les données ou
pour créer une nouvelle ressource. En bref, c'est le cerveau du code.

Dossier `app/Http/Controllers`

#### Validation

Leur but est de mettre des contraintes sur les attributs.
Exemple: La caution d'un item doit être un entier.

Dossier `app/Http/Requests`

#### Migrations

Ces fichiers permettent de créer la table en base
de données.

Dossier `database/migrations`

#### Seeds

Les seeders permettent d'insérer des données dans les tables
après leur création.
Exemple : il est intéressant d'avoir déjà les localisations 
des items quand on met l'application en local et ne pas avoir
à les recréer. C'est pourquoi il existe un seeder pour cette table.

Dossier `database/seeds`

#### Routes

Quand une requête arrive elle a une tête de la forme
"https://assos.utc.fr/bobby/api/bugs". Le routage est l'opération
de récupérer cette requête et de savoir vers quel controller la rediriger.
Dans ce cas il faut aller vers le controller qui gère les bugs.

Fichier `routes/api.php`

#### Middleware

Ils se situent après le routage et avant le passage par le controller.
Ils permettent notamment de savoir si l'utilisateur est bien connecté via
le Portail.

Fichier `app/Http/Middleware/PortailAuth.php`

#### Mail

L'application est amené à envoyer des mails automatiques après par exemple une 
demande de réservation. Toute les fonctions sont définis dans le fichier
`app/Libraries/MailSender.php`.

#### Portail

De nombreuses actions sont à réaliser avec le portail, pour savoir si l'utilisateur
a les droits Bobby pour une association, est admin, fait partie d'une association, etc ...
Toutes ces fonctions sont définies dans le fichier `app/Libraries/Portail.php`.


#### Logs

Les logs permettent de savoir toutes les actions effectuées sur l'application et donc d'être tenu
informé des éventuels erreurs, bugs, ... Tout a été défini dans le dossier `app/Services/Logs`.

#### Views

Il est nécessaire de faire appel à des templates par moment. 
Exemple : corps d'un mail.
Tout est dans le dossier `resources/views`.


### Frontend

Gulp permet de basculer de manière condensée dans le dossier `public` les fichiers du frontend.
Cependant lors que vous êtes amenés à faire une modification tout se passera
dans le dossier `resources`. Et c'est Gulp qui se chargera de tout condenser 
dans `public`.

#### Racine du frontend

Dans `resources/app`, il y a un fichier `app.js` et `env.js`.

#### Components

Dans le dossier `resources/app/components` tu retrouveras tout
le code que tu vois à l'écran. Il y a par exemple le dossier `dashboard`
avec le html et js qui te montre ce qu'il y a à l'accueil du site.

#### Directives

Ici il y a des trucs assez génériques, des fonctions réutilisées ailleurs dans le code.
Par exemple `inWrapper` c'est tout le contour du site. A l'accueil il y a une barre
de navigation en haut. C'est la même sur tous les autres écrans. Tout est dans 
`resources/app/directives`.

#### Factories

L'authentification avec le Portail et les appels AJAX y sont définis.

Dossier `resources/app/factories`.

#### Assets

Dossier `resources/assets`.

Dossier pour mettre les images et le CSS.





