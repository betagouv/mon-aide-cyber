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
      };
    }
  })();
