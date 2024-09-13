import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { AidantCree } from '../administration/aidant/creeAidant';
import crypto from 'crypto';
import { adaptateurUUID } from '../infrastructure/adaptateurs/adaptateurUUID';
import { AggregatNonTrouve } from '../domaine/Aggregat';
import { ErreurCreationEspaceAidant } from '../authentification/Aidant';

export type CommandeCreeEspaceAidant = Omit<Commande, 'type'> & {
  type: 'CommandeCreeEspaceAidant';
  dateSignatureCGU: Date;
  identifiantConnexion: string;
  motDePasse: string;
  nomPrenom: string;
};

export type EspaceAidantCree = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
};

export class CapteurCommandeCreeEspaceAidant
  implements CapteurCommande<CommandeCreeEspaceAidant, EspaceAidantCree>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement
  ) {}

  async execute(commande: CommandeCreeEspaceAidant): Promise<EspaceAidantCree> {
    return this.entrepots
      .aidants()
      .rechercheParIdentifiantDeConnexion(commande.identifiantConnexion)
      .then(() =>
        Promise.reject(
          new ErreurCreationEspaceAidant(
            'Un compte Aidant avec cette adresse email existe déjà.'
          )
        )
      )
      .catch((erreur) => {
        if (erreur instanceof AggregatNonTrouve) {
          const aidant = {
            dateSignatureCGU: commande.dateSignatureCGU,
            identifiant: adaptateurUUID.genereUUID(),
            identifiantConnexion: commande.identifiantConnexion,
            motDePasse: commande.motDePasse,
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
        return Promise.reject(erreur);
      });
  }
}