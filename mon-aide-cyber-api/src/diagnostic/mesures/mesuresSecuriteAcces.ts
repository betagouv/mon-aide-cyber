export const mesuresSecuriteAcces = {
  'acces-outil-gestion-des-comptes': {
    niveau1: {
      titre:
        'Mettre en œuvre un outil de gestion des politiques de sécurité centralisées (ex : Active Directory, Samba-AD) et en évaluer/améliorer son niveau de sécurité annuellement',
      pourquoi: '../../mesures/acces/acces-outil-gestion-des-comptes-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-outil-gestion-des-comptes-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Contrôler régulièrement le niveau de sécurité de son outil de gestion de politiques de sécurité centralisé',
      pourquoi: '../../mesures/acces/acces-outil-gestion-des-comptes-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-outil-gestion-des-comptes-niveau2-comment.pug',
    },
    priorisation: 14,
  },
  'acces-liste-compte-utilisateurs': {
    niveau1: {
      titre:
        'Réaliser annuellement une revue des accès utilisateurs en les comparant avec les informations détenues par le service RH',
      pourquoi: '../../mesures/acces/acces-liste-compte-utilisateurs-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-liste-compte-utilisateurs-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Définir avec le service RH des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes utilisateurs',
      pourquoi: '../../mesures/acces/acces-liste-compte-utilisateurs-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-liste-compte-utilisateurs-niveau2-comment.pug',
    },
    priorisation: 25,
  },
  'acces-droits-acces-utilisateurs-limites': {
    niveau1: {
      titre: "Restreindre l'accès aux données à protéger en priorité aux seules personnes autorisées à y accéder",
      pourquoi: '../../mesures/acces/acces-droits-acces-utilisateurs-limites-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-droits-acces-utilisateurs-limites-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Pour les systèmes et applications à protéger en priorité, définir et gérer les utilisateurs selon 2 niveaux de privilèges distincts : 1 niveau "accès complet" et 1 niveau "accès restreint"',
      pourquoi: '../../mesures/acces/acces-droits-acces-utilisateurs-limites-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-droits-acces-utilisateurs-limites-niveau2-comment.pug',
    },
    priorisation: 31,
  },
  'acces-administrateurs-informatiques-suivie-et-limitee': {
    niveau1: {
      titre:
        'Réaliser tous les 6 mois une revue des accès administrateurs en les comparant avec les informations détenues par le service RH',
      pourquoi: '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Définir avec les administrateurs des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes administrateurs',
      pourquoi: '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-comment.pug',
    },
    priorisation: 29,
  },
  'acces-utilisation-comptes-administrateurs-droits-limitee': {
    niveau1: {
      titre: "Utiliser des comptes d'administration dédiés à cet usage",
      pourquoi: '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-comment.pug',
    },
    niveau2: {
      titre: "Utiliser des comptes d'administration distincts selon les périmètres d’administration",
      pourquoi: '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-comment.pug',
    },
    priorisation: 11,
  },
  'acces-utilisateurs-administrateurs-poste': {
    niveau1: {
      titre:
        'Limiter drastiquement le nombre d’utilisateurs disposant du privilège d’administration local sur leur machine.',
      pourquoi: '../../mesures/acces/acces-utilisateurs-administrateurs-poste-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-utilisateurs-administrateurs-poste-niveau1-comment.pug',
    },
    priorisation: 7,
  },
  'acces-mesures-securite-robustesse-mdp': {
    niveau1: {
      titre:
        'Fixer des contraintes de longueur et de complexité des mots de passe exigeant à minima 12 caractères incluant minuscules, majuscules, chiffres et caractères spéciaux',
      pourquoi: '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau2-comment.pug',
    },
    niveau2: {
      titre:
        'Mettre à disposition des utilisateurs une coffre fort de mots de passe et les former régulièrement à la création de mots de passe robustes.',
      pourquoi: '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau1-comment.pug',
    },
    priorisation: 19,
  },
  'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles': {
    niveau1: {
      titre: 'Protéger de manière spéficique les données jugées sensibles',
      pourquoi:
        '../../mesures/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau1-comment.pug',
    },
    niveau2: {
      titre: 'Mettre en place des mesures additionnelles de sécurisation des données jugées sensibles',
      pourquoi:
        '../../mesures/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-comment.pug',
    },
    priorisation: 34,
  },
  'acces-teletravail-acces-distants-mesures-particulieres': {
    niveau1: {
      titre: 'Mettre en place pour tous les accès distants des mécanismes de double authentification à minima',
      pourquoi: '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug',
    },
    niveau2: {
      titre: 'Gérer tous les accès distants via un VPN, lui même authentifié à double facteur',
      pourquoi: '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug',
    },
    priorisation: 12,
  },
  'acces-si-industriel-teletravail-acces-distants-mesures-particulieres': {
    niveau1: {
      titre:
        'Mettre en place pour tous les accès distants des systèmes industriels des mécanismes de double authentification',
      pourquoi:
        '../../mesures/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug',
    },
    niveau2: {
      titre: 'Gérer tous les accès distants des systèmes industriels via un VPN, lui même authentifié à double facteur',
      pourquoi:
        '../../mesures/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug',
    },
    priorisation: 12,
  },
  'acces-administrateurs-si-mesures-specifiques': {
    niveau1: {
      titre: 'Protéger de manière spéficique les accès des admininistrateurs',
      pourquoi: '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau1-pourquoi.pug',
      comment: '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau1-comment.pug',
    },
    niveau2: {
      titre: 'Compléter les mesures de sécurisation des accès d’administration',
      pourquoi: '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau2-pourquoi.pug',
      comment: '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau2-comment.pug',
    },
    priorisation: 13,
  },
};
