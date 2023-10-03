import { QuestionsThematique } from "../Referentiel";

export const donneesReaction: QuestionsThematique = {
  questions: [
    {
      identifiant: "reaction-surveillance-veille-vulnerabilites-potentielles",
      libelle:
        "Une surveillance ou une veille des vulnérabilités potentielles pouvant vous affecter est-elle réalisée ?",
      reponsesPossibles: [
        {
          identifiant:
            "reaction-surveillance-veille-vulnerabilites-potentielles-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant:
            "reaction-surveillance-veille-vulnerabilites-potentielles-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "reaction-surveillance-veille-vulnerabilites-potentielles-veille-ponctuelle",
          libelle: "Réalisation d'une veille ponctuelle sur internet.",
          ordre: 2,
        },
        {
          identifiant:
            "reaction-surveillance-veille-vulnerabilites-potentielles-veille-reguliere",
          libelle: "Réalisation d'une veille régulière et exhaustive.",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "reaction-sauvegardes-donnees-realisees",
      libelle:
        "Des sauvegardes régulières des données et des systèmes d'information sont-elles réalisées ?",
      reponsesPossibles: [
        {
          identifiant: "reaction-sauvegardes-donnees-realisees-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant: "reaction-sauvegardes-donnees-realisees-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "reaction-sauvegardes-donnees-realisees-oui-ponctuellement",
          libelle:
            "Des sauvegardes des données et des systèmes d'information sont réalisées ponctuellement.",
          questions: [
            {
              identifiant:
                "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole",
              libelle:
                'Si "Oui" : Existe-t-il au moins une sauvegarde des données critiques stockées dans un environnement isolé du réseau bureautique interne et d’internet ?',
              reponsesPossibles: [
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-na",
                  libelle: "Non applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-non",
                  libelle: "Non",
                  ordre: 2,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui",
                  libelle: "Oui",
                  ordre: 3,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui-jeu-chiffre",
                  libelle:
                    "Oui, et le jeu de sauvegarde externalisé est chiffré",
                  ordre: 4,
                },
              ],
              type: "choixUnique",
            },
            {
              identifiant:
                "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement",
              libelle:
                'Si "Oui" : La restauration de toutes les sauvegardes est-elle testée régulièrement ?',
              reponsesPossibles: [
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-na",
                  libelle: "Non applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-non",
                  libelle: "Non",
                  ordre: 2,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-oui",
                  libelle: "Oui",
                  ordre: 3,
                },
              ],
              type: "choixUnique",
            },
          ],
          ordre: 2,
        },
        {
          identifiant:
            "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere",
          libelle:
            "Des sauvegardes des données et des systèmes sont réalisées de manière automatique et régulière",
          questions: [
            {
              identifiant:
                "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole",
              libelle:
                'Si "Oui" : Existe-t-il au moins une sauvegarde des données critiques stockées dans un environnement isolé du réseau bureautique interne et d’internet ?',
              reponsesPossibles: [
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-na",
                  libelle: "Non applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-non",
                  libelle: "Non",
                  ordre: 2,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui",
                  libelle: "Oui",
                  ordre: 3,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui-jeu-chiffre",
                  libelle:
                    "Oui, et le jeu de sauvegarde externalisé est chiffré",
                  ordre: 4,
                },
              ],
              type: "choixUnique",
            },
            {
              identifiant:
                "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement",
              libelle:
                'Si "Oui" : La restauration de toutes les sauvegardes est-elle testée régulièrement ?',
              reponsesPossibles: [
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-na",
                  libelle: "Non applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-non",
                  libelle: "Non",
                  ordre: 2,
                },
                {
                  identifiant:
                    "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-oui",
                  libelle: "Oui",
                  ordre: 3,
                },
              ],
              type: "choixUnique",
            },
          ],
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "reaction-dispositif-gestion-crise-adapte-defini",
      libelle:
        "Un dispositif de gestion de crise adapté au risque de cyberattaques a-t-il été défini ?",
      reponsesPossibles: [
        {
          identifiant: "reaction-dispositif-gestion-crise-adapte-defini-nsp",
          libelle: "Je ne sais pas",
          ordre: 0,
        },
        {
          identifiant: "reaction-dispositif-gestion-crise-adapte-defini-non",
          libelle: "Non",
          ordre: 1,
        },
        {
          identifiant:
            "reaction-dispositif-gestion-crise-adapte-defini-oui-fiche-reflexe",
          libelle: "Nous avons défini une fiche réflexe dédiée.",
          ordre: 2,
        },
        {
          identifiant:
            "reaction-dispositif-gestion-crise-adapte-defini-oui-organisation-gestion-crise-definie",
          libelle:
            "Oui, une organisation de gestion de crise d'origine cyber a été définie",
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
    {
      identifiant: "reaction-assurance-cyber-souscrite",
      libelle: "Votre organisation a-t-elle souscrit à une assurance cyber ?",
      reponsesPossibles: [
        {
          identifiant: "reaction-assurance-cyber-souscrite-nsp",
          libelle: "Je ne sais pas.",
          ordre: 0,
        },
        {
          identifiant: "reaction-assurance-cyber-souscrite-non-pas-pense",
          libelle: "Non, je n'y ai pas pensé.",
          ordre: 1,
        },
        {
          identifiant: "reaction-assurance-cyber-souscrite-non-pas-necessaire",
          libelle: "Non, car j'ai évalué que ce n'était pas nécessaire.",
          ordre: 2,
        },
        {
          identifiant: "reaction-assurance-cyber-souscrite-oui",
          libelle: "Oui.",
          questions: [
            {
              identifiant:
                "reaction-assurance-cyber-souscrite-oui-tiroir-aspects",
              libelle: 'Si "Oui" : Sur quels aspects ?',
              reponsesPossibles: [
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-financement-remediation",
                  libelle:
                    "Aide financière pour financer les opérations de remédiation en cas de cyberattaque",
                  ordre: 0,
                },
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-financement-pallier-impact-financier",
                  libelle:
                    "Aide financière pour pallier l'impact financier lié à la cyberattaque (ex : pertes d'exploitation)",
                  ordre: 1,
                },
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-accompagnement-gestion-crise",
                  libelle: "Accompagnement dans la gestion de crise",
                  ordre: 2,
                },
              ],
              type: "choixMultiple",
            },
            {
              identifiant:
                "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite",
              libelle:
                'Si "Oui" : Etes-vous bien conforme aux conditions d\'applicabilité ?',
              reponsesPossibles: [
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-na",
                  libelle: "Non Applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-non",
                  libelle: "Non",
                  ordre: 2,
                },
                {
                  identifiant:
                    "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-oui",
                  libelle: "Oui",
                  ordre: 3,
                },
              ],
              type: "choixUnique",
            },
          ],
          ordre: 3,
        },
      ],
      type: "choixUnique",
    },
  ],
};
