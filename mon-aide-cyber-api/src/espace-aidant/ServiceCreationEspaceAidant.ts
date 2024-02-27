import { Entrepots } from '../domaine/Entrepots';
import crypto from 'crypto';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ErreurCreationEspaceAidant } from '../authentification/Aidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

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
        new ErreurCreationEspaceAidant(message),
      );
    };
    const verifieLesCGU = (creationEspaceAidant: CreationEspaceAidant) => {
      if (!creationEspaceAidant.cguSignees) {
        leveErreur('Vous devez signer les CGU.');
      }
    };
    const aidant = await this.entrepots
      .aidants()
      .lis(creationEspaceAidant.identifiant);
    if (aidant.dateSignatureCGU) {
      return;
    }
    verifieLesCGU(creationEspaceAidant);
    aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
    aidant.motDePasse = creationEspaceAidant.motDePasse;
    await this.entrepots.aidants().persiste(aidant);
  }
}
