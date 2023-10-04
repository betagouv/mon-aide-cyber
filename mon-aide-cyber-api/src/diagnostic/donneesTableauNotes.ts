import { TableauDeNotes } from "./TableauDeNotes";

const tableauDeNotes: TableauDeNotes = {
  "gouvernance-infos-et-processus-a-proteger": {
    notation: {
      "gouvernance-infos-et-processus-a-proteger-nsp": null,
      "gouvernance-infos-et-processus-a-proteger-non": 0,
      "gouvernance-infos-et-processus-a-proteger-oui-idee-generale": 1.5,
      "gouvernance-infos-et-processus-a-proteger-oui-precise": 3,
    },
  },
  "gouvernance-schema-si-a-jour": {
    notation: {
      "gouvernance-schema-si-a-jour-nsp": null,
      "gouvernance-schema-si-a-jour-non": 0,
      "gouvernance-schema-si-a-jour-oui-macro": 2,
      "gouvernance-schema-si-a-jour-oui-detaille": 3,
    },
  },
  "gouvernance-schema-si-industriel-a-jour": {
    notation: {
      "gouvernance-schema-si-industriel-a-jour-na": undefined,
      "gouvernance-schema-si-industriel-a-jour-nsp": null,
      "gouvernance-schema-si-industriel-a-jour-non": 0,
      "gouvernance-schema-si-industriel-a-jour-oui-partiel": 2,
      "gouvernance-schema-si-industriel-a-jour-oui-detaille": 3,
    },
  },
  "gouvernance-connaissance-rgpd": {
    notation: {
      "gouvernance-connaissance-rgpd-nsp": null,
      "gouvernance-connaissance-rgpd-non": 0,
      "gouvernance-connaissance-rgpd-oui": {
        operation: "moyenne",
        reponses: {
          "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-na":
            undefined,
          "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-nsp":
            null,
          "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-non": 0,
          "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-oui": 3,
          "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-na":
            undefined,
          "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-nsp":
            null,
          "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-non": 0,
          "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-oui": 3,
          "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-na":
            undefined,
          "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-nsp":
            null,
          "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-non": 0,
          "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-oui": 3,
        },
      },
    },
  },
  "gouvernance-exigence-cyber-securite-presta": {
    notation: {
      "gouvernance-exigence-cyber-securite-presta-na": undefined,
      "gouvernance-exigence-cyber-securite-presta-nsp": null,
      "gouvernance-exigence-cyber-securite-presta-non": 0,
      "gouvernance-exigence-cyber-securite-presta-oui-formalisee": 2,
      "gouvernance-exigence-cyber-securite-presta-oui-fixee": 3,
    },
  },
  "gouvernance-exigence-cyber-securite-presta-si-industriel": {
    notation: {
      "gouvernance-exigence-cyber-securite-presta-si-industriel-na": undefined,
      "gouvernance-exigence-cyber-securite-presta-si-industriel-nsp": null,
      "gouvernance-exigence-cyber-securite-presta-si-industriel-non": 0,
      "gouvernance-exigence-cyber-securite-presta-si-industriel-oui-formalisee": 2,
      "gouvernance-exigence-cyber-securite-presta-si-industriel-oui-fixee": 3,
    },
  },
  "acces-outil-gestion-des-comptes": {
    notation: {
      "acces-outil-gestion-des-comptes-na": undefined,
      "acces-outil-gestion-des-comptes-nsp": null,
      "acces-outil-gestion-des-comptes-oui": 3,
      "acces-outil-gestion-des-comptes-non": 0,
    },
  },
  "acces-liste-compte-utilisateurs": {
    notation: {
      "acces-liste-compte-utilisateurs-na": undefined,
      "acces-liste-compte-utilisateurs-nsp": null,
      "acces-liste-compte-utilisateurs-non": 0,
      "acces-liste-compte-utilisateurs-revue-reguliere": 2,
      "acces-liste-compte-utilisateurs-revue-en-continu": 3,
    },
  },
  "acces-droits-acces-utilisateurs-limites": {
    notation: {
      "acces-droits-acces-utilisateurs-limites-na": undefined,
      "acces-droits-acces-utilisateurs-limites-nsp": null,
      "acces-droits-acces-utilisateurs-limites-non": 0,
      "acces-droits-acces-utilisateurs-limites-restrictions-ponctuelles": 1,
      "acces-droits-acces-utilisateurs-limites-restrictions-limitees": 3,
    },
  },
  "acces-administrateurs-informatiques-suivie-et-limitee": {
    notation: {
      "acces-administrateurs-informatiques-suivie-et-limitee-nsp": null,
      "acces-administrateurs-informatiques-suivie-et-limitee-non": 0,
      "acces-administrateurs-informatiques-suivie-et-limitee-revue-reguliere": 2,
      "acces-administrateurs-informatiques-suivie-et-limitee-revue-continue": 3,
    },
  },
  "acces-utilisation-comptes-administrateurs-droits-limitee": {
    notation: {
      "acces-utilisation-comptes-administrateurs-droits-limitee-nsp": null,
      "acces-utilisation-comptes-administrateurs-droits-limitee-non": 0,
      "acces-utilisation-comptes-administrateurs-droits-quelques-restrictions": 2,
      "acces-utilisation-comptes-administrateurs-droits-justifies": 3,
    },
  },
  "acces-utilisateurs-administrateurs-poste": {
    notation: {
      "acces-utilisateurs-administrateurs-poste-nsp": null,
      "acces-utilisateurs-administrateurs-poste-oui": 0,
      "acces-utilisateurs-administrateurs-poste-suppression-privilege-en-cours": 1,
      "acces-utilisateurs-administrateurs-poste-non-exceptions-justifiees": 3,
    },
  },
  "acces-mesures-securite-robustesse-mdp": {
    notation: {
      "acces-mesures-securite-robustesse-mdp-nsp": null,
      "acces-mesures-securite-robustesse-mdp-non": 0,
      "acces-mesures-securite-robustesse-mdp-utilisateurs-sensibilises": 1,
      "acces-mesures-securite-robustesse-mdp-contraintes-par-defaut": 3,
    },
  },
  "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles": {
    notation: {
      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-na":
        undefined,
      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-nsp":
        null,
      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-non": 0,
      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees": 2,
      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees-et-donnees-chiffrees": 3,
    },
  },
  "acces-teletravail-acces-distants-mesures-particulieres": {
    notation: {
      "acces-teletravail-acces-distants-mesures-particulieres-na": undefined,
      "acces-teletravail-acces-distants-mesures-particulieres-nsp": null,
      "acces-teletravail-acces-distants-mesures-particulieres-non": 0,
      "acces-teletravail-acces-distants-mesures-particulieres-mfa": 2,
      "acces-teletravail-acces-distants-mesures-particulieres-vpn": 3,
    },
  },
  "acces-si-industriel-teletravail-acces-distants-mesures-particulieres": {
    notation: {
      "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-nsp":
        null,
      "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-non": 0,
      "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-mfa": 2,
      "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-vpn": 3,
    },
  },
  "acces-entite-dispose-plusieurs-sites-geographiques": {
    notation: {
      "acces-entite-dispose-plusieurs-sites-geographiques-na": undefined,
      "acces-entite-dispose-plusieurs-sites-geographiques-nsp": null,
      "acces-entite-dispose-plusieurs-sites-geographiques-non": 0,
      "acces-entite-dispose-plusieurs-sites-geographiques-oui": 3,
    },
  },
  "acces-administrateurs-si-mesures-specifiques": {
    notation: {
      "acces-administrateurs-si-mesures-specifiques-na": undefined,
      "acces-administrateurs-si-mesures-specifiques-nsp": null,
      "acces-administrateurs-si-mesures-specifiques-non": 0,
      "acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees": 1.5,
      "acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees-postes-dedies-administration": 3,
    },
  },
  "securite-poste-maj-fonctionnelles-et-securite-deployees": {
    notation: {
      "securite-poste-maj-fonctionnelles-et-securite-deployees-na": undefined,
      "securite-poste-maj-fonctionnelles-et-securite-deployees-nsp": null,
      "securite-poste-maj-fonctionnelles-et-securite-deployees-non": 0,
      "securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-exceptions": 2,
      "securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-des-que-disponibles": 3,
    },
  },
  "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees": {
    notation: {
      "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-na":
        undefined,
      "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-nsp":
        null,
      "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-non": 0,
      "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-exceptions": 2,
      "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-des-que-disponibles": 3,
    },
  },
  "securite-poste-antivirus-deploye": {
    notation: {
      "securite-poste-antivirus-deploye-nsp": null,
      "securite-poste-antivirus-deploye-non": 0,
      "securite-poste-antivirus-deploye-oui-alertes-pas-toujours-traitees": 2,
      "securite-poste-antivirus-deploye-oui-alertes-toujours-traitees": 3,
    },
  },
  "securite-poste-si-industriel-antivirus-deploye": {
    notation: {
      "securite-poste-si-industriel-antivirus-deploye-nsp": null,
      "securite-poste-si-industriel-antivirus-deploye-non": 0,
      "securite-poste-si-industriel-antivirus-deploye-oui-alertes-pas-toujours-traitees": 2,
      "securite-poste-si-industriel-antivirus-deploye-oui-alertes-toujours-traitees": 3,
    },
  },
  "securite-poste-pare-feu-local-active": {
    notation: {
      "securite-poste-pare-feu-local-active-nsp": null,
      "securite-poste-pare-feu-local-active-non": 0,
      "securite-poste-pare-feu-local-active-oui": 3,
    },
  },
  "securite-poste-outils-complementaires-securisation": {
    notation: {
      "securite-poste-outils-complementaires-securisation-nsp": null,
      "securite-poste-outils-complementaires-securisation-non": 0,
      "securite-poste-outils-complementaires-securisation-oui-filtrage-acces-internet": 1,
      "securite-poste-outils-complementaires-securisation-oui-outil-complementaire-type-edr": 3,
    },
  },
  "securite-poste-r-et-d-disques-chiffres": {
    notation: {
      "securite-poste-r-et-d-disques-chiffres-na": undefined,
      "securite-poste-r-et-d-disques-chiffres-nsp": null,
      "securite-poste-r-et-d-disques-chiffres-non": 0,
      "securite-poste-r-et-d-disques-chiffres-oui": 3,
    },
  },
  "securite-infrastructure-pare-feu-deploye": {
    notation: {
      "securite-infrastructure-pare-feu-deploye-nsp": null,
      "securite-infrastructure-pare-feu-deploye-non": 0,
      "securite-infrastructure-pare-feu-deploye-oui": {
        operation: "moyenne",
        reponses: {
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-nsp":
            null,
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-non": 0,
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-oui": 3,
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-nsp":
            null,
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-non": 0,
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-oui-logs-stockes": 1,
          "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-oui-logs-stockes-conserves-6-mois": 3,
        },
      },
    },
  },
  "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees":
    {
      notation: {
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-nsp":
          null,
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-non": 0,
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-a-intervalle-regulier": 2,
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-des-que-possible": 3,
      },
    },
  "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees":
    {
      notation: {
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-nsp":
          null,
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-non": 0,
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-a-intervalle-regulier": 2,
        "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-des-que-possible": 3,
      },
    },
  "securite-infrastructure-outils-securisation-systeme-messagerie": {
    notation: {
      "securite-infrastructure-outils-securisation-systeme-messagerie-na":
        undefined,
      "securite-infrastructure-outils-securisation-systeme-messagerie-nsp":
        null,
      "securite-infrastructure-outils-securisation-systeme-messagerie-non": 0,
      "securite-infrastructure-outils-securisation-systeme-messagerie-antispam": 2,
      "securite-infrastructure-outils-securisation-systeme-messagerie-webmail": 3,
    },
  },
  "securite-infrastructure-acces-wifi-securises": {
    notation: {
      "securite-infrastructure-acces-wifi-securises-na": undefined,
      "securite-infrastructure-acces-wifi-securises-nsp": null,
      "securite-infrastructure-acces-wifi-securises-non": 0,
      "securite-infrastructure-acces-wifi-securises-oui-chiffrement-robuste": 2,
      "securite-infrastructure-acces-wifi-securises-oui-chiffrement-robuste-acces-visiteur-restreint": 3,
    },
  },
  "securite-infrastructure-espace-stockage-serveurs": {
    notation: {
      "securite-infrastructure-espace-stockage-serveurs-na": undefined,
      "securite-infrastructure-espace-stockage-serveurs-nsp": null,
      "securite-infrastructure-espace-stockage-serveurs-non": 0,
      "securite-infrastructure-espace-stockage-serveurs-oui-porte-ferme-a-clef": 1.5,
      "securite-infrastructure-espace-stockage-serveurs-oui-porte-ferme-a-clef-videosurveillance": 3,
    },
  },
  "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques": {
    notation: {
      "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-nsp":
        null,
      "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-non": 0,
      "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-oui-ponctuellement": 1.5,
      "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-oui-regulierement": 3,
    },
  },
  "sensibilisation-risque-espionnage-industriel-r-et-d": {
    notation: {
      "sensibilisation-risque-espionnage-industriel-r-et-d-na": undefined,
      "sensibilisation-risque-espionnage-industriel-r-et-d-nsp": null,
      "sensibilisation-risque-espionnage-industriel-r-et-d-non": 0,
      "sensibilisation-risque-espionnage-industriel-r-et-d-oui": 3,
    },
  },
  "sensibilisation-collaborateurs-soumis-obligations-usages-securises": {
    notation: {
      "sensibilisation-collaborateurs-soumis-obligations-usages-securises-nsp":
        null,
      "sensibilisation-collaborateurs-soumis-obligations-usages-securises-non": 0,
      "sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui-charte-communiquee": 2,
      "sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui-charte-signee": 3,
    },
  },
  "sensibilisation-declaration-incidents-encouragee": {
    notation: {
      "sensibilisation-declaration-incidents-encouragee-nsp": null,
      "sensibilisation-declaration-incidents-encouragee-non": 0,
      "sensibilisation-declaration-incidents-encouragee-non-habitude-utilisateurs-contactent-informaticien": 1,
      "sensibilisation-declaration-incidents-encouragee-oui": 3,
    },
  },
  "reaction-surveillance-veille-vulnerabilites-potentielles": {
    notation: {
      "reaction-surveillance-veille-vulnerabilites-potentielles-nsp": null,
      "reaction-surveillance-veille-vulnerabilites-potentielles-non": 0,
      "reaction-surveillance-veille-vulnerabilites-potentielles-veille-ponctuelle": 1.5,
      "reaction-surveillance-veille-vulnerabilites-potentielles-veille-reguliere": 3,
    },
  },
  "reaction-sauvegardes-donnees-realisees": {
    notation: {
      "reaction-sauvegardes-donnees-realisees-nsp": null,
      "reaction-sauvegardes-donnees-realisees-non": 0,
      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement": {
        operation: "moyenne",
        reponses: {
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-na":
            null,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-nsp": 0.5,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-non": 0,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui": 2.5,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui-jeu-chiffre": 3,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-na":
            null,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-nsp": 0.5,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-non": 0,
          "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-oui": 3,
        },
      },
      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere": {
        operation: "moyenne",
        reponses: {
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-na":
            null,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-nsp": 0.5,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-non": 0,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui": 2.5,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui-jeu-chiffre": 3,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-na":
            null,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-nsp": 0.5,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-non": 0,
          "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-oui": 3,
        },
      },
    },
  },
  "reaction-dispositif-gestion-crise-adapte-defini": {
    notation: {
      "reaction-dispositif-gestion-crise-adapte-defini-nsp": null,
      "reaction-dispositif-gestion-crise-adapte-defini-non": 0,
      "reaction-dispositif-gestion-crise-adapte-defini-oui-fiche-reflexe": 1.5,
      "reaction-dispositif-gestion-crise-adapte-defini-oui-organisation-gestion-crise-definie": 3,
    },
  },
  "reaction-assurance-cyber-souscrite": {
    notation: {
      "reaction-assurance-cyber-souscrite-nsp": null,
      "reaction-assurance-cyber-souscrite-non-pas-pense": 0,
      "reaction-assurance-cyber-souscrite-non-pas-necessaire": null,
      "reaction-assurance-cyber-souscrite-oui": {
        reponses: {
          "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-financement-remediation": 1,
          "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-financement-pallier-impact-financier": 1,
          "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-accompagnement-gestion-crise": 1,
          "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-na":
            null,
          "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-nsp": 0.5,
          "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-non": 0,
          "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-oui": 3,
        },
        operation: "moyenne",
      },
    },
  },
};

export { tableauDeNotes };
