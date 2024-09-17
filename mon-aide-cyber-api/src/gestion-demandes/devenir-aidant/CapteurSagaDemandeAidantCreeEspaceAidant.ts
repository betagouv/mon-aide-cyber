import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import crypto from 'crypto';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';
import { StatutDemande } from './DemandeDevenirAidant';
import {
  CommandeCreeEspaceAidant,
  EspaceAidantCree,
} from '../../espace-aidant/CapteurCommandeCreeEspaceAidant';

export type SagaDemandeAidantCreeEspaceAidant = Omit<Saga, 'type'> & {
  type: 'SagaDemandeAidantEspaceAidant';
  idDemande: crypto.UUID;
  motDePasse: string;
};

export class CapteurSagaDemandeAidantCreeEspaceAidant
  implements CapteurSaga<SagaDemandeAidantCreeEspaceAidant, void>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement
  ) {}

  execute(saga: SagaDemandeAidantCreeEspaceAidant): Promise<void> {
    return this.entrepots
      .demandesDevenirAidant()
      .lis(saga.idDemande)
      .then((demande) => {
        return this.busCommande
          .publie<CommandeCreeEspaceAidant, EspaceAidantCree>({
            dateSignatureCGU: FournisseurHorloge.maintenant(),
            identifiantConnexion: demande.mail,
            nomPrenom: `${demande.prenom} ${demande.nom}`,
            motDePasse: saga.motDePasse,
            type: 'CommandeCreeEspaceAidant',
            departement: demande.departement,
          })
          .then((compte) => {
            return this.entrepots
              .demandesDevenirAidant()
              .persiste({ ...demande, statut: StatutDemande.TRAITEE })
              .then(() =>
                this.busEvenement
                  .publie<DemandeDevenirAidantEspaceAidantCree>({
                    type: 'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE',
                    date: FournisseurHorloge.maintenant(),
                    identifiant: adaptateurUUID.genereUUID(),
                    corps: {
                      idAidant: compte.identifiant,
                      idDemande: demande.identifiant,
                    },
                  })
                  .then(() => Promise.resolve())
              );
          });
      });
  }
}

export type DemandeDevenirAidantEspaceAidantCree = Evenement<{
  idDemande: crypto.UUID;
  idAidant: crypto.UUID;
}>;
