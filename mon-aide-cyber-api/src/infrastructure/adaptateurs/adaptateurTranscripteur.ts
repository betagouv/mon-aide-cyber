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
              '/images/diagnostic/illustration_contexte.svg',
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
              '/images/diagnostic/illustration_gouvernance.svg',
            questions: [],
          },
          SecuriteAcces: {
            libelle: "Sécurité des accès au système d'information",
            localisationIllustration:
              '/images/diagnostic/illustration_securite_acces.svg',
            questions: [],
          },
          securiteposte: {
            libelle: 'Sécurité des postes',
            localisationIllustration:
              '/images/diagnostic/illustration_securite_postes.svg',
            questions: [],
          },
          securiteinfrastructure: {
            libelle: 'Sécurité des infrastructures',
            localisationIllustration:
              '/images/diagnostic/illustration_securite_infrastructures.svg',
            questions: [],
          },
          sensibilisation: {
            libelle: 'Sensibilisation des utilisateurs',
            localisationIllustration:
              '/images/diagnostic/illustration_sensibilisation.svg',
            questions: [],
          },
          reaction: {
            libelle: 'Réaction à une cyber attaque',
            localisationIllustration:
              '/images/diagnostic/illustration_reaction.svg',
            questions: [],
          },
        },
      };
    }
  })();
