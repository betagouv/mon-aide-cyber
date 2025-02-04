import { describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurCommandeCreerAide } from '../../src/aide/CapteurCommandeCreerAide';
import { allier } from '../../src/gestion-demandes/departements';

describe('Capteur de Commande Créer Aidé', () => {
  it('Créer un aidé', async () => {
    const entrepots = new EntrepotsMemoire();
    const capteur = new CapteurCommandeCreerAide(entrepots);

    const aide = await capteur.execute({
      type: 'CommandeCreerAide',
      departement: allier,
      email: 'un email',
    });

    expect(await entrepots.aides().lis(aide.identifiant)).toStrictEqual(aide);
  });
});
