import { AdaptateurTranscripteur } from '../../../adaptateurs/AdaptateurTranscripteur';

import { Transcripteur } from '../../../api/representateurs/types';
import { transcripteurContexte } from './transcripteurContexte';
import { transcripteurGouvernance } from './transcripteurGouvernance';
import { transcripteurSecuriteAcces } from './transcripteurSecuriteAcces';
import { transcripteurSecuritePoste } from './transcripteurSecuritePoste';
import { transcripteurSecuriteInfrastructure } from './transcripteurSecuriteInfrastructure';
import { transcripteurSensibilisation } from './transcripteurSensibilisation';
import { transcripteurReaction } from './transcripteurReaction';
import { ORDRE_THEMATIQUES } from '../../../diagnostic/Diagnostic';
import pug from 'pug';

export const adaptateurTranscripteur = () =>
  new (class implements AdaptateurTranscripteur {
    transcripteur(): Transcripteur {
      return {
        ordreThematiques: ORDRE_THEMATIQUES,
        thematiques: {
          contexte: transcripteurContexte,
          gouvernance: transcripteurGouvernance,
          SecuriteAcces: transcripteurSecuriteAcces,
          securiteposte: transcripteurSecuritePoste,
          securiteinfrastructure: transcripteurSecuriteInfrastructure,
          sensibilisation: transcripteurSensibilisation,
          reaction: transcripteurReaction,
        },
        generateurInfoBulle: (infoBulles) =>
          infoBulles.map((infoBulle) =>
            pug.renderFile(
              `src/infrastructure/adaptateurs/transcripteur/info-bulles/${infoBulle}`
            )
          ),
        conditionsPerimetre: {
          'gouvernance-schema-si-industriel-a-jour': {
            contexte: {
              'contexte-opere-systemes-information-industriels':
                'contexte-opere-systemes-information-industriels-non',
            },
          },
          'acces-si-industriel-teletravail-acces-distants-mesures-particulieres':
            {
              contexte: {
                'contexte-opere-systemes-information-industriels':
                  'contexte-opere-systemes-information-industriels-non',
              },
            },
          'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees':
            {
              contexte: {
                'contexte-opere-systemes-information-industriels':
                  'contexte-opere-systemes-information-industriels-non',
              },
            },
          'securite-poste-si-industriel-antivirus-deploye': {
            contexte: {
              'contexte-opere-systemes-information-industriels':
                'contexte-opere-systemes-information-industriels-non',
            },
          },
          'securite-infrastructure-si-industriel-pare-feu-deploye': {
            contexte: {
              'contexte-opere-systemes-information-industriels':
                'contexte-opere-systemes-information-industriels-non',
            },
          },
        },
      };
    }
  })();
