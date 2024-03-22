import { describe, expect } from 'vitest';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from './BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';

describe('Bus de commande MAC', () => {
  it("Retourne une erreur si le capteur n'est pas trouvé", async () => {
    await expect(() =>
      new BusCommandeMAC(
        new EntrepotsMemoire(),
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
      ).publie({ type: 'CommandeInexistante' }),
    ).toThrowError("Impossible d'exécuter la demande 'CommandeInexistante'");
  });
});
