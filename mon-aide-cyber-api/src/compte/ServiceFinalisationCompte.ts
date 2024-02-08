import { Entrepots } from '../domaine/Entrepots';
import crypto from 'crypto';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ErreurFinalisationCompte } from '../authentification/Aidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

type FinalisationCompte = {
  cguCochees: boolean;
  charteCochee: boolean;
  identifiant: crypto.UUID;
};

export class ServiceFinalisationCreationCompte {
  constructor(private readonly entrepots: Entrepots) {}

  async finalise(finalisationCompte: FinalisationCompte): Promise<void> {
    this.verifieLesCGUEtLaCharte(finalisationCompte);
    const aidant = await this.entrepots
      .aidants()
      .lis(finalisationCompte.identifiant);
    aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
    aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
    await this.entrepots.aidants().persiste(aidant);
  }

  private verifieLesCGUEtLaCharte(finalisationCompte: FinalisationCompte) {
    const leveErreur = (message: string) => {
      throw ErreurMAC.cree(
        'Finalise la création du compte',
        new ErreurFinalisationCompte(message),
      );
    };
    const cguNonValidees = !finalisationCompte.cguCochees;
    const charteNonSignee = !finalisationCompte.charteCochee;

    if (cguNonValidees && charteNonSignee) {
      leveErreur("Vous devez valider les CGU et signer la charte de l'aidant.");
    }
    if (cguNonValidees) {
      leveErreur('Vous devez valider les CGU.');
    }
    if (charteNonSignee) {
      leveErreur("Vous devez signer la charte de l'aidant.");
    }
  }
}
