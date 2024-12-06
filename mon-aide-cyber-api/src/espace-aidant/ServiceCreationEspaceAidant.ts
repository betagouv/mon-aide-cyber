import { Entrepots } from '../domaine/Entrepots';
import crypto from 'crypto';
import { ErreurMAC } from '../domaine/erreurMAC';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ErreurCreationEspaceAidant } from './Aidant';

type CreationEspaceAidant = {
  cguSignees: boolean;
  motDePasse: string;
  identifiant: crypto.UUID;
};

export class ServiceCreationEspaceAidant {
  constructor(private readonly entrepots: Entrepots) {}

  async cree(creationEspaceAidant: CreationEspaceAidant): Promise<void> {
    const leveErreur = (message: string) => {
      throw ErreurMAC.cree(
        "Crée l'espace Aidant",
        new ErreurCreationEspaceAidant(message)
      );
    };
    const verifieLesCGU = (creationEspaceAidant: CreationEspaceAidant) => {
      if (!creationEspaceAidant.cguSignees) {
        leveErreur('Vous devez signer les CGU.');
      }
    };
    const utilisateur = await this.entrepots
      .utilisateurs()
      .lis(creationEspaceAidant.identifiant);
    if (utilisateur.dateSignatureCGU) {
      return;
    }
    verifieLesCGU(creationEspaceAidant);
    utilisateur.dateSignatureCGU = FournisseurHorloge.maintenant();
    utilisateur.motDePasse = creationEspaceAidant.motDePasse;
    await this.entrepots.utilisateurs().persiste(utilisateur);
  }
}
