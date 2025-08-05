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

  private async verifieSiUnAidantExisteDeja(email: string): Promise<boolean> {
    try {
      await this.entrepots.aidants().rechercheParEmail(email);
      return true;
    } catch (erreur) {
      return false;
    }
  }

  async execute(
    commande: SagaActivationCompteAidant
  ): Promise<ActivationCompteAidantFaite | undefined> {
    const envoiMailCreationCompte = (demande: DemandeDevenirAidant) => ({
      identifiantDemande: demande.identifiant,
    });

    if (await this.verifieSiUnAidantExisteDeja(commande.mail)) {
      await this.publieEchec(commande.mail, 'AIDANT_DEJA_EXISTANT');
      return;
    }

    const demande = await this.entrepots
      .demandesDevenirAidant()
      .rechercheDemandeEnCoursParMail(commande.mail);

    if (!demande) {
      await this.publieEchec(
        commande.mail,
        'DEMANDE_DEVENIR_AIDANT_INEXISTANTE'
      );
      return undefined;
    }

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
    } catch (e: unknown | Error) {
      await this.busEvenement.publie<MailCompteAidantActiveNonEnvoye>({
        corps: {
          identifiantDemande: demande.identifiant,
          erreur: e instanceof Error ? e.message : (e as string),
        },
        date: FournisseurHorloge.maintenant(),
        identifiant: adaptateurUUID.genereUUID(),
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
      });
      throw new ErreurEnvoiMailCreationCompteAidant(
        `Une erreur est survenue lors de l’envoi du mail pour la demande de "${demande.mail}"`
      );
    }
  }

  private async publieEchec(
    mail: string,
    raisonEchec: 'AIDANT_DEJA_EXISTANT' | 'DEMANDE_DEVENIR_AIDANT_INEXISTANTE'
  ) {
    await this.busEvenement.publie<ActivationCompteAidantEchouee>({
      identifiant: crypto.randomUUID(),
      type: 'ACTIVATION_COMPTE_AIDANT_ECHOUEE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        emailDemande: mail,
        raisonEchec,
      },
    });
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

export type ActivationCompteAidantEchouee = Evenement<{
  emailDemande: string;
  raisonEchec: 'AIDANT_DEJA_EXISTANT' | 'DEMANDE_DEVENIR_AIDANT_INEXISTANTE';
}>;

export type MailCompteAidantActiveNonEnvoye = Evenement<{
  identifiantDemande: UUID;
  erreur: string;
}>;

export class ErreurEnvoiMailCreationCompteAidant extends Error {
  constructor(message: string) {
    super(message);
  }
}
