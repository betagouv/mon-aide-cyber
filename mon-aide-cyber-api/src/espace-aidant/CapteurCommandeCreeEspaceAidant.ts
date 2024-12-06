import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { AggregatNonTrouve } from '../domaine/Aggregat';
import { Departement } from '../gestion-demandes/departements';
import { Aidant, ErreurCreationEspaceAidant } from './Aidant';

export type CommandeCreeEspaceAidant = Omit<Commande, 'type'> & {
  type: 'CommandeCreeEspaceAidant';
  dateSignatureCGU: Date;
  identifiant: crypto.UUID;
  email: string;
  motDePasse: string;
  nomPrenom: string;
  departement: Departement;
};

export type EspaceAidantCree = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
};

export type AidantCree = Evenement<{
  identifiant: crypto.UUID;
  departement?: string;
}>;

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
      .rechercheParEmail(commande.email)
      .then(() =>
        Promise.reject(
          new ErreurCreationEspaceAidant(
            'Un compte Aidant avec cette adresse email existe déjà.'
          )
        )
      )
      .catch((erreur) => {
        if (erreur instanceof AggregatNonTrouve) {
          const aidant: Aidant = {
            identifiant: commande.identifiant,
            email: commande.email,
            nomPrenom: commande.nomPrenom,
            preferences: {
              departements: [commande.departement],
              secteursActivite: [],
              typesEntites: [],
            },
            consentementAnnuaire: false,
          };
          return this.entrepots
            .aidants()
            .persiste(aidant)
            .then(() => {
              return this.busEvenement
                .publie<AidantCree>({
                  corps: {
                    identifiant: aidant.identifiant,
                    departement: commande.departement.code,
                  },
                  date: FournisseurHorloge.maintenant(),
                  identifiant: aidant.identifiant,
                  type: 'AIDANT_CREE',
                })
                .then(() => ({
                  identifiant: aidant.identifiant,
                  email: aidant.email,
                  nomPrenom: aidant.nomPrenom,
                }));
            });
        }
        return Promise.reject(erreur);
      });
  }
}
