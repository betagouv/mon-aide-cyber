import { describe, expect, it } from 'vitest';
import {
  EntrepotAidantMemoire,
  EntrepotAnnuaireAidantsMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { ServiceAnnuaireAidants } from '../../src/annuaire-aidants/ServiceAnnuaireAidants';
import { EntrepotAidant } from '../../src/espace-aidant/Aidant';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { gironde } from '../../src/gestion-demandes/departements';

describe('Service d’annuaire des Aidants', () => {
  it("Ne retourne pas d'Aidants si le département n'est pas fourni", async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepot = new EntrepotAnnuaireAidantsMemoire(entrepotAidant);
    await entrepotAidant.persiste(unAidant().construis());
    await entrepotAidant.persiste(unAidant().construis());

    const aidants = await new ServiceAnnuaireAidants(entrepot).recherche(
      undefined
    );

    expect(aidants).toBeUndefined();
  });

  it("Retourne aléatoirement la liste d'Aidants", async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const entrepot = new EntrepotAnnuaireAidantsMemoire(entrepotAidant);
    await persistePlusieursAidants(entrepotAidant);

    const premiereRecherche = await new ServiceAnnuaireAidants(
      entrepot
    ).recherche({
      departement: 'Gironde',
    });
    const secondeRecherche = await new ServiceAnnuaireAidants(
      entrepot
    ).recherche({
      departement: 'Gironde',
    });

    expect(premiereRecherche).not.toStrictEqual(secondeRecherche);
  });

  const persistePlusieursAidants = async (entrepot: EntrepotAidant) => {
    for (let i = 0; i < 10; i++) {
      await entrepot.persiste(
        unAidant().ayantPourDepartements([gironde]).construis()
      );
    }
  };
});
