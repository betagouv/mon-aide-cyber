import { UUID } from 'crypto';
import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
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
          await this.busEvenement.publie<MailCompteAidantActiveEnvoye>({
            corps: {
              identifiantDemande: demande.identifiant,
            },
            date: FournisseurHorloge.maintenant(),
            identifiant: adaptateurUUID.genereUUID(),
            type: 'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE',
          });
          return envoiMailCreationCompte(demande);
        } catch (__e) {
          return envoiMailCreationCompte(demande);
        }
      } catch (__e) {
        await this.busEvenement
          .publie<MailCompteAidantActiveNonEnvoye>({
            corps: {
              identifiantDemande: demande.identifiant,
            },
            date: FournisseurHorloge.maintenant(),
            identifiant: adaptateurUUID.genereUUID(),
            type: 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
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

  private async envoieMail(demande: DemandeDevenirAidant): Promise<void> {
    return await this.adaptateurEnvoiDeMail.envoieActivationCompteAidantFaite(
      demande.mail
    );
  }
}

export type MailCompteAidantActiveEnvoye = Evenement<{
  identifiantDemande: UUID;
}>;

export type MailCompteAidantActiveNonEnvoye = MailCompteAidantActiveEnvoye;

export class ErreurEnvoiMailCreationCompteAidant extends Error {
  constructor(message: string) {
    super(message);
  }
}
