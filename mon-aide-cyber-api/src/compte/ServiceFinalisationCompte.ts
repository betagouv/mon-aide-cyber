import { Entrepots } from '../domaine/Entrepots';
import crypto from 'crypto';
import { ErreurMAC } from '../domaine/erreurMAC';
import { Aidant, ErreurFinalisationCompte } from '../authentification/Aidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

type FinalisationCompte = {
  cguCochees: boolean;
  charteCochee: boolean;
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
    const verifieLesCGUEtLaCharte = (
      finalisationCompte: FinalisationCompte,
    ) => {
      const cguNonValidees = !finalisationCompte.cguCochees;
      const charteNonSignee = !finalisationCompte.charteCochee;

      if (cguNonValidees && charteNonSignee) {
        leveErreur(
          "Vous devez valider les CGU et signer la charte de l'aidant.",
        );
      }
      if (cguNonValidees) {
        leveErreur('Vous devez valider les CGU.');
      }
      if (charteNonSignee) {
        leveErreur("Vous devez signer la charte de l'aidant.");
      }
    };
    const verifieCGUEtCharteDejaSignee = (aidant: Aidant) => {
      aidant.dateSignatureCGU &&
        aidant.dateSignatureCharte &&
        leveErreur('Vous avez déjà finaliser la création de votre compte.');
    };

    const aidant = await this.entrepots
      .aidants()
      .lis(finalisationCompte.identifiant);
    verifieCGUEtCharteDejaSignee(aidant);
    verifieLesCGUEtLaCharte(finalisationCompte);
    aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
    aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
    await this.entrepots.aidants().persiste(aidant);
  }
}
