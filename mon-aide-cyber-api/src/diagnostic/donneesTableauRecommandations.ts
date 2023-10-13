import { TableauDeRecommandations } from './TableauDeRecommandations';
import { recommandationsGouvernance } from './recommandations/recommandationsGouvernance';
import { recommandationsSecuriteAcces } from './recommandations/recommandationsSecuriteAcces';
import { recommandationsSecuritePoste } from './recommandations/recommandationsSecuritePoste';
import { recommandationsSecuriteInfrastructure } from './recommandations/recommandationsSecuriteInfrastructure';
import { recommandationsSensibilisation } from './recommandations/recommandationsSensibilisation';
import { recommandationsReaction } from './recommandations/recommandationsReaction';

const tableauRecommandations: TableauDeRecommandations = {
  ...recommandationsGouvernance,
  ...recommandationsSecuriteAcces,
  ...recommandationsSecuritePoste,
  ...recommandationsSecuriteInfrastructure,
  ...recommandationsSensibilisation,
  ...recommandationsReaction,
};

export { tableauRecommandations };
