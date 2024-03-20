import { Aidant, EntrepotAidant } from '../../authentification/Aidant';
import crypto from 'crypto';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

export type DonneesAidant = {
  identifiantConnexion: string;
  motDePasse: string;
  nomPrenom: string;
};
export const creeAidant = async (
  entrepot: EntrepotAidant,
  busEvenement: BusEvenement,
  donneesAidant: DonneesAidant,
): Promise<Aidant | null> => {
  return entrepot
    .rechercheParIdentifiantConnexionEtMotDePasse(donneesAidant.identifiantConnexion, donneesAidant.motDePasse)
    .then(() => null)
    .catch(async () => {
      const aidant: Aidant = {
        identifiant: crypto.randomUUID(),
        identifiantConnexion: donneesAidant.identifiantConnexion,
        motDePasse: donneesAidant.motDePasse,
        nomPrenom: donneesAidant.nomPrenom,
      };
      await entrepot.persiste(aidant);
      await busEvenement.publie<AidantCree>({
        date: FournisseurHorloge.maintenant(),
        identifiant: aidant.identifiant,
        type: 'AIDANT_CREE',
        corps: { identifiant: aidant.identifiant },
      });
      return aidant;
    });
};

export type AidantCree = Evenement;
