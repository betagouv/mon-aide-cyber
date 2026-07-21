import { Services } from '../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { EntrepotAidant } from '../../src/espace-aidant/Aidant';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import {
  AdaptateurRepertoireDeContactsMemoire
} from '../../src/infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';

export const unConstructeurDeServices = (
  entrepotAidant: EntrepotAidant
): Services => ({
  aidant: unServiceAidant(
    entrepotAidant,
    new AdaptateurRepertoireDeContactsMemoire()
  ),
  referentiels: {
    diagnostic: new AdaptateurReferentielDeTest(),
    mesures: new AdaptateurMesuresTest(),
  },
});
