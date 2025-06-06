import { describe, expect, it } from 'vitest';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from './BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { unAdaptateurRechercheEntreprise } from '../../constructeurs/constructeurAdaptateurRechercheEntrepriseEnDur';

describe('Bus de commande MAC', () => {
  it("Retourne une erreur si le capteur n'est pas trouvé", async () => {
    const entrepots = new EntrepotsMemoire();
    await expect(() =>
      new BusCommandeMAC(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
        unConstructeurDeServices(entrepots.aidants()),
        unAdaptateurRechercheEntreprise().construis()
      ).publie({ type: 'CommandeInexistante' })
    ).toThrowError("Impossible d'exécuter la demande 'CommandeInexistante'");
  });
});
