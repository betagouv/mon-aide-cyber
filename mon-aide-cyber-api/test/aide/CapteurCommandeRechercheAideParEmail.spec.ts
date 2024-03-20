import { CapteurCommandeRechercheAideParEmail } from '../../src/aide/CapteurCommandeRechercheAideParEmail';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAide } from './ConstructeurAide';

describe('Capteur de Commande Recherche Aide Par Email', () => {
  it("retourne l'aide s'il est trouvé", async () => {
    const aide = unAide().construis();
    const entrepots = new EntrepotsMemoire();
    const capteurCommande = new CapteurCommandeRechercheAideParEmail(entrepots);

    await entrepots.aides().persiste(aide);
    const aideRecherche = await capteurCommande.execute({
      type: 'CommandeRechercheAideParEmail',
      email: aide.email,
    });

    expect(aideRecherche).toStrictEqual(aide);
  });
});
