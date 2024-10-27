import { Services } from '../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { EntrepotAidant } from '../../src/espace-aidant/Aidant';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { Referentiel } from '../../src/diagnostic/Referentiel';

export const unConstructeurDeServices = (
  entrepotAidant: EntrepotAidant,
  referentiel?: Referentiel
): Services => {
  const adaptateurDeReferentiel = new AdaptateurReferentielDeTest();
  if (referentiel) {
    adaptateurDeReferentiel.ajoute(referentiel);
  }
  return {
    aidant: unServiceAidant(entrepotAidant),
    referentiels: {
      diagnostic: adaptateurDeReferentiel,
      mesures: new AdaptateurMesuresTest(),
    },
  };
};
