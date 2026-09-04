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
      identifiant: 'acces-utilisateurs-administrateurs-poste',
      libelle: 'Les utilisateurs sont-ils administrateurs de leur poste ?',
      poids: 3,
      reponsesPossibles: [
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste-oui',
          libelle:
            'Oui, les comptes d’accès des utilisateurs disposent des privilèges d’administration du poste de travail',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-utilisateurs-administrateurs-poste',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'acces-utilisateurs-administrateurs-poste-suppression-privilege-en-cours',
          libelle:
            'La suppression de ce privilège est en cours de traitement, plusieurs utilisateurs sont toujours administrateurs de leur poste',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'acces-utilisateurs-administrateurs-poste',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-utilisateurs-administrateurs-poste-non-exceptions-justifiees',
          libelle: 'Non, et les rares exceptions sont justifiées',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-mesures-securite-robustesse-mdp',
      libelle:
        'Des exigences de complexité sont-elles imposées sur les mots de passe de session des utilisateurs ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'acces-mesures-securite-robustesse-mdp-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'acces-mesures-securite-robustesse-mdp-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-mesures-securite-robustesse-mdp',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'acces-mesures-securite-robustesse-mdp-contraintes-par-defaut',
          libelle:
            "Des contraintes en matière de sécurité des mots de passe sont exigées par défaut pour l'accès des utilisateurs à leur compte",
          resultat: { indice: { valeur: 3 } },
          ordre: 2,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-administrateurs-informatiques-suivie-et-limitee',
      libelle:
        'La liste des comptes des administrateurs informatiques (prestataires inclus) est-elle suivie et limitée au strict nécessaire ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'acces-administrateurs-informatiques-suivie-et-limitee-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'acces-administrateurs-informatiques-suivie-et-limitee-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-administrateurs-informatiques-suivie-et-limitee',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'acces-administrateurs-informatiques-suivie-et-limitee-revue-reguliere',
          libelle:
            'Les comptes des administrateurs sont régulièrement revus (ex : liste du personnel vs liste des comptes)',
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'acces-administrateurs-informatiques-suivie-et-limitee',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-administrateurs-informatiques-suivie-et-limitee-revue-continue',
          libelle:
            "La liste des comptes des administrateurs est mise à jour en continu dans le cadre d'un processus de désactivation systématique des comptes inactifs. Une revue annuelle est également réalisée",
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-utilisation-comptes-administrateurs-droits-limitee',
      libelle:
        "L'utilisation des comptes administrateurs est-elle bien limitée aux tâches d'administration ?",
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'acces-utilisation-comptes-administrateurs-droits-limitee-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'acces-utilisation-comptes-administrateurs-droits-limitee-non',
          libelle:
            'Non, des utilisateurs disposent de privilèges d’administration sans restriction particulière',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-utilisation-comptes-administrateurs-droits-limitee',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'acces-utilisation-comptes-administrateurs-droits-quelques-restrictions',
          libelle:
            "La mise à disposition des comptes d'administration fait l'objet de quelques restrictions",
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'acces-utilisation-comptes-administrateurs-droits-limitee',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-utilisation-comptes-administrateurs-droits-justifies',
          libelle:
            'Tous les comptes administration sont justifiés, et dédiés aux seules tâches d’administration',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
      libelle:
        "L'accès des utilisateurs aux ressources et données les plus sensibles fait-il l’objet de mesures de sécurité additionnelles ?",
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees',
          libelle:
            "Oui, des mesures renforçant l'accès à ces données ont été mises en œuvre",
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees-et-donnees-chiffrees',
          libelle:
            "Oui, des mesures renforçant l'accès à ces données ont été mises en œuvre et les données sont chiffrées",
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-teletravail-acces-distants-mesures-particulieres',
      libelle:
        'Le télétravail et les accès distants (cloud inclus) sont-ils protégés par une authentification multifacteur ?',
      poids: 2,
      reponsesPossibles: [
        {
          identifiant:
            'acces-teletravail-acces-distants-mesures-particulieres-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'acces-teletravail-acces-distants-mesures-particulieres-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'acces-teletravail-acces-distants-mesures-particulieres-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-teletravail-acces-distants-mesures-particulieres',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-teletravail-acces-distants-mesures-particulieres-mfa',
          libelle:
            'Certaines connexions à distance sont protégées par une authentification multifacteur',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant:
                  'acces-teletravail-acces-distants-mesures-particulieres',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'acces-teletravail-acces-distants-mesures-particulieres-vpn',
          libelle:
            'Toutes les connexions à distance sont protégées par une authentification multifacteur',
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
      libelle:
        'Les accès distants aux systèmes industriels sont-ils protégés par une authentification multifacteur ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres-mfa',
          libelle:
            'Certaines connexions à distance sont protégées par une authentification multifacteur',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant:
                  'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres-vpn',
          libelle:
            'Toutes les connexions à distance sont protégées par une authentification multifacteur',
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'acces-administrateurs-si-mesures-specifiques',
      libelle:
        'Les accès des administrateurs font-ils l’objet de mesures de sécurité renforcées ?',
      poids: 2,
      reponsesPossibles: [
        {
          identifiant: 'acces-administrateurs-si-mesures-specifiques-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'acces-administrateurs-si-mesures-specifiques-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'acces-administrateurs-si-mesures-specifiques',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees',
          libelle:
            "Oui, des mesures renforçant l'authentification ont été mises en œuvre",
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant: 'acces-administrateurs-si-mesures-specifiques',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees-postes-dedies-administration',
          libelle:
            "Oui, des mesures renforçant l'authentification ont été mises en œuvre et des postes dédiés à l'administration sont utilisés",
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
