import { BusCommande, CapteurSaga, Saga } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement } from '../domaine/BusEvenement';
import { CommandeRechercheAideParEmail } from '../aide/CapteurCommandeRechercheAideParEmail';
import { CommandeCreerAide } from '../aide/CapteurCommandeCreerAide';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { Aide } from '../aide/Aide';

export type SagaDemandeValidationCGUAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
};

export class CapteurSagaDemandeValidationCGUAide
  implements CapteurSaga<SagaDemandeValidationCGUAide, void>
{
  constructor(
    _entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    _busEvenement: BusEvenement,
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
  ) {}

  async execute(saga: SagaDemandeValidationCGUAide): Promise<void> {
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
        .then(
          async (aide: Aide) =>
            await this.adaptateurEnvoiMail.envoie({
              objet: "Demande d'aide pour MonAideCyber",
              destinataire: { email: aide.email },
              corps: construisMailCGUAide(aide),
            }),
        );
      return Promise.resolve();
    } catch (erreur) {
      return Promise.reject("Votre demande d'aide n'a pu aboutir");
    }
  }
}

const construisMailCGUAide = (aide: Aide) => {
  const formateDate = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant(),
  );
  const raisonSociale = aide.raisonSociale
    ? `- Raison sociale: ${aide.raisonSociale}\n`
    : '';
  return (
    'Bonjour,\n' +
    '\n' +
    'Votre demande a bien été validée !\n' +
    '\n' +
    'Votre demande pour bénéficier d’un accompagnement MonAideCyber a été validée par nos équipes. Vous allez être mis en relation avec un Aidant de proximité, qui vous contactera directement sur l’adresse email que vous nous avez communiquée.\n' +
    '\n' +
    'Ci-dessous vous retrouverez les informations que vous avez saisies lors de votre demande :\n' +
    `- Signature des CGU : ${formateDate.date} à ${formateDate.heure}\n` +
    `- Département: ${aide.departement}\n` +
    raisonSociale +
    '\n' +
    'Toute l’équipe MonAideCyber reste à votre disposition : monaidecyber@ssi.gouv.fr\n'
  );
};
