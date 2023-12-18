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
              // {
              //   identifiant: "contexte-nature-organisation",
              //   reponses: [
              //     {
              //       identifiant: "nature-organisation-autre",
              //       type: { type: "saisieLibre", format: "texte" },
              //     },
              //   ],
              // },
              {
                identifiant: 'contexte-secteur-activite',
                type: 'liste',
              },
              { identifiant: 'contexte-region-siege-social', type: 'liste' },
              {
                identifiant: 'contexte-departement-tom-siege-social',
                type: 'liste',
              },
              // {
              //   identifiant: "contexte-usage-cloud",
              //   reponses: [
              //     {
              //       identifiant: "usage-cloud-oui",
              //       question: {
              //         identifiant: "contexte-usage-cloud-oui-question-tiroir-usages",
              //         type: "choixMultiple",
              //         reponses: [
              //           {
              //             identifiant:
              //               "contexte-usage-cloud-oui-question-tiroir-usages-autre",
              //             type: { type: "saisieLibre", format: "texte" },
              //           },
              //         ],
              //       },
              //     },
              //   ],
              // },
              // {
              //   identifiant: "contexte-cyber-attaque-subie",
              //   reponses: [
              //     {
              //       identifiant: "contexte-cyber-attaque-subie-oui",
              //       question: {
              //         identifiant: "contexte-cyber-attaque-subie-oui-tiroir-type",
              //         type: "choixMultiple",
              //         reponses: [
              //           {
              //             identifiant:
              //               "contexte-cyber-attaque-subie-oui-tiroir-type-autre",
              //             type: { type: "saisieLibre", format: "texte" },
              //           },
              //         ],
              //       },
              //     },
              //   ],
              // },
            ],
          },
          gouvernance: { libelle: 'Gouvernance',  localisationIllustration:
              '/images/diagnostic/illustration_gouvernance.svg', questions: [] },
          SecuriteAcces: { libelle: 'Sécurité des accès', localisationIllustration:
              '/images/diagnostic/illustration_securite_acces.svg', questions: [] },
          securiteposte: { libelle: 'Sécurité des postes', localisationIllustration:
              '/images/diagnostic/illustration_securite_postes.svg', questions: [] },
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
          reaction: { libelle: 'Réaction à une cyber attaque',  localisationIllustration: '/images/diagnostic/illustration_reaction.svg', questions: [] },
        },
      };
    }
  })();
