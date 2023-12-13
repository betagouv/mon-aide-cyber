import { QuestionsThematique } from '../Referentiel';

export const donneesReaction: QuestionsThematique = {
  questions: [
    {
      identifiant: 'reaction-surveillance-veille-vulnerabilites-potentielles',
      libelle:
        'Une veille des vulnérabilités pouvant vous affecter est-elle réalisée ?',
      poids: 2,
      reponsesPossibles: [
        {
          identifiant:
            'reaction-surveillance-veille-vulnerabilites-potentielles-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'reaction-surveillance-veille-vulnerabilites-potentielles-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            recommandations: [
              {
                identifiant:
                  'reaction-surveillance-veille-vulnerabilites-potentielles',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'reaction-surveillance-veille-vulnerabilites-potentielles-veille-ponctuelle',
          libelle: "Réalisation d'une veille ponctuelle sur Internet.",
          resultat: {
            indice: { valeur: 1.5 },
            recommandations: [
              {
                identifiant:
                  'reaction-surveillance-veille-vulnerabilites-potentielles',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-surveillance-veille-vulnerabilites-potentielles-veille-reguliere',
          libelle: "Réalisation d'une veille régulière et exhaustive.",
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'reaction-sauvegardes-donnees-realisees',
      libelle: 'Des sauvegardes régulières des données sont-elles réalisées ?',
      poids: 3,
      reponsesPossibles: [
        {
          identifiant: 'reaction-sauvegardes-donnees-realisees-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'reaction-sauvegardes-donnees-realisees-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            recommandations: [
              {
                identifiant: 'reaction-sauvegardes-donnees-realisees',
                niveau: 1,
              },
              {
                identifiant:
                  'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole',
                niveau: 1,
              },
              {
                identifiant:
                  'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'reaction-sauvegardes-donnees-realisees-oui-ponctuellement',
          libelle: 'Des sauvegardes des données sont réalisées ponctuellement.',
          questions: [
            {
              identifiant:
                'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole',
              libelle:
                'Si "Oui" : Existe-t-il au moins une sauvegarde des données critiques stockées dans un environnement isolé du réseau bureautique interne et d’Internet ?',
              poids: 3,
              reponsesPossibles: [
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-na',
                  libelle: 'Non applicable',
                  ordre: 0,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 1,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-non',
                  libelle: 'Non',
                  resultat: {
                    indice: { valeur: 0 },
                    recommandations: [
                      {
                        identifiant:
                          'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui',
                  libelle: 'Oui',
                  resultat: {
                    indice: { valeur: 3 },
                    recommandations: [
                      {
                        identifiant:
                          'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 3,
                },
              ],
              type: 'choixUnique',
            },
            {
              identifiant:
                'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement',
              libelle:
                'Si "Oui" : La restauration de toutes les sauvegardes est-elle testée régulièrement ?',
              poids: 3,
              reponsesPossibles: [
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-na',
                  libelle: 'Non applicable',
                  ordre: 0,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 1,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-non',
                  libelle: 'Non',
                  resultat: {
                    indice: { valeur: 0 },
                    recommandations: [
                      {
                        identifiant:
                          'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-oui',
                  libelle: 'Oui',
                  resultat: { indice: { valeur: 3 } },
                  ordre: 3,
                },
              ],
              type: 'choixUnique',
            },
          ],
          resultat: {
            indice: { valeur: 1 },
            recommandations: [
              {
                identifiant: 'reaction-sauvegardes-donnees-realisees',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere',
          libelle:
            'Des sauvegardes des données sont réalisées de manière automatique et régulière',
          questions: [
            {
              identifiant:
                'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole',
              libelle:
                'Si "Oui" : Existe-t-il au moins une sauvegarde des données critiques stockées dans un environnement isolé du réseau bureautique interne et d’Internet ?',
              poids: 3,
              reponsesPossibles: [
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-na',
                  libelle: 'Non applicable',
                  ordre: 0,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 1,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-non',
                  libelle: 'Non',
                  resultat: {
                    indice: { valeur: 0 },
                    recommandations: [
                      {
                        identifiant:
                          'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui',
                  libelle: 'Oui',
                  resultat: {
                    indice: { valeur: 3 },
                    recommandations: [
                      {
                        identifiant:
                          'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 3,
                },
              ],
              type: 'choixUnique',
            },
            {
              identifiant:
                'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement',
              libelle:
                'Si "Oui" : La restauration de toutes les sauvegardes est-elle testée régulièrement ?',
              poids: 3,
              reponsesPossibles: [
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-na',
                  libelle: 'Non applicable',
                  ordre: 0,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 1,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-non',
                  libelle: 'Non',
                  resultat: {
                    indice: { valeur: 0 },
                    recommandations: [
                      {
                        identifiant:
                          'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-oui',
                  libelle: 'Oui',
                  resultat: { indice: { valeur: 3 } },
                  ordre: 3,
                },
              ],
              type: 'choixUnique',
            },
          ],
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'reaction-dispositif-gestion-crise-adapte-defini',
      libelle:
        'Un dispositif de gestion de crise adapté au risque de cyberattaques a-t-il été défini ?',
      poids: 3,
      reponsesPossibles: [
        {
          identifiant: 'reaction-dispositif-gestion-crise-adapte-defini-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'reaction-dispositif-gestion-crise-adapte-defini-non',
          libelle: 'Non',
          ordre: 1,
          resultat: {
            recommandations: [
              {
                identifiant: 'reaction-dispositif-gestion-crise-adapte-defini',
                niveau: 1,
              },
            ],
            indice: { valeur: 0 },
          },
        },
        {
          identifiant:
            'reaction-dispositif-gestion-crise-adapte-defini-oui-fiche-reflexe',
          libelle: 'Nous avons défini une fiche réflexe dédiée.',
          resultat: {
            recommandations: [
              {
                identifiant: 'reaction-dispositif-gestion-crise-adapte-defini',
                niveau: 2,
              },
            ],
            indice: { valeur: 1.5 },
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-dispositif-gestion-crise-adapte-defini-oui-organisation-gestion-crise-definie',
          libelle:
            "Oui, une organisation de gestion de crise d'origine cyber a été définie",
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
