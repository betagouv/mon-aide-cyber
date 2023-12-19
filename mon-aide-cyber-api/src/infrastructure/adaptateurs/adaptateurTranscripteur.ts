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
            libelle: 'Gouvernance',
            localisationIconeNavigation:
              '/images/diagnostic/gouvernance/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/gouvernance/illustration.svg',
            questions: [],
          },
          SecuriteAcces: {
            libelle: "Sécurité des accès au système d'information",
            localisationIconeNavigation:
              '/images/diagnostic/securite-acces/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/securite-acces/illustration.svg',
            questions: [],
          },
          securiteposte: {
            libelle: 'Sécurité des postes',
            localisationIconeNavigation:
              '/images/diagnostic/securite-postes/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/securite-postes/illustration.svg',
            questions: [],
          },
          securiteinfrastructure: {
            libelle: 'Sécurité des infrastructures',
            localisationIconeNavigation:
              '/images/diagnostic/securite-infrastructures/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/securite-infrastructures/illustration.svg',
            questions: [],
          },
          sensibilisation: {
            libelle: 'Sensibilisation des utilisateurs',
            localisationIconeNavigation:
              '/images/diagnostic/sensibilisation/icone-navigation.svg',
            localisationIllustration:
              '/images/diagnostic/sensibilisation/illustration.svg',
            questions: [],
          },
          reaction: {
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
