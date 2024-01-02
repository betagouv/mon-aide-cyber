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
          },
        },
      };
    }
  })();
