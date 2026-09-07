import { QuestionsThematique } from '../Referentiel';

export const donneesSecuriteAcces: QuestionsThematique = {
  questions: [
    {
      identifiant: 'acces-comptes-privileges-recyf',
      libelle:
        'Les comptes à privilèges (ex. administrateurs, comptes de service) inactifs et/ou non nécessaires sont-ils désactivés?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'acces-comptes-privileges-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'acces-comptes-privileges-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-comptes-privileges-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'acces-comptes-privileges-recyf-un-peu',
          libelle:
            "Les comptes à privilèges sont désactivés au fil de l'eau sans délais clairs de désactivation.",
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              { identifiant: 'acces-comptes-privileges-recyf', niveau: 1 },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'acces-comptes-privileges-recyf-oui',
          libelle:
            'Des délais clairs de désactivation des comptes comptes à privilèges inactifs ou non nécessaires sont formalisés, appliqués et tracés.',
          resultat: {
            indice: { valeur: 3 },
            mesures: [
              { identifiant: 'acces-comptes-privileges-recyf', niveau: 1 },
            ],
          },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-postes-droits-utilisateurs-restreints-recyf',
      libelle:
        'Les droits des utilisateurs sont-ils restreints sur les postes de travail ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'acces-postes-droits-utilisateurs-restreints-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'acces-postes-droits-utilisateurs-restreints-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'acces-postes-droits-utilisateurs-restreints-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-postes-droits-utilisateurs-restreints-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-postes-droits-utilisateurs-restreints-recyf-un-peu',
          libelle:
            "Sur les postes de travail, les utilisateurs travaillent avec un compte standard, sans droits d'administration locale. Les postes faisant exception (logiciel métier exigeant des droits élevés, poste de développement) sont identifiés.",
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant:
                  'acces-postes-droits-utilisateurs-restreints-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'acces-postes-droits-utilisateurs-restreints-recyf-limites',
          libelle:
            "Aucun utilisateur ne dispose de droits d'administration locale sur son poste, sur l'ensemble du parc ; les exceptions sont documentées, justifiées et revues au moins une fois par an. Les processus automatiques installés sur les postes (sauvegarde, supervision, télédistribution, antivirus) ne fonctionnent qu'avec les droits nécessaires à leur fonction.",
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-utilisateurs-administrateurs-poste-recyf',
      libelle:
        "Les administrateurs disposent-ils de compte dédiés aux tâches d'administration et sont-ils les seuls à pouvoir les utiliser?",
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-utilisateurs-administrateurs-poste-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste-recyf-un-peu',
          libelle:
            "Chaque administrateur dispose d'un compte d'administration distinct de son compte utilisateur courant. Ces comptes ne sont utilisés ni pour la messagerie, ni pour la navigation Internet, ni pour la bureautique.",
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'acces-utilisateurs-administrateurs-poste-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste-recyf-oui',
          libelle:
            "Les comptes utilisateurs et d'administration sont dissociés sur l'ensemble des équipements, y compris les outils et services en ligne. Les comptes d'administration sont dédiés à l'administration, et seules les personnes autorisées en disposent.",
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-teletravail-acces-distants-recyf',
      libelle:
        'Le télétravail et les accès distants (cloud inclus) sont-ils protégés par une authentification multifacteur ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'acces-teletravail-acces-distants-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'acces-teletravail-acces-distants-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'acces-teletravail-acces-distants-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-teletravail-acces-distants-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'acces-teletravail-acces-distants-recyf-mfa',
          libelle:
            "Un mécanisme d'authentification multifacteur est activé sur les principaux accès exposés sur Internet (ex. SaaS fournis par un tiers, ou SI internes exposés sur Internet).",
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'acces-teletravail-acces-distants-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant: 'acces-teletravail-acces-distants-recyf-vpn',
          libelle:
            "Un mécanisme d'authentification multifacteur (basé sur le facteur de connaissance ainsi que sur un second facteur) est activé sur l'ensemble des accès distants (dont la messagerie, les services exposés, le télétravail, la télémaintenance ainsi que les accès VPN) pour tous les utilisateurs.",
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-si-industriel-teletravail-acces-distants-recyf',
      libelle:
        'Les accès distants aux systèmes industriels sont-ils protégés par une authentification multifacteur ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-si-industriel-teletravail-acces-distants-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-recyf-mfa',
          libelle:
            'Certaines connexions à distance sont protégées par une authentification multifacteur',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant:
                  'acces-si-industriel-teletravail-acces-distants-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-recyf-vpn',
          libelle:
            'Toutes les connexions à distance sont protégées par une authentification multifacteur',
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-mesures-securite-robustesse-mdp-recyf',
      libelle:
        'Des exigences de complexité sont-elles imposées sur les mots de passe de session des utilisateurs ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'acces-mesures-securite-robustesse-mdp-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'acces-mesures-securite-robustesse-mdp-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-mesures-securite-robustesse-mdp-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'acces-mesures-securite-robustesse-mdp-recyf-un-peu',
          libelle:
            'Les comptes des utilisateurs sur des systèmes d’information important et/ou sensibles (ex. messagerie) et les comptes des administrateurs sont protégés par des mots de passe composés a minima de 12 caractères incluant minuscules, majuscules, chiffres et caractères spéciaux ou ou repose sur un token physique déverrouillé par un code PIN. ' +
            'Les comptes des administrateurs sont protégés par des mots de passe composés a minima de 15 caractères incluant minuscules, majuscules, chiffres et caractères spéciaux ou repose sur un token physique déverrouillé par un code PIN.',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant: 'acces-mesures-securite-robustesse-mdp-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-mesures-securite-robustesse-mdp-recyf-respect-contraintes',
          libelle:
            'L’ensemble des comptes respectent les contraintes de complexité, de robustesse et de rotation de mots de passe définies dans le guide ANSSI « Authentification multifacteur et mots de passe » (https://messervices.cyber.gouv.fr/documents-guides/anssi-guide-authentification_multifacteur_et_mots_de_passe.pdf) selon la sensibilité des ressources accessibles.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
