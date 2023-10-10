import { TableauDeRecommandations } from "./TableauDeRecommandations";

const tableauRecommandations: TableauDeRecommandations = {
  "gouvernance-infos-et-processus-a-proteger": {
    niveau1: {
      titre:
        "Établir la liste des activités et des informations à protéger en priorité.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-infos-et-processus-a-proteger-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-infos-et-processus-a-proteger-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Établir la liste exhaustive et à jour des activités et des informations à protéger en priorité.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-infos-et-processus-a-proteger-niveau2-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-infos-et-processus-a-proteger-niveau2-comment.pug",
    },
    priorisation: 1,
  },
  "gouvernance-schema-si-a-jour": {
    niveau1: {
      titre:
        "Disposer d’un schéma global du réseau informatique et de la liste des interconnexions vers l’extérieur à jour.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-schema-si-a-jour-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-schema-si-a-jour-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Disposer de la liste des équipements et applicatifs concourant au fonctionnement du système d’information.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-schema-si-a-jour-niveau2-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-schema-si-a-jour-niveau2-comment.pug",
    },
    priorisation: 14,
  },
  "gouvernance-schema-si-industriel-a-jour": {
    niveau1: {
      titre:
        "Disposer d’un schéma global du réseau industriel et de la liste des interconnexions vers l’extérieur à jour.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-schema-si-industriel-a-jour-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-schema-si-industriel-a-jour-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Disposer de la liste des équipements et applicatifs concourant au fonctionnement du système d’information industriel.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-schema-si-industriel-a-jour-niveau2-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-schema-si-industriel-a-jour-niveau2-comment.pug",
    },
    priorisation: 14,
  },
  "gouvernance-connaissance-rgpd": {
    niveau1: {
      titre: "Initier une démarche de conformité RGPD.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-connaissance-rgpd-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-connaissance-rgpd-niveau1-comment.pug",
    },
    priorisation: 24,
  },
  "gouvernance-connaissance-rgpd-registre-traitement": {
    niveau1: {
      titre:
        "Établir votre registre des activités de traitement  de données personnelles.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-connaissance-rgpd-registre-traitement-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-connaissance-rgpd-registre-traitement-niveau1-comment.pug",
    },
    priorisation: 24,
  },
  "gouvernance-connaissance-rgpd-moyens-informer-personnes-mis-en-place": {
    niveau1: {
      titre:
        "Mettre en place des moyens permettant aux personnes concernées d’exercer et faire valoir leurs droits.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-connaissance-rgpd-moyens-informer-personnes-mis-en-place-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-connaissance-rgpd-moyens-informer-personnes-mis-en-place-niveau1-comment.pug",
    },
    priorisation: 24,
  },
  "gouvernance-exigence-cyber-securite-presta": {
    niveau1: {
      titre: "Fixer des exigences de cybersécurité aux prestataires.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Fixer des exigences de sécurité aux prestataires, en vérifier leur application et imposer des pénalités en cas de non-respect.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-niveau2-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-niveau2-comment.pug",
    },
    priorisation: 17,
  },
  "gouvernance-exigence-cyber-securite-presta-si-industriel": {
    niveau1: {
      titre: "Fixer des exigences de cybersécurité aux prestataires.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-si-industriel-niveau1-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-si-industriel-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Fixer des exigences de sécurité aux prestataires, en vérifier leur application et imposer des pénalités en cas de non-respect.",
      pourquoi:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-si-industriel-niveau2-pourquoi.pug",
      comment:
        "recommandations/gouvernance/gouvernance-exigence-cyber-securite-presta-si-industriel-niveau2-comment.pug",
    },
    priorisation: 17,
  },
  "acces-outil-gestion-des-comptes": {
    niveau1: {
      titre:
        "Mettre en œuvre un outil de gestion des politiques de sécurité centralisées (ex : Active Directory, Samba-AD) et en évaluer/améliorer son niveau de sécurité annuellement, idéalement au travers d'un accompagnement extérieur.",
      pourquoi:
        "recommandations/acces/acces-outil-gestion-des-comptes-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-outil-gestion-des-comptes-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Contrôler régulièrement le niveau de sécurité de son outil de gestion de politiques de sécurité centralisé, en s'appuyant idéalement sur un prestataire labellisé/qualifié.",
      pourquoi:
        "recommandations/acces/acces-outil-gestion-des-comptes-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-outil-gestion-des-comptes-niveau2-comment.pug",
    },
    priorisation: 35,
  },
  "acces-liste-compte-utilisateurs": {
    niveau1: {
      titre:
        "Réaliser annuellement une revue des accès utilisateurs en les comparant avec les informations détenues par le service RH. Les mots de passes des comptes partagés concernés sont renouvelés à chaque départ.",
      pourquoi:
        "recommandations/acces/acces-liste-compte-utilisateurs-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-liste-compte-utilisateurs-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Définir avec le service RH des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes utilisateurs.",
      pourquoi:
        "recommandations/acces/acces-liste-compte-utilisateurs-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-liste-compte-utilisateurs-niveau2-comment.pug",
    },
    priorisation: 26,
  },
  "acces-droits-acces-utilisateurs-limites": {
    niveau1: {
      titre:
        "Restreindre l'accès aux données à protéger en priorité aux seules personnes autorisées à y accéder (ex : un tableau répertoriant les utilisateurs légitimes par systèmes/applications à protéger en priorité)",
      pourquoi:
        "recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        'Pour les systèmes et applications à protéger en priorité, définir et gérer les utilisateurs selon 2 niveaux de privilèges distincts : 1 niveau "accès complet" et 1 niveau "accès restreint"',
      pourquoi:
        "recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-droits-acces-utilisateurs-limites-niveau2-comment.pug",
    },
    priorisation: 18,
  },
  "acces-administrateurs-informatiques-suivie-et-limitee": {
    niveau1: {
      titre:
        "Réaliser tous les 6 mois une revue des accès administrateurs en les comparant avec les informations détenues par le service RH. Les mots de passes des comptes partagés concernés sont renouvelés à chaque départ.",
      pourquoi:
        "recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Définir avec les administrateurs (prestataire inclus), et si nécessaire avec le service RH et Achat, des processus de « circuit arrivée » et « circuit départ » assurant les créations et les désactivations des comptes administrateurs",
      pourquoi:
        "recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-administrateurs-informatiques-suivie-et-limitee-niveau2-comment.pug",
    },
    priorisation: 27,
  },
  "acces-utilisation-comptes-administrateurs-droits-limitee": {
    niveau1: {
      titre:
        "Utiliser des comptes d'administration dédiées à cet usage, les administrateurs disposant en parallèle d’un compte utilisateur. Utiliser également des comptes d'administration distincts dédiés à l'administration de l'AD ou Samba-AD et à la solution de sauvegarde (et non géré via l'AD ou Samba-AD).",
      pourquoi:
        "recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Utiliser des comptes d'administration distincts selon les périmètres d’administration.",
      pourquoi:
        "recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-utilisation-comptes-administrateurs-droits-limitee-niveau2-comment.pug",
    },
    priorisation: 10,
  },
  "acces-utilisateurs-administrateurs-poste": {
    niveau1: {
      titre:
        "Limiter drastiquement le nombre d’utilisateurs disposant du privilège d’administration local sur leur machine.",
      pourquoi:
        "recommandations/acces/acces-utilisateurs-administrateurs-poste-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-utilisateurs-administrateurs-poste-niveau1-comment.pug",
    },
    priorisation: 10,
  },
  "acces-mesures-securite-robustesse-mdp": {
    niveau1: {
      titre:
        "Mettre à disposition des utilisateurs une coffre fort de mots de passe et les former régulièrement à la création de mots de passe robustes.",
      pourquoi:
        "recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Fixer des contraintes de longueur et de complexité des mots de passe exigeant à minima 12 caractères (idéalement 15) incluant minuscules, majuscules, chiffres et caractères spéciaux. Si nécessaire poursuivre les actions de communication et de promotion des coffres fort de mot de passe.",
      pourquoi:
        "recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-mesures-securite-robustesse-mdp-niveau2-comment.pug",
    },
    priorisation: 20,
  },
  "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles": {
    niveau1: {
      titre:
        "Mettre en place des mesures complémentaires de sécurisation des données sensibles.",
      pourquoi:
        "recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation des données sensibles (dont R&D).",
      pourquoi:
        "recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-niveau2-comment.pug",
    },
    priorisation: 28,
  },
  "acces-teletravail-acces-distants-mesures-particulieres": {
    niveau1: {
      titre:
        "Mettre en place pour tous les accès distants des mécanismes de double authentification à minima, avec restriction via adresses IP (ex : localisation, pays, plages horaires)",
      pourquoi:
        "recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        'Gérer tous les accès distants via un VPN  "full-tunneling*" dédié et des mécanismes de double authentification à minima.',
      pourquoi:
        "recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug",
    },
    priorisation: 12,
  },
  "acces-si-industriel-teletravail-acces-distants-mesures-particulieres": {
    niveau1: {
      titre:
        "Mettre en place pour tous les accès distants du SI indus (ou GTB-GTC) des mécanismes de double authentification à minima, avec restriction via adresses IP (ex : localisation, pays, plages horaires)",
      pourquoi:
        "recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        'Gérer tous les accès distants via un VPN  "full-tunneling*" dédié et des mécanismes de double authentification à minima.',
      pourquoi:
        "recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-si-industriel-teletravail-acces-distants-mesures-particulieres-niveau2-comment.pug",
    },
    priorisation: 12,
  },
  "acces-entite-dispose-plusieurs-sites-geographiques": {
    niveau1: {
      titre:
        'Mettre en place des mesures de chiffrement pour sécuriser les interconnexions "site à site".',
      pourquoi:
        "recommandations/acces/acces-entite-dispose-plusieurs-sites-geographiques-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-entite-dispose-plusieurs-sites-geographiques-niveau1-comment.pug",
    },
    priorisation: 31,
  },
  "acces-administrateurs-si-mesures-specifiques": {
    niveau1: {
      titre:
        "Mettre en place des mesures complémentaires de sécurisation des accès d'administration.",
      pourquoi:
        "recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau1-pourquoi.pug",
      comment:
        "recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation des accès d'administration.",
      pourquoi:
        "recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau2-pourquoi.pug",
      comment:
        "recommandations/acces/acces-administrateurs-si-mesures-specifiques-niveau2-comment.pug",
    },
    priorisation: 11,
  },
  "securite-poste-maj-fonctionnelles-et-securite-deployees": {
    niveau1: {
      titre:
        "Déployer systématiquement toutes les mises à jour dès que celles-ci sont disponibles (ou après qualification interne) et hors exceptions spécifiquement identifiées.",
      pourquoi:
        "recommandations/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Mettre en œuvre des mesures de sécurité supplémentaires (cloisonnement, règles EDR durcies, déconnexion AD) sur les systèmes ne pouvant pas bénéficier des mises à jour (ex : systèmes industriels, applications particulières)",
      pourquoi:
        "recommandations/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau2-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau2-comment.pug",
    },
    priorisation: 7,
  },
  "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees": {
    niveau1: {
      titre:
        "Déployer systématiquement toutes les mises à jour dès que celles-ci sont disponibles (ou après qualification interne) et hors exceptions spécifiquement identifiées.",
      pourquoi:
        "recommandations/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Mettre en œuvre des mesures de sécurité supplémentaires (cloisonnement, règles EDR durcies, déconnexion AD) sur les systèmes ne pouvant pas bénéficier des mises à jour (ex : systèmes industriels, applications particulières)",
      pourquoi:
        "recommandations/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau2-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau2-comment.pug",
    },
    priorisation: 7,
  },
  "securite-poste-antivirus-deploye": {
    niveau1: {
      titre:
        "Installer de manière systématique un antivirus sur les postes de travail, vérifier régulièrement leur bon fonctionnement et leurs mises à jour.",
      pourquoi:
        "recommandations/postes/securite-poste-antivirus-deploye-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-antivirus-deploye-niveau1-comment.pug",
    },
    niveau2: {
      titre: "Traiter systématiquement les alertes générées par l'antivirus",
      pourquoi:
        "recommandations/postes/securite-poste-antivirus-deploye-niveau2-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-antivirus-deploye-niveau2-comment.pug",
    },
    priorisation: 3,
  },
  "securite-poste-si-industriel-antivirus-deploye": {
    niveau1: {
      titre:
        "Installer de manière systématique un antivirus sur les postes de travail du SI Industriel, vérifier régulièrement leur bon fonctionnement et leurs mises à jour.",
      pourquoi:
        "recommandations/postes/securite-poste-si-industriel-antivirus-deploye-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-si-industriel-antivirus-deploye-niveau1-comment.pug",
    },
    niveau2: {
      titre: "Traiter systématiquement les alertes générées par l'antivirus",
      pourquoi:
        "recommandations/postes/securite-poste-si-industriel-antivirus-deploye-niveau2-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-si-industriel-antivirus-deploye-niveau2-comment.pug",
    },
    priorisation: 3,
  },
  "securite-poste-pare-feu-local-active": {
    niveau1: {
      titre:
        "Activer systématiquement le pare-feu local sur les postes de tavail avec comme règle générale d’interdire par défaut les flux entrants. Vérifier régulièrement leur activation sur tous les postes de travail.",
      pourquoi:
        "recommandations/postes/securite-poste-pare-feu-local-active-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-pare-feu-local-active-niveau1-comment.pug",
    },
    priorisation: 4,
  },
  "securite-poste-outils-complementaires-securisation": {
    niveau1: {
      titre:
        "Mettre en place des outils complémentaires de sécurisation des postes de travail.",
      pourquoi:
        "recommandations/postes/securite-poste-outils-complementaires-securisation-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-outils-complementaires-securisation-niveau1-comment.pug",
    },
    priorisation: 25,
  },
  "securite-poste-r-et-d-disques-chiffres": {
    niveau1: {
      titre: "RECO DISQUES CHIFFRES",
      pourquoi:
        "recommandations/postes/securite-poste-r-et-d-disques-chiffres-niveau1-pourquoi.pug",
      comment:
        "recommandations/postes/securite-poste-r-et-d-disques-chiffres-niveau1-comment.pug",
    },
    priorisation: 25,
  },
  "securite-infrastructure-pare-feu-deploye": {
    niveau1: {
      titre:
        "Déployer un pare-feu physique pour protéger l’interconnexion du SI à Internet.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-pare-feu-deploye-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-pare-feu-deploye-niveau1-comment.pug",
    },
    priorisation: 20,
  },
  "securite-infrastructure-pare-feu-deploye-interconnexions-protegees": {
    niveau1: {
      titre:
        "Déployer un pare-feu physique pour protéger l’interconnexion du SI à Internet.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-pare-feu-deploye-interconnexions-protegees-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-pare-feu-deploye-interconnexions-protegees-niveau1-comment.pug",
    },
    priorisation: 20,
  },
  "securite-infrastructure-pare-feu-deploye-logs-stockes": {
    niveau1: {
      titre:
        "Activer et conserver l'historique de l’ensemble des flux bloqués et des flux entrants et sortants identifiés par le pare-feu.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-pare-feu-deploye-logs-stockes-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-pare-feu-deploye-logs-stockes-niveau1-comment.pug",
    },
    priorisation: 20,
  },
  "securite-infrastructure-si-industriel-pare-feu-deploye": {
    niveau1: {
      titre:
        "Fermer tous les flux et les ports non strictement nécessaires au SI industriel.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Dans la mesure du possible et si non nécessaire, séparer le réseau industriel du réseau bureautique interne.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau2-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau2-comment.pug",
    },
    priorisation: 20,
  },
  "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees":
    {
      niveau1: {
        titre:
          "Déployer systématiquement toutes les mises à jour dès que celles-ci sont disponibles  (ou après qualification interne) et hors exceptions spécifiquement identifiées.",
        pourquoi:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-niveau1-pourquoi.pug",
        comment:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-niveau1-comment.pug",
      },
      niveau2: {
        titre:
          "Mettre en œuvre des mesures de sécurité supplémentaires (cloisonnement, règles EDR durcies, déconnexion AD) sur les systèmes ne pouvant pas bénéficier des mises à jour (ex : systèmes industriels, applications particulières).",
        pourquoi:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-niveau2-pourquoi.pug",
        comment:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-niveau2-comment.pug",
      },
      priorisation: 2,
    },
  "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees":
    {
      niveau1: {
        titre:
          "Déployer systématiquement toutes les mises à jour dès que celles-ci sont disponibles  (ou après qualification interne) et hors exceptions spécifiquement identifiées.",
        pourquoi:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau1-pourquoi.pug",
        comment:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau1-comment.pug",
      },
      niveau2: {
        titre:
          "Mettre en œuvre des mesures de sécurité supplémentaires (cloisonnement, règles EDR durcies, déconnexion AD) sur les systèmes ne pouvant pas bénéficier des mises à jour (ex : systèmes industriels, applications particulières).",
        pourquoi:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau2-pourquoi.pug",
        comment:
          "recommandations/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau2-comment.pug",
      },
      priorisation: 2,
    },
  "securite-infrastructure-outils-securisation-systeme-messagerie": {
    niveau1: {
      titre: "Mettre en oeuvre une solution d'anti-spam et d'anti-hameçonnage.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau1-comment.pug",
    },
    niveau2: {
      titre: 'Désactiver le portail de type "webmail"',
      pourquoi:
        "recommandations/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau2-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau2-comment.pug",
    },
    priorisation: 22,
  },
  "securite-infrastructure-acces-wifi-securises": {
    niveau1: {
      titre: "Mettre en place des mesures de sécurisation wifi.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-acces-wifi-securises-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-acces-wifi-securises-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Restreindre l'accès à l'interface d’administration dédiée seulement via le réseau cablé (et non en Wifi).",
      pourquoi:
        "recommandations/infras/securite-infrastructure-acces-wifi-securises-niveau2-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-acces-wifi-securises-niveau2-comment.pug",
    },
    priorisation: 29,
  },
  "securite-infrastructure-espace-stockage-serveurs": {
    niveau1: {
      titre:
        "Mettre en place des mesures de sécurisation de l'espace dédié au stockage des serveurs d'administration et des équipements réseau.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-espace-stockage-serveurs-niveau1-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-espace-stockage-serveurs-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation de l'espace dédié au stockage des serveurs d'administration et des équipements réseau.",
      pourquoi:
        "recommandations/infras/securite-infrastructure-espace-stockage-serveurs-niveau2-pourquoi.pug",
      comment:
        "recommandations/infras/securite-infrastructure-espace-stockage-serveurs-niveau2-comment.pug",
    },
    priorisation: 30,
  },
  "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques": {
    niveau1: {
      titre: "Mettre en œuvre des bonnes pratiques de sensibilisation.",
      pourquoi:
        "recommandations/sensibilisation/sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-niveau1-pourquoi.pug",
      comment:
        "recommandations/sensibilisation/sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation de l'espace dédié au stockage des serveurs d'administration et des équipements réseau.",
      pourquoi:
        "recommandations/sensibilisation/sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-niveau2-pourquoi.pug",
      comment:
        "recommandations/sensibilisation/sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-niveau2-comment.pug",
    },
    priorisation: 13,
  },
  "sensibilisation-risque-espionnage-industriel-r-et-d": {
    niveau1: {
      titre: "Mettre en œuvre des bonnes pratiques de sensibilisation.",
      pourquoi:
        "recommandations/sensibilisation/sensibilisation-risque-espionnage-industriel-r-et-d-niveau1-pourquoi.pug",
      comment:
        "recommandations/sensibilisation/sensibilisation-risque-espionnage-industriel-r-et-d-niveau1-comment.pug",
    },
    priorisation: 13,
  },
  "sensibilisation-collaborateurs-soumis-obligations-usages-securises": {
    niveau1: {
      titre:
        "Établir une charte informatique répertoriant les moyens informatiques mis à disposition, clarifiant la gestion des terminaux personnels et rappelant à minima les exigences de cybersécurité liées à la gestion des comptes d'accès, des mots de passe, des données à protéger en priorités, de l'utilisation de la messagerie et des ressources cloud.",
      pourquoi:
        "recommandations/sensibilisation/sensibilisation-collaborateurs-soumis-obligations-usages-securises-niveau1-pourquoi.pug",
      comment:
        "recommandations/sensibilisation/sensibilisation-collaborateurs-soumis-obligations-usages-securises-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "S'assurer que la charte informatique est annexée au contrat de travail et est signée par les salariés.",
      pourquoi:
        "recommandations/sensibilisation/sensibilisation-collaborateurs-soumis-obligations-usages-securises-niveau2-pourquoi.pug",
      comment:
        "recommandations/sensibilisation/sensibilisation-collaborateurs-soumis-obligations-usages-securises-niveau2-comment.pug",
    },
    priorisation: 23,
  },
  "sensibilisation-declaration-incidents-encouragee": {
    niveau1: {
      titre:
        'Encourager régulièrement (2 fois par an à minima) la déclaration d’incident auprès de vos agents en rappelant les évènements "signaux faibles" devant être signalés ainsi que le contact à alerter.' +
        "Formaliser et diffuser une fiche réflexe dédiée aux utilisateurs.",
      pourquoi:
        "recommandations/sensibilisation/sensibilisation-declaration-incidents-encouragee-niveau1-pourquoi.pug",
      comment:
        "recommandations/sensibilisation/sensibilisation-declaration-incidents-encouragee-niveau1-comment.pug",
    },
    priorisation: 16,
  },
  "reaction-surveillance-veille-vulnerabilites-potentielles": {
    niveau1: {
      titre: "Réaliser une veille trimestrielle sur internet.",
      pourquoi:
        "recommandations/reaction/reaction-surveillance-veille-vulnerabilites-potentielles-niveau1-pourquoi.pug",
      comment:
        "recommandations/reaction/reaction-surveillance-veille-vulnerabilites-potentielles-niveau1-comment.pug",
    },
    niveau2: {
      titre: "Réaliser une veille proactive régulière.",
      pourquoi:
        "recommandations/reaction/reaction-surveillance-veille-vulnerabilites-potentielles-niveau2-pourquoi.pug",
      comment:
        "recommandations/reaction/reaction-surveillance-veille-vulnerabilites-potentielles-niveau2-comment.pug",
    },
    priorisation: 32,
  },
  "reaction-sauvegardes-donnees-realisees": {
    niveau1: {
      titre:
        "Réaliser des sauvegardes régulières autant que de besoin et dont le rythme est jugé acceptable par le CODIR.",
      pourquoi:
        "recommandations/reaction/reaction-sauvegardes-donnees-realisees-niveau1-pourquoi.pug",
      comment:
        "recommandations/reaction/reaction-sauvegardes-donnees-realisees-niveau1-comment.pug",
    },
    priorisation: 6,
  },
  "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole":
    {
      niveau1: {
        titre:
          "Procéder régulièrement à des tests de restauration des données critiques qui sont stockées dans un environnement sécurisé et isolée d'internet, à minima une fois par semestre.",
        pourquoi:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-niveau1-pourquoi.pug",
        comment:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-niveau1-comment.pug",
      },
      priorisation: 10,
    },
  "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement":
    {
      niveau1: {
        titre:
          "En complément des sauvegardes régulièrement réalisées et stockées sur le réseau, disposer d'une sauvegarde des données critiques stockées dans un environnement sécurisé, isolé de l'environnement bureautique et d’internet (ex : sauvegarde amovible, hors AD, cloud privé, solution de sauvegarde externalisée dédiée). Déterminer le rythme de sauvegarde avec le CODIR.",
        pourquoi:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-niveau1-pourquoi.pug",
        comment:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-niveau1-comment.pug",
      },
      priorisation: 9,
    },
  "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole":
    {
      niveau1: {
        titre:
          "En complément des sauvegardes régulièrement réalisées et stockées sur le réseau, disposer d'une sauvegarde des données critiques stockées dans un environnement sécurisé, isolé de l'environnement bureautique et d’internet (ex : sauvegarde amovible, hors AD, cloud privé, solution de sauvegarde externalisée dédiée). Déterminer le rythme de sauvegarde avec le CODIR.",
        pourquoi:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-niveau1-pourquoi.pug",
        comment:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-niveau1-comment.pug",
      },
      priorisation: 10,
    },
  "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement":
    {
      niveau1: {
        titre:
          "En complément des sauvegardes régulièrement réalisées et stockées sur le réseau, disposer d'une sauvegarde des données critiques stockées dans un environnement sécurisé, isolé de l'environnement bureautique et d’internet (ex : sauvegarde amovible, hors AD, cloud privé, solution de sauvegarde externalisée dédiée). Déterminer le rythme de sauvegarde avec le CODIR.",
        pourquoi:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-niveau1-pourquoi.pug",
        comment:
          "recommandations/reaction/reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-niveau1-comment.pug",
      },
      priorisation: 9,
    },
  "reaction-dispositif-gestion-crise-adapte-defini": {
    niveau1: {
      titre:
        "Lister les personnes à contacter en cas d’incident de sécurité informatique.",
      pourquoi:
        "recommandations/reaction/reaction-dispositif-gestion-crise-adapte-defini-niveau1-pourquoi.pug",
      comment:
        "recommandations/reaction/reaction-dispositif-gestion-crise-adapte-defini-niveau1-comment.pug",
    },
    niveau2: {
      titre:
        "Définir des premières mesures organisationnelles de gestion de crise cyber.",
      pourquoi:
        "recommandations/reaction/reaction-dispositif-gestion-crise-adapte-defini-niveau2-pourquoi.pug",
      comment:
        "recommandations/reaction/reaction-dispositif-gestion-crise-adapte-defini-niveau2-comment.pug",
    },
    priorisation: 15,
  },
  "reaction-assurance-cyber-souscrite": {
    niveau1: {
      titre:
        "Evaluer l'opportunité à souscrire à une police d’assurance du risque cyber (ou de la compléter).",
      pourquoi:
        "recommandations/reaction/reaction-assurance-cyber-souscrite-niveau1-pourquoi.pug",
      comment:
        "recommandations/reaction/reaction-assurance-cyber-souscrite-niveau1-comment.pug",
    },
    priorisation: 34,
  },
};

export { tableauRecommandations };
