import { Aidant, EntrepotAidant } from '../../../espace-aidant/Aidant';

export async function trouveLesAidantsGendarmes(
  entrepotAidants: EntrepotAidant
): Promise<Aidant[]> {
  const nomDomaineGendarmes = 'gendarmerie.interieur.gouv.fr';
  const aidants = await entrepotAidants.tous();

  return aidants.filter((aidant) => aidant.email.endsWith(nomDomaineGendarmes));
}
