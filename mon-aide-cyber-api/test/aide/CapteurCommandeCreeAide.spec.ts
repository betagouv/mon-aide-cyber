import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurCommandeCreerAide } from '../../src/aide/CapteurCommandeCreerAide';

describe('Capteur de Commande Créer Aidé', () => {
  it('Créer un aidé', async () => {
    const entrepots = new EntrepotsMemoire();
    const capteur = new CapteurCommandeCreerAide(entrepots);

    const aide = await capteur.execute({
      type: 'CommandeCreerAide',
      departement: 'un département',
      email: 'un email',
    });

    expect(await entrepots.aides().lis(aide.identifiant)).toStrictEqual(aide);
  });
});
