import {
  desAidants,
  unAidant,
} from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { EntrepotAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { beforeEach, describe, expect, it } from 'vitest';
import { adaptateurEnvironnement } from '../../../../src/adaptateurs/adaptateurEnvironnement';
import { trouveLesAidantsGendarmes } from '../../../../src/administration/gendarmes/rattrapage/trouveLesAidantsGendarmes';

describe('Récupération des Aidants gendarmes', () => {
  let entrepotAidant: EntrepotAidantMemoire;

  beforeEach(() => {
    entrepotAidant = new EntrepotAidantMemoire();
    adaptateurEnvironnement.siretsEntreprise().gendarmerie = () =>
      'GENDARMERIE';
  });

  it("S'assure de ne retrouver que des Aidants avec le bon nom de domaine (gendarmerie.interieur.gouv.fr)", async () => {
    const unGendarmeSansEntite = unAidant()
      .avecUnEmail('aidant1@gendarmerie.interieur.gouv.fr')
      .construis();
    const unSecondGendarmeAvecLeBonSiret = unAidant()
      .avecUnEmail('aidant2@gendarmerie.interieur.gouv.fr')
      .avecUnProfilGendarme()
      .construis();
    const dAutresAidants = desAidants()
      .auNombreDe(3)
      .enGironde()
      .dansLeServicePublic()
      .pourLesSecteursActivite([{ nom: 'Administration' }])
      .construis();
    await entrepotAidant.persiste(unGendarmeSansEntite);
    await entrepotAidant.persiste(unSecondGendarmeAvecLeBonSiret);
    for await (const aidant of dAutresAidants) {
      await entrepotAidant.persiste(aidant);
    }

    const gendarmesTrouves = await trouveLesAidantsGendarmes(entrepotAidant);

    expect(gendarmesTrouves.length).toBe(2);
  });
});
