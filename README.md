# Bobby

###	Initialisation de Composer

```
composer update
composer install
```

### Initialisation des config

Créer le fichier `.env` à partir de `env.example`.

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

Générer la clé pour php artisan
```
php artisan key:generate
```

Lancer le serveur
```
php artisan serve
```
