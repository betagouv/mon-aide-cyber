import { Services } from '../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { EntrepotAidant } from '../../src/espace-aidant/Aidant';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';

export const unConstructeurDeServices = (
  entrepotAidant: EntrepotAidant
): Services => ({
  aidant: unServiceAidant(entrepotAidant),
  referentiels: {
    diagnostic: new AdaptateurReferentielDeTest(),
    mesures: new AdaptateurMesuresTest(),
  },
});
