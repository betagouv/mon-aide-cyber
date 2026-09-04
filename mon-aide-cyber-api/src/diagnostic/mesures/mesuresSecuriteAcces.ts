export const mesuresSecuriteAcces = {
  'acces-comptes-privileges-recyf': {
    niveau1: {
      titre:
        'Désactiver et supprimer les comptes à privilèges (ex. administrateurs et comptes de service) non nécessaires dans un délai formalisé',
      pourquoi:
        '../../mesures/recyf/acces/acces-comptes-privileges-recyf-niveau1-pourquoi.pug',
      comment:
        '../../mesures/recyf/acces/acces-comptes-privileges-recyf-niveau1-comment.pug',
    },
    priorisation: 19,
  },
  'acces-postes-droits-utilisateurs-restreints-recyf': {
    niveau1: {
      titre:
        'Restreindre les droits des comptes sur les postes de travail selon les besoins',
      pourquoi:
        '../../mesures/recyf/acces/acces-postes-droits-utilisateurs-restreints-recyf-niveau1-pourquoi.pug',
      comment:
        '../../mesures/recyf/acces/acces-postes-droits-utilisateurs-restreints-recyf-niveau1-comment.pug',
    },
    priorisation: 16,
  },
  'acces-administrateurs-informatiques-suivie-et-limitee': {
    niveau1: {
      titre:
        'Réaliser tous les 6 mois une revue des accès administrateurs en les comparant avec les informations détenues par le service RH',
      pourquoi:
        '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Définir avec les administrateurs des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes administrateurs',
      pourquoi:
        '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-comment.pug',
    },
    priorisation: 29,
  },
  'acces-utilisation-comptes-administrateurs-droits-limitee': {
    niveau1: {
      titre: "Utiliser des comptes d'administration dédiés à cet usage",
      pourquoi:
        '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        "Utiliser des comptes d'administration distincts selon les périmètres d’administration",
      pourquoi:
        '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-comment.pug',
    },
    priorisation: 11,
  },
  'acces-utilisateurs-administrateurs-poste': {
    niveau1: {
      titre:
        'Limiter drastiquement le nombre d’utilisateurs disposant du privilège d’administration local sur leur machine',
      pourquoi:
        '../../mesures/acces/acces-utilisateurs-administrateurs-poste-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-utilisateurs-administrateurs-poste-niveau1-comment.pug',
    },
    priorisation: 7,
  },
  'acces-mesures-securite-robustesse-mdp': {
    niveau1: {
      titre:
        'Fixer des critères de longueur et complexité des mots de passe et encourager l’usage d’un coffre-fort de mots de passe',
      pourquoi:
        '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau2-comment.pug',
    },
    niveau2: {
      titre:
        'Mettre à disposition des utilisateurs une coffre fort de mots de passe et les former régulièrement à la création de mots de passe robustes',
      pourquoi:
        '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-mesures-securite-robustesse-mdp-niveau1-comment.pug',
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
      titre:
        'Mettre en place des mesures additionnelles de sécurisation des données jugées sensibles',
      pourquoi:
        '../../mesures/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-comment.pug',
    },
    priorisation: 34,
  },
  'acces-teletravail-acces-distants-mesures-particulieres': {
    niveau1: {
      titre:
        'Mettre en place pour tous les accès distants des mécanismes de double authentification à minima',
      pourquoi:
        '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Gérer tous les accès distants via un VPN, lui même authentifié à double facteur',
      pourquoi:
        '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug',
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
      titre:
        'Gérer tous les accès distants des systèmes industriels via un VPN, lui même authentifié à double facteur',
      pourquoi:
        '../../mesures/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug',
    },
    priorisation: 12,
  },
  'acces-administrateurs-si-mesures-specifiques': {
    niveau1: {
      titre: 'Protéger de manière spécifique les accès des admininistrateurs',
      pourquoi:
        '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau1-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau1-comment.pug',
    },
    niveau2: {
      titre: 'Compléter les mesures de sécurisation des accès d’administration',
      pourquoi:
        '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau2-pourquoi.pug',
      comment:
        '../../mesures/acces/acces-administrateurs-si-mesures-specifiques-niveau2-comment.pug',
    },
    priorisation: 13,
  },
};
