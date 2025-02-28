import { describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurCommandeCreerDemandeAide } from '../../../src/gestion-demandes/aide/CapteurCommandeCreerDemandeAide';
import { allier } from '../../../src/gestion-demandes/departements';
import { EntrepotAideMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

describe('Capteur de Commande Créer une demande d’Aide', () => {
  it('Crée une demande d’aide', async () => {
    const entrepots = new EntrepotsMemoire();
    const capteur = new CapteurCommandeCreerDemandeAide(entrepots);

    const aide = await capteur.execute({
      type: 'CommandeCreerDemandeAide',
      departement: allier,
      email: 'un email',
    });

    expect(
      await (entrepots.demandesAides() as EntrepotAideMemoire).lis(
        aide.identifiant
      )
    ).toStrictEqual(aide);
  });
});
