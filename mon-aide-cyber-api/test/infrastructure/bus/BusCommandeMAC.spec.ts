import { describe, expect } from 'vitest';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from './BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unServiceAidant } from '../../../src/espace-aidant/ServiceAidantMAC';

describe('Bus de commande MAC', () => {
  it("Retourne une erreur si le capteur n'est pas trouvé", async () => {
    const entrepots = new EntrepotsMemoire();
    await expect(() =>
      new BusCommandeMAC(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
        { aidant: unServiceAidant(entrepots.aidants()) }
      ).publie({ type: 'CommandeInexistante' })
    ).toThrowError("Impossible d'exécuter la demande 'CommandeInexistante'");
  });
});
