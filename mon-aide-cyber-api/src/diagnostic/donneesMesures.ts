import { Mesures } from './Mesures';
import { mesuresGouvernance } from './mesures/mesuresGouvernance';
import { mesuresSecuriteAcces } from './mesures/mesuresSecuriteAcces';
import { mesuresSecuritePoste } from './mesures/mesuresSecuritePoste';
import { mesuresSensibilisation } from './mesures/mesuresSensibilisation';
import { mesuresReaction } from './mesures/mesuresReaction';
import { mesuresSecuriteInfrastructure } from './mesures/mesuresSecuriteInfrastructure';

export const tableauMesures: Mesures = {
  ...mesuresGouvernance,
  ...mesuresSecuriteAcces,
  ...mesuresSecuritePoste,
  ...mesuresSecuriteInfrastructure,
  ...mesuresSensibilisation,
  ...mesuresReaction,
};
