import { Aidant, EntrepotAidant } from '../../../espace-aidant/Aidant';
import { adaptateurEnvironnement } from '../../../adaptateurs/adaptateurEnvironnement';

export async function metAJourLesGendarmesSansEntite(
  gendarmesSansEntite: Aidant[],
  entrepotAidants: EntrepotAidant
) {
  for (let index = 0; index < gendarmesSansEntite.length; index++) {
    await entrepotAidants.persiste({
      ...gendarmesSansEntite[index],
      entite: {
        nom: 'DIRECTION GENERALE DE LA GENDARMERIE NATIONALE (DGGN)',
        siret: adaptateurEnvironnement.siretsEntreprise().gendarmerie()!,
        type: 'ServiceEtat',
      },
    });
    console.log(
      `${Math.ceil(((index + 1) / gendarmesSansEntite.length) * 100)}% (${index + 1} / ${gendarmesSansEntite.length}) des utilisateurs_mac modifiés`
    );
  }
}
