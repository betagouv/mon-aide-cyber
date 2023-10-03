import { QuestionsThematique } from "../Referentiel";

export const donneesSecuriteAcces: QuestionsThematique = {
  questions: [
    {
      identifiant: "acces-outil-gestion-des-comptes",
      libelle:
        "Un outil de gestion des comptes et des politiques de sécurité centralisé (ex : Active Directory, Samba-AD, Azure AD) est-il déployé au sein du système d'information ?",
      reponsesPossibles: [
        {
          identifiant: "acces-outil-gestion-des-comptes-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant: "acces-outil-gestion-des-comptes-oui",
          libelle: "Oui",
          ordre: 2,
        },
        {
          identifiant: "acces-outil-gestion-des-comptes-non",
          libelle: "Non",
          ordre: 1,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-liste-compte-utilisateurs",
      libelle:
        "La liste des comptes des utilisateurs (prestataires inclus) ayant le droit d'accéder au système et application est-elle maintenue à jour ?",
      reponsesPossibles: [
        {
          identifiant: "acces-liste-compte-utilisateurs-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant: "acces-liste-compte-utilisateurs-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant: "acces-liste-compte-utilisateurs-revue-reguliere",
          libelle:
            "Les comptes des utilisateurs et leurs accès sont régulièrement revus (ex : liste du personnel vs liste des comptes).",
          ordre: 2,
        },
        {
          identifiant: "acces-liste-compte-utilisateurs-revue-en-continu",
          libelle:
            "La liste des comptes des utilisateurs est mise à jour en continu dans le cadre d'un processus de suppression systématique des comptes inactifs. Une revue annuelle est également réalisée.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-droits-acces-utilisateurs-limites",
      libelle:
        "Les droits d'accès des utilisateurs aux données, aux systèmes et aux applications métiers sont-ils limités à leurs besoins métiers ?",
      reponsesPossibles: [
        {
          identifiant: "acces-droits-acces-utilisateurs-limites-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant: "acces-droits-acces-utilisateurs-limites-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-droits-acces-utilisateurs-limites-restrictions-ponctuelles",
          libelle:
            "Des restrictions d’accès à certaines données sont ponctuellement mises en place.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-droits-acces-utilisateurs-limites-restrictions-limitees",
          libelle:
            "L’accès des utilisateurs aux données, aux systèmes et aux applications sont limités aux seuls accès nécessaires à leur activité.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-administrateurs-informatiques-suivie-et-limitee",
      libelle:
        "La liste des comptes des administrateurs informatiques (prestataires inclus) est-elle suivie et limitée au strict nécessaire ?",
      reponsesPossibles: [
        {
          identifiant:
            "acces-administrateurs-informatiques-suivie-et-limitee-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant:
            "acces-administrateurs-informatiques-suivie-et-limitee-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-administrateurs-informatiques-suivie-et-limitee-revue-reguliere",
          libelle:
            "Les comptes des administrateurs sont régulièrement revus (ex : liste du personnel vs liste des comptes).",
          ordre: 2,
        },
        {
          identifiant:
            "acces-administrateurs-informatiques-suivie-et-limitee-revue-continue",
          libelle:
            "La liste des comptes des administrateurs est mise à jour en continu dans le cadre d'un processus de suppression systématique des comptes inactifs. Une revue annuelle est également réalisée.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-utilisation-comptes-administrateurs-droits-limitee",
      libelle:
        "L'utilisation des comptes administrateurs et des droits d'accès d'administration est-elle bien limitée aux tâches d'administration ?",
      reponsesPossibles: [
        {
          identifiant:
            "acces-utilisation-comptes-administrateurs-droits-limitee-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant:
            "acces-utilisation-comptes-administrateurs-droits-limitee-non",
          libelle:
            "Non, des utilisateurs disposent de privilèges d’administration sans restrictions particulières.",
          ordre: 1,
        },
        {
          identifiant:
            "acces-utilisation-comptes-administrateurs-droits-quelques-restrictions",
          libelle:
            "La mise à disposition des comptes d'administration et des droits d'accès d'administration fait l'objet de quelques restrictions.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-utilisation-comptes-administrateurs-droits-justifies",
          libelle:
            "Tous les comptes administration et tous les accès d'administration sont justifiés, dédiés et utilisés aux seules tâches d'administration.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-utilisateurs-administrateurs-poste",
      libelle: "Les utilisateurs sont-ils administrateurs de leur poste ?",
      reponsesPossibles: [
        {
          identifiant: "acces-utilisateurs-administrateurs-poste-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant: "acces-utilisateurs-administrateurs-poste-oui",
          libelle: "Oui",
          ordre: 1,
        },
        {
          identifiant:
            "acces-utilisateurs-administrateurs-poste-suppression-privilege-en-cours",
          libelle:
            "La suppression de ce privilège est en cours de traitement, plusieurs utilisateurs sont toujours administrateurs de leur poste.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-utilisateurs-administrateurs-poste-non-exceptions-justifiees",
          libelle: "Non, et les rares exceptions sont justifiées.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-mesures-securite-robustesse-mdp",
      libelle:
        "Avez-vous mis en place des mesures de sécurité particulières afin de renforcer la robustesse des mots de passe permettant aux utilisateurs d'accéder à leur session ?",
      reponsesPossibles: [
        {
          identifiant: "acces-mesures-securite-robustesse-mdp-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant: "acces-mesures-securite-robustesse-mdp-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-mesures-securite-robustesse-mdp-utilisateurs-sensibilises",
          libelle:
            "Les utilisateurs sont sensibilisés à la gestion sécurisée de leurs mots de passe.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-mesures-securite-robustesse-mdp-contraintes-par-defaut",
          libelle:
            "Des contraintes en matière de sécurité des mots de passe sont exigées par défaut pour l'accès des utilisateurs à leur compte.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant:
        "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles",
      libelle:
        "L'accès des utilisateurs aux ressources et données les plus sensibles fait-il l’objet de mesures de sécurité additionnelles ?",
      reponsesPossibles: [
        {
          identifiant:
            "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant:
            "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees",
          libelle:
            "Oui, des mesures renforçant l'authentification ont été mises en œuvre.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees-et-donnees-chiffrees",
          libelle:
            "Oui, des mesures renforçant l'authentification ont été mises en œuvre et les données sont chiffrées.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-teletravail-acces-distants-mesures-particulieres",
      libelle:
        "Le télétravail et les accès distants (cloud inclus) font-ils l'objet de mesures de sécurité particulières ?",
      reponsesPossibles: [
        {
          identifiant:
            "acces-teletravail-acces-distants-mesures-particulieres-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant:
            "acces-teletravail-acces-distants-mesures-particulieres-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-teletravail-acces-distants-mesures-particulieres-mfa",
          libelle:
            "De l'authentification à double facteurs a été mise en place pour les accès distants.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-teletravail-acces-distants-mesures-particulieres-vpn",
          libelle: "Les connexions à distance sont réalisées via un VPN.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant:
        "acces-si-industriel-teletravail-acces-distants-mesures-particulieres",
      libelle:
        "Si l'entité dispose d'un SI industriel : les accès distants sur les machines, outils et SI industriels font-ils l'objet de mesures de sécurité particulières ?",
      reponsesPossibles: [
        {
          identifiant:
            "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant:
            "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-mfa",
          libelle:
            "De l'authentification à double facteurs a été mise en place pour les accès distants.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-vpn",
          libelle: "Les connexions à distance sont réalisées via un VPN.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-entite-dispose-plusieurs-sites-geographiques",
      libelle:
        "Si l'entité dispose de plusieurs sites géographiques interconnectés, et si à risque d'espionnage industriel : les interconnexions \"site à site\" font-elles l'objet de mesures de sécurité particulières ?",
      reponsesPossibles: [
        {
          identifiant: "acces-entite-dispose-plusieurs-sites-geographiques-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant: "acces-entite-dispose-plusieurs-sites-geographiques-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant: "acces-entite-dispose-plusieurs-sites-geographiques-oui",
          libelle: 'Oui les interconnexions "site à site" sont chiffrées.',
          ordre: 2,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "acces-administrateurs-si-mesures-specifiques",
      libelle:
        "Les accès des administrateurs aux systèmes d'information font-ils l’objet de mesures de sécurité spécifiques ?",
      reponsesPossibles: [
        {
          identifiant: "acces-administrateurs-si-mesures-specifiques-nsp",
          libelle: "Je ne sais pas / Non applicable",
          ordre: 0,
        },
        {
          identifiant: "acces-administrateurs-si-mesures-specifiques-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees",
          libelle:
            "Oui, des mesures renforçant l'authentification ont été mises en œuvre.",
          ordre: 2,
        },
        {
          identifiant:
            "acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees-postes-dedies-administration",
          libelle:
            "Oui, des mesures renforçant l'authentification ont été mises en œuvre et des postes dédiés à l'administration sont utilisés.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
  ],
};
