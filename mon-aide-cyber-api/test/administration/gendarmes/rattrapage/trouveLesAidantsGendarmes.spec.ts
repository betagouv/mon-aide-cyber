import { unAidant } from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { EntrepotAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { beforeEach, describe, expect, it } from 'vitest';
import { trouveLesAidantsGendarmes } from '../../../../src/administration/gendarmes/rattrapage/trouveLesAidantsGendarmes';

describe('Récupération des Aidants gendarmes', () => {
  let entrepotAidant: EntrepotAidantMemoire;

  beforeEach(() => {
    entrepotAidant = new EntrepotAidantMemoire();
  });

  it("S'assure de ne retrouver que des Aidants avec le bon nom de domaine (gendarmerie.interieur.gouv.fr)", async () => {
    const unGendarmeSansEntite = unAidant()
      .avecUnEmail('aidant1@gendarmerie.interieur.gouv.fr')
      .construis();
    const unSecondGendarmeAvecLeBonSiret = unAidant()
      .avecUnEmail('aidant2@gendarmerie.interieur.gouv.fr')
      .avecUnProfilGendarme()
      .construis();
    await entrepotAidant.persiste(unGendarmeSansEntite);
    await entrepotAidant.persiste(unSecondGendarmeAvecLeBonSiret);

    for (let i = 0; i < 3; i++) {
      const aidantPasGendarme = unAidant()
        .avecUnEmail(`aidant${i}@email.com`)
        .construis();
      await entrepotAidant.persiste(aidantPasGendarme);
    }

    const gendarmesTrouves = await trouveLesAidantsGendarmes(entrepotAidant);

    expect(gendarmesTrouves.length).toBe(2);
  });
});
