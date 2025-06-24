import { UUID } from 'crypto';
import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';
import { DemandeDevenirAidant } from './DemandeDevenirAidant';

export type SagaActivationCompteAidant = Omit<Saga, 'type'> & {
  type: 'SagaActivationCompteAidant';
  mail: string;
};
export type ActivationCompteAidantFaite = {
  identifiantDemande: UUID;
};

export class CapteurSagaActivationCompteAidant
  implements
    CapteurSaga<
      SagaActivationCompteAidant,
      ActivationCompteAidantFaite | undefined
    >
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiDeMail: AdaptateurEnvoiMail,
    private readonly serviceDeChiffrement: ServiceDeChiffrement,
    __busCommande: BusCommande
  ) {}

  async execute(
    commande: SagaActivationCompteAidant
  ): Promise<ActivationCompteAidantFaite | undefined> {
    const envoiMailCreationCompte = (demande: DemandeDevenirAidant) => ({
      identifiantDemande: demande.identifiant,
    });

    const demande = await this.entrepots
      .demandesDevenirAidant()
      .rechercheDemandeEnCoursParMail(commande.mail);

    if (demande) {
      try {
        await this.envoieMail(demande);
        try {
          await this.busEvenement.publie<MailFinalisationCreationCompteAidantEnvoye>(
            {
              corps: {
                identifiantDemande: demande.identifiant,
              },
              date: FournisseurHorloge.maintenant(),
              identifiant: adaptateurUUID.genereUUID(),
              type: 'MAIL_CREATION_COMPTE_AIDANT_ENVOYE',
            }
          );
          return envoiMailCreationCompte(demande);
        } catch (__e) {
          return envoiMailCreationCompte(demande);
        }
      } catch (__e) {
        await this.busEvenement
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
          });
      }
    }
    return undefined;
  }

  private envoieMail(demande: DemandeDevenirAidant): Promise<void> {
    const partieChiffree = this.serviceDeChiffrement.chiffre(
      Buffer.from(
        JSON.stringify({ demande: demande.identifiant, mail: demande.mail }),
        'binary'
      ).toString('base64')
    );
    return this.adaptateurEnvoiDeMail.envoie({
      objet: 'MonAideCyber - Création de votre espace Aidant',
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
