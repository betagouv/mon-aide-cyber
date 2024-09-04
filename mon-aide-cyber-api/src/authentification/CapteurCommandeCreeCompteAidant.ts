import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { AidantCree } from '../administration/aidant/creeAidant';
import crypto from 'crypto';

export type CommandeCreeCompteAidant = Omit<Commande, 'type'> & {
  type: 'CommandeCreeCompteAidant';
  dateSignatureCGU: Date;
  identifiantConnexion: string;
  nomPrenom: string;
};

export type CompteAidantCree = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
};

export class CapteurCommandeCreeCompteAidant
  implements CapteurCommande<CommandeCreeCompteAidant, CompteAidantCree>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly generateurMotDePasse: () => string = genereMotDePasse
  ) {}

  async execute(commande: CommandeCreeCompteAidant): Promise<CompteAidantCree> {
    const aidant = {
      dateSignatureCGU: commande.dateSignatureCGU,
      identifiant: crypto.randomUUID(),
      identifiantConnexion: commande.identifiantConnexion,
      motDePasse: this.generateurMotDePasse(),
      nomPrenom: commande.nomPrenom,
    };
    return this.entrepots
      .aidants()
      .persiste(aidant)
      .then(() => {
        return this.busEvenement
          .publie<AidantCree>({
            corps: { identifiant: aidant.identifiant },
            date: FournisseurHorloge.maintenant(),
            identifiant: aidant.identifiant,
            type: 'AIDANT_CREE',
          })
          .then(() => ({
            identifiant: aidant.identifiant,
            email: aidant.identifiantConnexion,
            nomPrenom: aidant.nomPrenom,
          }));
      });
  }
}
export const genereMotDePasse = () => {
  const expressionReguliere = /^[a-hj-km-np-zA-HJ-KM-NP-Z1-9/]*$/;

  const chaineAleatoire = () => {
    const valeurAleatoire = String.fromCharCode(
      crypto.webcrypto.getRandomValues(new Uint8Array(1))[0]
    );
    if (expressionReguliere.test(valeurAleatoire)) {
      return valeurAleatoire;
    }
    return undefined;
  };

  return new Array(21)
    .fill('')
    .map(() => {
      let caractereAleatoire = undefined;
      while (caractereAleatoire === undefined) {
        caractereAleatoire = chaineAleatoire();
      }
      return caractereAleatoire;
    })
    .join('');
};
