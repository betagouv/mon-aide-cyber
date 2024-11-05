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
import {
  CommandeCreeUtilisateur,
  UtilisateurCree,
} from '../../authentification/CapteurCommandeCreeUtilisateur';

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
          .publie<CommandeCreeUtilisateur, UtilisateurCree>({
            type: 'CommandeCreeUtilisateur',
            dateSignatureCGU: FournisseurHorloge.maintenant(),
            identifiantConnexion: demande.mail,
            motDePasse: saga.motDePasse,
            nomPrenom: `${demande.prenom} ${demande.nom}`,
          })
          .then((utilisateur) => {
            return this.busCommande
              .publie<CommandeCreeEspaceAidant, EspaceAidantCree>({
                identifiant: utilisateur.identifiant,
                dateSignatureCGU: FournisseurHorloge.maintenant(),
                email: utilisateur.email,
                nomPrenom: utilisateur.nomPrenom,
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
      });
  }
}

export type DemandeDevenirAidantEspaceAidantCree = Evenement<{
  idDemande: crypto.UUID;
  idAidant: crypto.UUID;
}>;
