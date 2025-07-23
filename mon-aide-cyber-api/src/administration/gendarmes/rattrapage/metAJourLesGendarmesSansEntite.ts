import { Aidant, EntrepotAidant } from '../../../espace-aidant/Aidant';
import { adaptateurEnvironnement } from '../../../adaptateurs/adaptateurEnvironnement';

export async function metAJourLesGendarmesSansEntite(
  gendarmesSansEntite: Aidant[],
  entrepotAidants: EntrepotAidant
) {
  return gendarmesSansEntite.map(async (gendarmeSansEntite, index) => {
    return entrepotAidants
      .persiste({
        ...gendarmeSansEntite,
        entite: {
          nom: 'DIRECTION GENERALE DE LA GENDARMERIE NATIONALE (DGGN)',
          siret: adaptateurEnvironnement.siretsEntreprise().gendarmerie()!,
          type: 'ServiceEtat',
        },
      })
      .then(() => {
        console.log(
          `${((index + 1) / gendarmesSansEntite.length) * 100}% (${index + 1} / ${gendarmesSansEntite.length}) des utilisateurs_mac modifiés`
        );
      });
  });
}
