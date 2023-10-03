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
  ],
};
