import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Aide } from '../../aide/Aide';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { CommandeRechercheAideParEmail } from '../../aide/CapteurCommandeRechercheAideParEmail';
import { CommandeCreerAide } from '../../aide/CapteurCommandeCreerAide';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { rechercheParNomDepartement } from '../departements';

export type SagaDemandeAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type DemandeAideCree = Evenement<{
  identifiantAide: crypto.UUID;
  departement: string;
}>;

export class CapteurSagaDemandeAide
  implements CapteurSaga<SagaDemandeAide, void>
{
  constructor(
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail
  ) {}

  async execute(saga: SagaDemandeAide): Promise<void> {
    const envoieConfirmationDemandeAide = async (
      adaptateurEnvoiMail: AdaptateurEnvoiMail,
      aide: Aide,
      relationAidant: boolean
    ) => {
      await adaptateurEnvoiMail.envoie({
        objet: "Demande d'aide pour MonAideCyber",
        destinataire: { email: aide.email },
        corps: construisMailConfirmationDemandeAide(aide, relationAidant),
      });
    };

    const envoieRecapitulatifDemandeAide = async (
      adaptateurEnvoiMail: AdaptateurEnvoiMail,
      aide: Aide,
      relationAidant: boolean
    ) => {
      await adaptateurEnvoiMail.envoie({
        objet: "Demande d'aide pour MonAideCyber",
        destinataire: {
          email: adaptateurEnvironnement.messagerie().emailMAC(),
        },
        corps: construisMailRecapitulatifDemandeAide(aide, relationAidant),
      });
    };

    try {
      const commandeRechercheAideParEmail: CommandeRechercheAideParEmail = {
        type: 'CommandeRechercheAideParEmail',
        email: saga.email,
      };

      const aide = await this.busCommande.publie(commandeRechercheAideParEmail);

      if (aide) {
        return Promise.resolve();
      }

      const commandeCreerAide: CommandeCreerAide = {
        type: 'CommandeCreerAide',
        departement: saga.departement,
        email: saga.email,
        ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
      };

      await this.busCommande
        .publie<CommandeCreerAide, Aide>(commandeCreerAide)
        .then(async (aide: Aide) => {
          await envoieConfirmationDemandeAide(
            this.adaptateurEnvoiMail,
            aide,
            saga.relationAidant
          );
          await envoieRecapitulatifDemandeAide(
            this.adaptateurEnvoiMail,
            aide,
            saga.relationAidant
          );

          await this.busEvenement.publie<DemandeAideCree>({
            identifiant: aide.identifiant,
            type: 'AIDE_CREE',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiantAide: aide.identifiant,
              departement: rechercheParNomDepartement(saga.departement).code,
            },
          });
        });

      return Promise.resolve();
    } catch (erreur) {
      return Promise.reject("Votre demande d'aide n'a pu aboutir");
    }
  }
}

const construisMailRecapitulatifDemandeAide = (
  aide: Aide,
  relationAidant: boolean
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale: ${aide.raisonSociale}\n`
    : '';
  const miseEnRelation = relationAidant
    ? '- Est déjà en relation avec un Aidant\n'
    : '';
  return (
    'Bonjour,\n' +
    '\n' +
    `Une demande d’aide a été faite par ${aide.email}\n` +
    '\n' +
    'Ci-dessous, les informations concernant cette demande :\n' +
    miseEnRelation +
    `- Date de la demande : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département: ${aide.departement}\n` +
    raisonSociale
  );
};

const construisMailConfirmationDemandeAide = (
  aide: Aide,
  relationAidant: boolean
) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale : ${aide.raisonSociale}\n`
    : '';
  const messageIntroduction = relationAidant
    ? 'Votre demande a bien été prise en compte.\n' +
      '\n' +
      'Votre Aidant va vous accompagner dans la suite de votre démarche MonAideCyber.\n' +
      'Voici les informations que vous avez renseignées :\n'
    : 'Votre demande pour bénéficier de MonAideCyber a été prise en compte.\n' +
      'Un Aidant de proximité vous contactera sur l’adresse email que vous nous avez communiquée dans les meilleurs délais.\n' +
      '\n' +
      'Voici les informations que vous avez renseignées :\n';
  return (
    'Bonjour,\n' +
    '\n' +
    messageIntroduction +
    `- Signature des CGU le ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département : ${aide.departement}\n` +
    raisonSociale +
    '\n' +
    'Toute l’équipe reste à votre disposition,\n\n' +
    "L'équipe MonAideCyber\n" +
    'monaidecyber@ssi.gouv.fr\n'
  );
};
