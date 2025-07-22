import { beforeEach, describe, expect, it } from 'vitest';
import { EntrepotAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from '../../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { metAJourLesGendarmesSansEntite } from '../../../../src/administration/gendarmes/rattrapage/metAJourLesGendarmesSansEntite';
import { adaptateurEnvironnement } from '../../../../src/adaptateurs/adaptateurEnvironnement';
import { EntiteAidant } from '../../../../src/espace-aidant/Aidant';

describe('Rattrapage des gendarmes sans entité', () => {
  let entrepotAidant: EntrepotAidantMemoire;

  beforeEach(() => {
    entrepotAidant = new EntrepotAidantMemoire();
    adaptateurEnvironnement.siretsEntreprise().gendarmerie = () =>
      'GENDARMERIE';
  });

  it('Précise l‘entité de la gendarmerie quand le gendarme n‘en a pas', async () => {
    const unGendarmeSansEntite = unAidant()
      .avecUnEmail('aidant1@gendarmerie.interieur.gouv.fr')
      .construis();
    await entrepotAidant.persiste(unGendarmeSansEntite);

    await metAJourLesGendarmesSansEntite(
      [unGendarmeSansEntite],
      entrepotAidant
    );

    const aidants = await entrepotAidant.tous();
    expect(
      aidants.filter(
        (a) => a.email === 'aidant1@gendarmerie.interieur.gouv.fr'
      )[0].entite
    ).toStrictEqual<EntiteAidant>({
      type: 'ServiceEtat',
      nom: 'DIRECTION GENERALE DE LA GENDARMERIE NATIONALE (DGGN)',
      siret: 'GENDARMERIE',
    });
  });
});
