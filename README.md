# MonAideCyber

MonAideCyber est un service numérique développé par le laboratoire d'innovation de l'[ANSSI](https://www.cyber.gouv.fr/), en lien avec l'incubateur
[BetaGouv](https://beta.gouv.fr/) de la direction interministérielle du numérique. Il s’adresse aux entités publiques et privées,
quelle que soit leur taille, déjà sensibilisées au risque et souhaitant s’engager dans une démarche proportionnée et
concrète de renforcement de leur cybersécurité.

## Configuration de l'environnement de développement

Il est nécessaire en prérequis d'avoir installé [Git](https://git-scm.com/),
[Docker](https://www.docker.com/) et [Node.js v18](https://nodejs.org/en/).

Commencer par récupérer les sources du projet et aller dans le répertoire créé.

```sh
$ git clone git@github.com:betagouv/mon-aide-cyber.git && cd mon-aide-cyber
```

Rajouter le réseau commun à l'application et au journal (s'il n'existe pas déjà) :

```sh
$ docker network create reseau-mon-aide-cyber
```

## Lancement du serveur

Lancer Docker et exécuter docker-compose pour lancer l'application.

```shell
 docker-compose up
```

Optionnellement, forcer le build si nécessaire.

```shell
 docker-compose up --build --force-recreate --no-deps
```

## Lancement de la suite de tests automatisés

Les tests sont lancés manuellement et nécessitent une première installation des espaces de travail du projet (`npm install`).

- `npm run test` lance les tests de l'`api` et du `front`
- `npm run test:watch` lance les tests à chaque modification de fichier de l'`api` et du `front`

## Activations de fonctionnalités

### mon-aide-cyber-ui

- `VITE_INFORMATION_A_AFFICHER` à true pour pouvoir afficher le message pour accéder à la plateforme de production sur la page de connexion
- `VITE_MAC_URL_OFFICIELLE` URL vers l’environnement cible lorsque l’on affiche le message pour accéder à la plateforme de production sur la page de connexion
- `VITE_MATOMO_SITE_ID` identifiant de l’instance matomo
- `VITE_MATOMO_URL` URL du script Matomo suivant l’environnement désiré (`dev`, `staging`, `live`)
