import { Entrepots } from '../domaine/Entrepots';
import crypto from 'crypto';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ErreurFinalisationCompte } from '../authentification/Aidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

type FinalisationCompte = {
  cguSignees: boolean;
  motDePasse: string;
  identifiant: crypto.UUID;
};

export class ServiceFinalisationCreationCompte {
  constructor(private readonly entrepots: Entrepots) {}

  async finalise(finalisationCompte: FinalisationCompte): Promise<void> {
    const leveErreur = (message: string) => {
      throw ErreurMAC.cree(
        'Finalise la création du compte',
        new ErreurFinalisationCompte(message),
      );
    };
    const verifieLesCGU = (finalisationCompte: FinalisationCompte) => {
      if (!finalisationCompte.cguSignees) {
        leveErreur('Vous devez signer les CGU.');
      }
    };
    const aidant = await this.entrepots
      .aidants()
      .lis(finalisationCompte.identifiant);
    if (aidant.dateSignatureCGU) {
      return;
    }
    verifieLesCGU(finalisationCompte);
    aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
    aidant.motDePasse = finalisationCompte.motDePasse;
    await this.entrepots.aidants().persiste(aidant);
  }
}
