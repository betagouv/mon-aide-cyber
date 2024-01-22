export const recommandationsSecuriteAcces = {
  'acces-outil-gestion-des-comptes': {
    niveau1: {
      titre:
        "Mettre en œuvre un outil de gestion des politiques de sécurité centralisées (ex : Active Directory, Samba-AD) et en évaluer/améliorer son niveau de sécurité annuellement, idéalement au travers d'un accompagnement extérieur.",
      pourquoi:
        '../../recommandations/acces/acces-outil-gestion-des-comptes-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-outil-gestion-des-comptes-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        "Contrôler régulièrement le niveau de sécurité de son outil de gestion de politiques de sécurité centralisé, en s'appuyant idéalement sur un prestataire labellisé/qualifié.",
      pourquoi:
        '../../recommandations/acces/acces-outil-gestion-des-comptes-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-outil-gestion-des-comptes-niveau2-comment.pug',
    },
    priorisation: 35,
  },
  'acces-liste-compte-utilisateurs': {
    niveau1: {
      titre:
        'Réaliser annuellement une revue des accès utilisateurs en les comparant avec les informations détenues par le service RH. Les mots de passes des comptes partagés concernés sont renouvelés à chaque départ.',
      pourquoi:
        '../../recommandations/acces/acces-liste-compte-utilisateurs-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-liste-compte-utilisateurs-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Définir avec le service RH des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes utilisateurs.',
      pourquoi:
        '../../recommandations/acces/acces-liste-compte-utilisateurs-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-liste-compte-utilisateurs-niveau2-comment.pug',
    },
    priorisation: 26,
  },
  'acces-droits-acces-utilisateurs-limites': {
    niveau1: {
      titre:
        "Restreindre l'accès aux données à protéger en priorité aux seules personnes autorisées à y accéder (ex : un tableau répertoriant les utilisateurs légitimes par systèmes/applications à protéger en priorité)",
      pourquoi:
        '../../recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Pour les systèmes et applications à protéger en priorité, définir et gérer les utilisateurs selon 2 niveaux de privilèges distincts : 1 niveau "accès complet" et 1 niveau "accès restreint"',
      pourquoi:
        '../../recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau2-comment.pug',
    },
    priorisation: 18,
  },
  'acces-administrateurs-informatiques-suivie-et-limitee': {
    niveau1: {
      titre:
        'Réaliser tous les 6 mois une revue des accès administrateurs en les comparant avec les informations détenues par le service RH. Les mots de passes des comptes partagés concernés sont renouvelés à chaque départ.',
      pourquoi:
        '../../recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Définir avec les administrateurs (prestataire inclus), et si nécessaire avec le service RH et Achat, des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes administrateurs',
      pourquoi:
        '../../recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-comment.pug',
    },
    priorisation: 27,
  },
  'acces-utilisation-comptes-administrateurs-droits-limitee': {
    niveau1: {
      titre:
        "Utiliser des comptes d'administration dédiées à cet usage, les administrateurs disposant en parallèle d’un compte utilisateur. Utiliser également des comptes d'administration distincts dédiés à l'administration de l'AD ou Samba-AD et à la solution de sauvegarde (et non géré via l'AD ou Samba-AD).",
      pourquoi:
        '../../recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        "Utiliser des comptes d'administration distincts selon les périmètres d’administration.",
      pourquoi:
        '../../recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-comment.pug',
    },
    priorisation: 10,
  },
  'acces-utilisateurs-administrateurs-poste': {
    niveau1: {
      titre:
        'Limiter drastiquement le nombre d’utilisateurs disposant du privilège d’administration local sur leur machine.',
      pourquoi:
        '../../recommandations/acces/acces-utilisateurs-administrateurs-poste-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-utilisateurs-administrateurs-poste-niveau1-comment.pug',
    },
    priorisation: 10,
  },
  'acces-mesures-securite-robustesse-mdp': {
    niveau1: {
      titre:
        'Mettre à disposition des utilisateurs une coffre fort de mots de passe et les former régulièrement à la création de mots de passe robustes.',
      pourquoi:
        '../../recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Fixer des contraintes de longueur et de complexité des mots de passe exigeant à minima 12 caractères (idéalement 15) incluant minuscules, majuscules, chiffres et caractères spéciaux. Si nécessaire poursuivre les actions de communication et de promotion des coffres fort de mot de passe.',
      pourquoi:
        '../../recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau2-comment.pug',
    },
    priorisation: 20,
  },
  'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles': {
    niveau1: {
      titre:
        'Mettre en place des mesures complémentaires de sécurisation des données sensibles.',
      pourquoi:
        '../../recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation des données sensibles (dont R&D).',
      pourquoi:
        '../../recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-comment.pug',
    },
    priorisation: 28,
  },
  'acces-teletravail-acces-distants-mesures-particulieres': {
    niveau1: {
      titre:
        'Mettre en place pour tous les accès distants des mécanismes de double authentification à minima, avec restriction via adresses IP (ex : localisation, pays, plages horaires)',
      pourquoi:
        '../../recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Gérer tous les accès distants via un VPN  "full-tunneling*" dédié et des mécanismes de double authentification à minima.',
      pourquoi:
        '../../recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug',
    },
    priorisation: 12,
  },
  'acces-si-industriel-teletravail-acces-distants-mesures-particulieres': {
    niveau1: {
      titre:
        'Mettre en place pour tous les accès distants du SI indus (ou GTB-GTC) des mécanismes de double authentification à minima, avec restriction via adresses IP (ex : localisation, pays, plages horaires)',
      pourquoi:
        '../../recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Gérer tous les accès distants via un VPN  "full-tunneling*" dédié et des mécanismes de double authentification à minima.',
      pourquoi:
        '../../recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug',
    },
    priorisation: 12,
  },
  'acces-administrateurs-si-mesures-specifiques': {
    niveau1: {
      titre:
        "Mettre en place des mesures complémentaires de sécurisation des accès d'administration.",
      pourquoi:
        '../../recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau1-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        "En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation des accès d'administration.",
      pourquoi:
        '../../recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau2-pourquoi.pug',
      comment:
        '../../recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau2-comment.pug',
    },
    priorisation: 11,
  },
};
