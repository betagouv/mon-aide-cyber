import { UUID } from 'crypto';
import { BusCommande, CapteurSaga, Commande } from '../../domaine/commande';
import {
  CommandeCreeCompteAidant,
  CompteAidantCree,
} from '../../authentification/CapteurCommandeCreeCompteAidant';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';

export type CommandeFinaliseDemandeDevenirAidant = Omit<Commande, 'type'> & {
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
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiDeMail: AdaptateurEnvoiMail,
    private readonly serviceDeChiffrement: ServiceDeChiffrement
  ) {}

  execute(
    commande: CommandeFinaliseDemandeDevenirAidant
  ): Promise<DemandeDevenirAidantFinalisee | undefined> {
    const demandeDevenirAidantFinalisee = (aidantCree: CompteAidantCree) => ({
      identifiantAidant: aidantCree.identifiant,
    });

    return this.entrepots
      .demandesDevenirAidant()
      .rechercheParMail(commande.mail)
      .then((demande) => {
        if (demande) {
          return this.busCommande
            .publie<CommandeCreeCompteAidant, CompteAidantCree>({
              dateSignatureCGU: demande.date,
              identifiantConnexion: demande.mail,
              nomPrenom: `${demande.prenom} ${demande.nom}`,
              type: 'CommandeCreeCompteAidant',
            })
            .then((aidantCree) => {
              return this.envoieMail(aidantCree)
                .then(() => {
                  return this.busEvenement
                    .publie<EvenementDemandeDevenirAidantFinalisee>({
                      corps: {
                        identifiantAidant: aidantCree.identifiant,
                        identifiantDemande: demande.identifiant,
                      },
                      date: FournisseurHorloge.maintenant(),
                      identifiant: adaptateurUUID.genereUUID(),
                      type: 'DEMANDE_DEVENIR_AIDANT_FINALISEE',
                    })
                    .then(() => demandeDevenirAidantFinalisee(aidantCree))
                    .catch(() => demandeDevenirAidantFinalisee(aidantCree));
                })
                .catch(() => demandeDevenirAidantFinalisee(aidantCree));
            });
        }
        return undefined;
      });
  }

  private envoieMail(aidantCree: CompteAidantCree): Promise<void> {
    const partieChiffree = this.serviceDeChiffrement.chiffre(
      aidantCree.identifiant
    );
    return this.adaptateurEnvoiDeMail.envoie({
      objet: 'Mon Aide Cyber - Création de votre compte Aidant',
      corps: adaptateurCorpsMessage
        .finaliseDemandeDevenirAidant()
        .genereCorpsMessage(
          aidantCree.nomPrenom,
          `${adaptateurEnvironnement.mac().urlMAC()}/demandes/devenir-aidant/finalise?token=${partieChiffree}`
        ),
      destinataire: { email: aidantCree.email },
    });
  }
}

export type EvenementDemandeDevenirAidantFinalisee = Evenement<{
  identifiantDemande: UUID;
  identifiantAidant: UUID;
}>;
