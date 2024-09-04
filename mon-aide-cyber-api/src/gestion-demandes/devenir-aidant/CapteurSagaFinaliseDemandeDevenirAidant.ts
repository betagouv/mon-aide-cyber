import { UUID } from 'crypto';
import { BusCommande, CapteurSaga, Commande } from '../../domaine/commande';
import { ServiceDevenirAidant } from './ServiceDevenirAidant';
import {
  CommandeCreeCompteAidant,
  CompteAidantCree,
} from '../../authentification/CapteurCommandeCreeCompteAidant';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

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
    private readonly service: ServiceDevenirAidant,
    private readonly adaptateurEnvoiDeMail: AdaptateurEnvoiMail,
    private readonly serviceDeChiffrement: ServiceDeChiffrement
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
          .then((aidantCree) => {
            const partieChiffree = this.serviceDeChiffrement.chiffre(
              aidantCree.identifiant
            );
            this.adaptateurEnvoiDeMail.envoie({
              objet: 'Mon Aide Cyber - Création de votre compte Aidant',
              corps: adaptateurCorpsMessage
                .finaliseDemandeDevenirAidant()
                .genereCorpsMessage(
                  aidantCree.nomPrenom,
                  `${adaptateurEnvironnement.mac().urlMAC()}/demandes/devenir-aidant/finalise?token=${partieChiffree}`
                ),
              destinataire: { email: aidantCree.email },
            });
            return {
              identifiantAidant: aidantCree.identifiant,
            };
          });
      }
      return undefined;
    });
  }
}
