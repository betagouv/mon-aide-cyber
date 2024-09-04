import { UUID } from 'crypto';
import { BusCommande, CapteurSaga, Commande } from '../../domaine/commande';
import { ServiceDevenirAidant } from './ServiceDevenirAidant';
import {
  CommandeCreeCompteAidant,
  CompteAidantCree,
} from '../../authentification/CapteurCommandeCreeCompteAidant';

type CommandeFinaliseDemandeDevenirAidant = Omit<Commande, 'type'> & {
  type: 'CommandeFinaliseDemandeDevenirAidant';
  mail: string;
};
export type DemandeDevenirAidantFinalisee = {
  identifiantAidant: UUID;
};

export class CapteurSagaFinaliseDemandeDevenirAidant
  implements
    CapteurSaga<
      CommandeFinaliseDemandeDevenirAidant,
      DemandeDevenirAidantFinalisee | undefined
    >
{
  constructor(
    private readonly busCommande: BusCommande,
    private readonly service: ServiceDevenirAidant
  ) {}

  execute(
    commande: CommandeFinaliseDemandeDevenirAidant
  ): Promise<DemandeDevenirAidantFinalisee | undefined> {
    return this.service.rechercheParMail(commande.mail).then((demande) => {
      if (demande) {
        return this.busCommande
          .publie<CommandeCreeCompteAidant, CompteAidantCree>({
            dateSignatureCGU: demande.date,
            identifiantConnexion: demande.mail,
            nomPrenom: `${demande.prenom} ${demande.nom}`,
            type: 'CommandeCreeCompteAidant',
          })
          .then((aidantCree) => ({
            identifiantAidant: aidantCree.identifiant,
          }));
      }
      return undefined;
    });
  }
}
