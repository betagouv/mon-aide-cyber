import { describe, expect } from 'vitest';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from './BusEvenementDeTest';

describe('Bus de commande MAC', () => {
  it("Retourne une erreur si le capteur n'est pas trouvé", async () => {
    await expect(() =>
      new BusCommandeMAC(
        new EntrepotsMemoire(),
        new BusEvenementDeTest(),
      ).publie({ type: 'CommandeInexistante' }),
    ).toThrowError("Impossible d'exécuter la demande 'CommandeInexistante'");
  });
});
