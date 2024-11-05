import crypto from 'crypto';
import { BusEvenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { AidantCree } from '../../espace-aidant/CapteurCommandeCreeEspaceAidant';
import { Aidant, EntrepotAidant } from '../../espace-aidant/Aidant';

export type DonneesAidant = {
  identifiantConnexion: string;
  motDePasse: string;
  nomPrenom: string;
};
export const creeAidant = async (
  entrepot: EntrepotAidant,
  busEvenement: BusEvenement,
  donneesAidant: DonneesAidant
): Promise<Aidant | null> => {
  return entrepot
    .rechercheParIdentifiantDeConnexion(donneesAidant.identifiantConnexion)
    .then(() => null)
    .catch(async () => {
      const aidant: Aidant = {
        identifiant: crypto.randomUUID(),
        email: donneesAidant.identifiantConnexion,
        motDePasse: donneesAidant.motDePasse,
        nomPrenom: donneesAidant.nomPrenom,
        preferences: {
          secteursActivite: [],
          departements: [],
          typesEntites: [],
        },
        consentementAnnuaire: false,
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
