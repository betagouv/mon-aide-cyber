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
                questions: [
                  {
                    identifiant:
                      'contexte-activites-recherche-et-developpement',
                  },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'contexte-opere-systemes-information-industriels',
                  },
                ],
              },
              {
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
                questions: [
                  { identifiant: 'gouvernance-infos-et-processus-a-proteger' },
                ],
              },
              {
                questions: [
                  { identifiant: 'gouvernance-schema-si-a-jour' },
                  { identifiant: 'gouvernance-schema-si-industriel-a-jour' },
                ],
              },
              {
                questions: [{ identifiant: 'gouvernance-connaissance-rgpd-1' }],
              },
              {
                questions: [{ identifiant: 'gouvernance-connaissance-rgpd-2' }],
              },
              {
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
                questions: [{ identifiant: 'acces-outil-gestion-des-comptes' }],
              },
              {
                questions: [{ identifiant: 'acces-liste-compte-utilisateurs' }],
              },
              {
                questions: [
                  { identifiant: 'acces-droits-acces-utilisateurs-limites' },
                ],
              },
              {
                questions: [
                  { identifiant: 'acces-utilisateurs-administrateurs-poste' },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'acces-administrateurs-informatiques-suivie-et-limitee',
                  },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'acces-utilisation-comptes-administrateurs-droits-limitee',
                  },
                ],
              },
              {
                questions: [
                  { identifiant: 'acces-mesures-securite-robustesse-mdp' },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
                  },
                ],
              },
              {
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
                questions: [
                  { identifiant: 'securite-poste-antivirus-deploye' },
                  {
                    identifiant:
                      'securite-poste-si-industriel-antivirus-deploye',
                  },
                ],
              },
              {
                questions: [
                  { identifiant: 'securite-poste-pare-feu-local-active' },
                ],
              },
              {
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
                questions: [
                  { identifiant: 'securite-infrastructure-pare-feu-deploye' },
                  {
                    identifiant:
                      'securite-infrastructure-si-industriel-pare-feu-deploye',
                  },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
                  },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
                  },
                ],
              },
              {
                questions: [
                  {
                    identifiant:
                      'securite-infrastructure-outils-securisation-systeme-messagerie',
                  },
                ],
              },
              {
                questions: [
                  {
                    identifiant: 'securite-infrastructure-acces-wifi-securises',
                  },
                ],
              },
              {
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
                questions: [
                  {
                    identifiant:
                      'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
                  },
                ],
              },
              {
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
                questions: [
                  {
                    identifiant:
                      'reaction-surveillance-veille-vulnerabilites-potentielles',
                  },
                ],
              },
              {
                questions: [
                  { identifiant: 'reaction-sauvegardes-donnees-realisees' },
                ],
              },
              {
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
