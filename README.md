# MonAideCyber

MonAideCyber est un service numérique développé par le laboratoire d'innovation de l'[ANSSI](https://www.ssi.gouv.fr/), en lien avec l'incubateur
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

## Création d'un aidant
Seul un **aidant** connecté à la plateforme peut lancer des diagnostics.

Pour créer un **aidant**, exécuter :

```shell
 npm run -w mon-aide-cyber-api administration:cree-aidant "aidant" "aidant" "prenom nom" `date --iso-8601=seconds` `date --iso-8601=seconds`
```

Pour se connecter, utiliser l'identifiant "aidant" et le mot de passe "aidant".

## Lancement de la suite de tests automatisés

Les tests sont lancés manuellement et nécessitent une première installation des espaces de travail du projet (`npm install`).

- `npm run test` lance les tests de l'`api` et du `front`
- `npm run test:watch` lance les tests à chaque modification de fichier de l'`api` et du `front`

## Activations de fonctionnalités

### mon-aide-cyber-ui

- `VITE_ACTIVATION_LANCEMENT_DIAGNOSTIC` à true pour pouvoir afficher le bouton de lancement
