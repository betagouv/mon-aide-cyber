import { ReferentielDeMesures } from './ReferentielDeMesures';
import { mesuresGouvernance } from './mesures/mesuresGouvernance';
import { mesuresSecuriteAcces } from './mesures/mesuresSecuriteAcces';
import { mesuresSecuritePoste } from './mesures/mesuresSecuritePoste';
import { mesuresSensibilisation } from './mesures/mesuresSensibilisation';
import { mesuresReaction } from './mesures/mesuresReaction';

export const tableauMesures: ReferentielDeMesures = {
  ...mesuresGouvernance,
  ...mesuresSecuriteAcces,
  ...mesuresSecuritePoste,
  ...mesuresSensibilisation,
  ...mesuresReaction,
};
