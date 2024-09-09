import { UUID } from 'crypto';
import { CapteurSaga, Commande } from '../../domaine/commande';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';
import { DemandeDevenirAidant } from './DemandeDevenirAidant';

export type CommandeEnvoiMailCreationCompteAidant = Omit<Commande, 'type'> & {
  type: 'CommandeEnvoiMailCreationCompteAidant';
  mail: string;
};
export type DemandeFinalisationDevenirAidantEnvoyee = {
  identifiantDemande: UUID;
};

export class CapteurCommandeEnvoiMailCreationCompteAidant
  implements
    CapteurSaga<
      CommandeEnvoiMailCreationCompteAidant,
      DemandeFinalisationDevenirAidantEnvoyee | undefined
    >
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiDeMail: AdaptateurEnvoiMail,
    private readonly serviceDeChiffrement: ServiceDeChiffrement
  ) {}

  execute(
    commande: CommandeEnvoiMailCreationCompteAidant
  ): Promise<DemandeFinalisationDevenirAidantEnvoyee | undefined> {
    const envoiMailCreationCompte = (demande: DemandeDevenirAidant) => ({
      identifiantDemande: demande.identifiant,
    });

    return this.entrepots
      .demandesDevenirAidant()
      .rechercheParMail(commande.mail)
      .then((demande) => {
        if (demande) {
          return this.envoieMail(demande)
            .then(() => {
              return this.busEvenement
                .publie<MailFinalisationCreationCompteAidantEnvoye>({
                  corps: {
                    identifiantDemande: demande.identifiant,
                  },
                  date: FournisseurHorloge.maintenant(),
                  identifiant: adaptateurUUID.genereUUID(),
                  type: 'MAIL_CREATION_COMPTE_AIDANT_ENVOYE',
                })
                .then(() => envoiMailCreationCompte(demande))
                .catch(() => envoiMailCreationCompte(demande));
            })
            .catch(() =>
              this.busEvenement
                .publie<MailFinalisationCreationCompteAidantNonEnvoye>({
                  corps: {
                    identifiantDemande: demande.identifiant,
                  },
                  date: FournisseurHorloge.maintenant(),
                  identifiant: adaptateurUUID.genereUUID(),
                  type: 'MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE',
                })
                .then(() => {
                  throw new ErreurEnvoiMailCreationCompteAidant(
                    `Une erreur est survenue lors de l’envoi du mail pour la demande de "${demande.mail}"`
                  );
                })
            );
        }
        return undefined;
      });
  }

  private envoieMail(demande: DemandeDevenirAidant): Promise<void> {
    const partieChiffree = this.serviceDeChiffrement.chiffre(
      Buffer.from(
        JSON.stringify({ demande: demande.identifiant, mail: demande.mail }),
        'binary'
      ).toString('base64')
    );
    return this.adaptateurEnvoiDeMail.envoie({
      objet: 'Mon Aide Cyber - Création de votre compte Aidant',
      corps: adaptateurCorpsMessage
        .finaliseDemandeDevenirAidant()
        .genereCorpsMessage(
          `${demande.prenom} ${demande.nom}`,
          `${adaptateurEnvironnement.mac().urlMAC()}/demandes/devenir-aidant/finalise?token=${partieChiffree}`
        ),
      destinataire: { email: demande.mail },
    });
  }
}

export type MailFinalisationCreationCompteAidantEnvoye = Evenement<{
  identifiantDemande: UUID;
}>;

export type MailFinalisationCreationCompteAidantNonEnvoye =
  MailFinalisationCreationCompteAidantEnvoye;

export class ErreurEnvoiMailCreationCompteAidant extends Error {
  constructor(message: string) {
    super(message);
  }
}
