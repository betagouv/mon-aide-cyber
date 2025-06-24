import { UUID } from 'crypto';
import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';
import { DemandeDevenirAidant } from './DemandeDevenirAidant';
import { SagaDemandeAidantCreeEspaceAidant } from './CapteurSagaDemandeAidantCreeEspaceAidant';

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
    private readonly busCommande: BusCommande
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
      await this.busCommande.publie<SagaDemandeAidantCreeEspaceAidant, void>({
        type: 'SagaDemandeAidantEspaceAidant',
        idDemande: demande.identifiant,
      });
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
    return this.adaptateurEnvoiDeMail.envoie({
      objet: 'MonAideCyber - Votre compte Aidant est activé !',
      corps: adaptateurCorpsMessage
        .compteAidantActive()
        .genereCorpsMessage(`${demande.prenom} ${demande.nom}`),
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
