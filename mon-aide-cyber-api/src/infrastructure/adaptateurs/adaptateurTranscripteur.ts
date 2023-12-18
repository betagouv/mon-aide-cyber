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
            localisationIllustration:
              '/images/diagnostic/contexte/illustration.svg',
            libelle: 'Contexte',
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
            localisationIllustration:
              '/images/diagnostic/gouvernance/illustration.svg',
            questions: [],
          },
          SecuriteAcces: {
            libelle: "Sécurité des accès au système d'information",
            localisationIllustration:
              '/images/diagnostic/securite-acces/illustration.svg',
            questions: [],
          },
          securiteposte: {
            libelle: 'Sécurité des postes',
            localisationIllustration:
              '/images/diagnostic/securite-postes/illustration.svg',
            questions: [],
          },
          securiteinfrastructure: {
            libelle: 'Sécurité des infrastructures',
            localisationIllustration:
              '/images/diagnostic/securite-infrastructures/illustration.svg',
            questions: [],
          },
          sensibilisation: {
            libelle: 'Sensibilisation des utilisateurs',
            localisationIllustration:
              '/images/diagnostic/sensibilisation/illustration.svg',
            questions: [],
          },
          reaction: {
            libelle: 'Réaction à une cyber attaque',
            localisationIllustration:
              '/images/diagnostic/reaction/illustration.svg',
            questions: [],
          },
        },
      };
    }
  })();
