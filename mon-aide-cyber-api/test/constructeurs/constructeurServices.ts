import { EntrepotAidant } from '../../src/authentification/Aidant';
import { Services } from '../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { unServiceAidant } from '../../src/authentification/ServiceAidantMAC';

export const unConstructeurDeServices = (
  entrepotAidant: EntrepotAidant
): Services => ({
  aidant: unServiceAidant(entrepotAidant),
  referentiels: {
    diagnostic: new AdaptateurReferentielDeTest(),
    mesures: new AdaptateurMesuresTest(),
  },
});
