import { AdaptateurTranscripteur } from '../../../adaptateurs/AdaptateurTranscripteur';

import { Transcripteur } from '../../../api/representateurs/types';
import { transcripteurContexte } from './transcripteurContexte';
import { transcripteurGouvernance } from './transcripteurGouvernance';
import { transcripteurSecuriteAcces } from './transcripteurSecuriteAcces';
import { transcripteurSecuritePoste } from './transcripteurSecuritePoste';
import { transcripteurSecuriteInfrastructure } from './transcripteurSecuriteInfrastructure';
import { transcripteurSensibilisation } from './transcripteurSensibilisation';
import { transcripteurReaction } from './transcripteurReaction';

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
          contexte: transcripteurContexte,
          gouvernance: transcripteurGouvernance,
          SecuriteAcces: transcripteurSecuriteAcces,
          securiteposte: transcripteurSecuritePoste,
          securiteinfrastructure: transcripteurSecuriteInfrastructure,
          sensibilisation: transcripteurSensibilisation,
          reaction: transcripteurReaction,
        },
      };
    }
  })();
