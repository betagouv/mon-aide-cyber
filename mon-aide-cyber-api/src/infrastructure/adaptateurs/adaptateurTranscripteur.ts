import { AdaptateurTranscripteur } from '../../adaptateurs/AdaptateurTranscripteur';

import { Transcripteur } from '../../api/representateurs/types';

export const adaptateurTranscripteur = () =>
  new (class implements AdaptateurTranscripteur {
    transcripteur(): Transcripteur {
      return {
        ordreThematiques: [
          'contexte',
          'gouvernance',
          'SecuriteAcces',
          'securiteposte',
          'securiteinfrastructure',
          'sensibilisation',
          'reaction',
        ],
        thematiques: {
          contexte: {
            description:
              "Les informations contextuelles d'une entreprise aident à situer sa position par rapport à d'autres dans le même secteur, à cerner les défis cyber propres à son domaine d'activité et en fonction du nombre d'employés.",
            libelle: 'Contexte',
            localisationIconeNavigation:
              '/images/diagnostic/contexte/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/contexte/illustration.svg',
            questions: [
              {
                identifiant: 'contexte-secteur-activite',
                type: 'liste',
              },
              { identifiant: 'contexte-region-siege-social', type: 'liste' },
              {
                identifiant: 'contexte-departement-tom-siege-social',
                type: 'liste',
              },
            ],
            groupes: [
              {
                numero: 1,
                questions: [
                  { identifiant: 'contexte-nature-organisation' },
                  {
                    identifiant: 'contexte-secteur-activite',
                    type: 'liste',
                  },
                  {
                    identifiant: 'contexte-region-siege-social',
                    type: 'liste',
                  },
                  {
                    identifiant: 'contexte-departement-tom-siege-social',
                    type: 'liste',
                  },
                ],
              },
              {
                numero: 2,
                questions: [
                  {
                    identifiant: 'contexte-nombre-personnes-dans-organisation',
                  },
                  {
                    identifiant:
                      'contexte-nombre-postes-travail-dans-organisation',
                  },
                ],
              },
              {
                numero: 3,
                questions: [
                  {
                    identifiant:
                      'contexte-activites-recherche-et-developpement',
                  },
                ],
              },
              {
                numero: 4,
                questions: [
                  {
                    identifiant:
                      'contexte-opere-systemes-information-industriels',
                  },
                ],
              },
              {
                numero: 5,
                questions: [{ identifiant: 'contexte-cyber-attaque-subie' }],
              },
            ],
          },
          gouvernance: {
            description:
              "La gouvernance des systèmes d’information implique initialement l'établissement d'objectifs pour ces systèmes, alignés sur la stratégie de l'entreprise. Cette approche vise à déterminer comment le système d'information participe à la création de valeur pour l'entreprise et précise le rôle des différents acteurs.",
            libelle: 'Gouvernance',
            localisationIconeNavigation:
              '/images/diagnostic/gouvernance/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/gouvernance/illustration.svg',
            questions: [],
            groupes: [
              {
                numero: 6,
                questions: [
                  { identifiant: 'gouvernance-infos-et-processus-a-proteger' },
                ],
              },
              {
                numero: 7,
                questions: [
                  { identifiant: 'gouvernance-schema-si-a-jour' },
                  { identifiant: 'gouvernance-schema-si-industriel-a-jour' },
                ],
              },
              {
                numero: 8,
                questions: [{ identifiant: 'gouvernance-connaissance-rgpd-1' }],
              },
              {
                numero: 9,
                questions: [{ identifiant: 'gouvernance-connaissance-rgpd-2' }],
              },
              {
                numero: 10,
                questions: [
                  { identifiant: 'gouvernance-exigence-cyber-securite-presta' },
                  {
                    identifiant:
                      'gouvernance-exigence-cyber-securite-presta-si-industriel',
                  },
                ],
              },
            ],
          },
          SecuriteAcces: {
            description:
              "La sécurité de l'information englobe la protection des données et des renseignements contre tout accès, usage, divulgation, altération, perturbation ou destruction non autorisés. Elle représente une préoccupation essentielle tant pour les individus que pour les organisations.",
            libelle: "Sécurité des accès au système d'information",
            localisationIconeNavigation:
              '/images/diagnostic/securite-acces/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/securite-acces/illustration.svg',
            questions: [],
            groupes: [
              {
                numero: 11,
                questions: [{ identifiant: 'acces-outil-gestion-des-comptes' }],
              },
              {
                numero: 12,
                questions: [{ identifiant: 'acces-liste-compte-utilisateurs' }],
              },
              {
                numero: 13,
                questions: [
                  { identifiant: 'acces-droits-acces-utilisateurs-limites' },
                ],
              },
              {
                numero: 14,
                questions: [
                  { identifiant: 'acces-utilisateurs-administrateurs-poste' },
                ],
              },
              {
                numero: 15,
                questions: [
                  {
                    identifiant:
                      'acces-administrateurs-informatiques-suivie-et-limitee',
                  },
                ],
              },
              {
                numero: 16,
                questions: [
                  {
                    identifiant:
                      'acces-utilisation-comptes-administrateurs-droits-limitee',
                  },
                ],
              },
              {
                numero: 17,
                questions: [
                  { identifiant: 'acces-mesures-securite-robustesse-mdp' },
                ],
              },
              {
                numero: 18,
                questions: [
                  {
                    identifiant:
                      'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
                  },
                ],
              },
              {
                numero: 19,
                questions: [
                  {
                    identifiant:
                      'acces-teletravail-acces-distants-mesures-particulieres',
                  },
                  {
                    identifiant:
                      'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
                  },
                ],
              },
              {
                numero: 20,
                questions: [
                  {
                    identifiant: 'acces-administrateurs-si-mesures-specifiques',
                  },
                ],
              },
            ],
          },
          securiteposte: {
            description:
              "Prévenir les accès non autorisés, l'exécution de virus par des logiciels malveillants ou le contrôle à distance, particulièrement via Internet, est crucial. Les risques d'intrusion dans les systèmes informatiques sont significatifs, et les postes de travail représentent l'un des principaux vecteurs d'attaque potentiels.",
            libelle: 'Sécurité des postes',
            localisationIconeNavigation:
              '/images/diagnostic/securite-postes/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/securite-postes/illustration.svg',
            questions: [],
            groupes: [
              {
                numero: 21,
                questions: [
                  {
                    identifiant:
                      'securite-poste-maj-fonctionnelles-et-securite-deployees',
                  },
                  {
                    identifiant:
                      'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
                  },
                ],
              },
              {
                numero: 22,
                questions: [
                  { identifiant: 'securite-poste-antivirus-deploye' },
                  {
                    identifiant:
                      'securite-poste-si-industriel-antivirus-deploye',
                  },
                ],
              },
              {
                numero: 23,
                questions: [
                  { identifiant: 'securite-poste-pare-feu-local-active' },
                ],
              },
              {
                numero: 24,
                questions: [
                  {
                    identifiant:
                      'securite-poste-outils-complementaires-securisation',
                  },
                  { identifiant: 'securite-poste-r-et-d-disques-chiffres' },
                ],
              },
            ],
          },
          securiteinfrastructure: {
            description:
              "La sécurité des infrastructures et des données est vitale pour protéger systèmes, réseaux et informations contre les menaces numériques. Le pare-feu, le cryptage et la détection d'intrusions pour prévenir, détecter et limiter les attaques sont entre autres utilisés.",
            libelle: 'Sécurité des infrastructures',
            localisationIconeNavigation:
              '/images/diagnostic/securite-infrastructures/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/securite-infrastructures/illustration.svg',
            questions: [],
            groupes: [
              {
                numero: 25,
                questions: [
                  { identifiant: 'securite-infrastructure-pare-feu-deploye' },
                  {
                    identifiant:
                      'securite-infrastructure-si-industriel-pare-feu-deploye',
                  },
                ],
              },
              {
                numero: 26,
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
                  },
                ],
              },
              {
                numero: 27,
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
                  },
                ],
              },
              {
                numero: 28,
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-outils-securisation-systeme-messagerie',
                  },
                ],
              },
              {
                numero: 29,
                questions: [
                  {
                    identifiant: 'securite-infrastructure-acces-wifi-securises',
                  },
                ],
              },
              {
                numero: 30,
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-espace-stockage-serveurs',
                  },
                ],
              },
            ],
          },
          sensibilisation: {
            description:
              "Il est important d’éduquer tous les utilisateurs, qu'ils fassent partie de l'organisation ou non, qui manipulent des données personnelles, aux risques liés aux libertés et à la vie privée des individus. Il faut fournir des informations sur les actions entreprises pour gérer ces risques, ainsi que sur les conséquences possibles en cas de non-respect des directives.",
            libelle: 'Sensibilisation des utilisateurs',
            localisationIconeNavigation:
              '/images/diagnostic/sensibilisation/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/sensibilisation/illustration.svg',
            questions: [],
            groupes: [
              {
                numero: 31,
                questions: [
                  {
                    identifiant:
                      'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
                  },
                  {
                    identifiant:
                      'sensibilisation-risque-espionnage-industriel-r-et-d',
                  },
                ],
              },
              {
                numero: 32,
                questions: [
                  {
                    identifiant:
                      'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
                  },
                ],
              },
              {
                numero: 33,
                questions: [
                  {
                    identifiant:
                      'sensibilisation-declaration-incidents-encouragee',
                  },
                ],
              },
            ],
          },
          reaction: {
            description:
              "La première phase du traitement d'un incident consiste à le qualifier. Cela implique d'identifier les sources d'informations et les éventuelles anomalies qui sont associées. L'objectif principal est d'établir une vision aussi précise que possible de la situation en cours.",
            libelle: 'Réaction à une cyber attaque',
            localisationIconeNavigation:
              '/images/diagnostic/reaction/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/reaction/illustration.svg',
            questions: [],
            groupes: [
              {
                numero: 34,
                questions: [
                  {
                    identifiant:
                      'reaction-surveillance-veille-vulnerabilites-potentielles',
                  },
                ],
              },
              {
                numero: 35,
                questions: [
                  { identifiant: 'reaction-sauvegardes-donnees-realisees' },
                ],
              },
              {
                numero: 36,
                questions: [
                  {
                    identifiant:
                      'reaction-dispositif-gestion-crise-adapte-defini',
                  },
                ],
              },
            ],
          },
        },
      };
    }
  })();
