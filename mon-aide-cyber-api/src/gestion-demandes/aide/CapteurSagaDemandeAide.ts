import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { Departement } from '../departements';
import { adaptateursCorpsMessage } from './adaptateursCorpsMessage';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { DemandeAide, RechercheDemandeAide } from './DemandeAide';
import { CommandeRechercheAideParEmail } from './CapteurCommandeRechercheDemandeAideParEmail';
import { CommandeCreerDemandeAide } from './CapteurCommandeCreerDemandeAide';
import { CommandeMettreAJourDemandeAide } from './CapteurCommandeMettreAJourDemandeAide';
import {
  EntrepotUtilisateursMAC,
  uneRechercheUtilisateursMAC,
  UtilisateurMACDTO,
} from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

export type SagaDemandeAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: Departement;
  raisonSociale?: string;
  relationUtilisateur?: string;
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
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly entrepotUtilisateurMAC: EntrepotUtilisateursMAC,
    private readonly annuaireCOT: () => {
      rechercheEmailParDepartement: (departement: Departement) => string;
    }
  ) {}

  async execute(saga: SagaDemandeAide): Promise<void> {
    const envoieConfirmationDemandeAide = async (
      adaptateurEnvoiMail: AdaptateurEnvoiMail,
      aide: DemandeAide,
      relationUtilisateur: string | undefined
    ) => {
      await adaptateurEnvoiMail.envoie({
        objet: "Demande d'aide pour MonAideCyber",
        destinataire: { email: aide.email },
        corps: adaptateursCorpsMessage
          .demande()
          .confirmationDemandeAide()
          .genereCorpsMessage(aide, relationUtilisateur),
      });
    };

    const envoieRecapitulatifDemandeAide = async (
      adaptateurEnvoiMail: AdaptateurEnvoiMail,
      aide: DemandeAide,
      relationUtilisateur: string | undefined
    ) => {
      await adaptateurEnvoiMail.envoie({
        objet: "Demande d'aide pour MonAideCyber",
        destinataire: {
          email: this.annuaireCOT().rechercheEmailParDepartement(
            aide.departement
          ),
        },
        copie: adaptateurEnvironnement.messagerie().emailMAC(),
        corps: adaptateursCorpsMessage
          .demande()
          .recapitulatifDemandeAide()
          .genereCorpsMessage(aide, relationUtilisateur),
      });
    };

    try {
      const commandeRechercheAideParEmail: CommandeRechercheAideParEmail = {
        type: 'CommandeRechercheAideParEmail',
        email: saga.email,
      };

      const aide = await this.busCommande.publie<
        CommandeRechercheAideParEmail,
        RechercheDemandeAide
      >(commandeRechercheAideParEmail);

      if (aide.etat === 'COMPLET') {
        const commandeMettreAJourAide: CommandeMettreAJourDemandeAide = {
          type: 'CommandeMettreAJourDemandeAide',
          identifiant: aide.demandeAide!.identifiant,
          departement: saga.departement,
          email: saga.email,
          ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
        };
        return this.busCommande.publie<CommandeMettreAJourDemandeAide, void>(
          commandeMettreAJourAide
        );
      }

      const commandeCreerAide: CommandeCreerDemandeAide = {
        type: 'CommandeCreerDemandeAide',
        departement: saga.departement,
        email: saga.email,
        ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
        ...(aide.etat === 'INCOMPLET' && { etat: 'INCOMPLET' }),
      };

      await this.busCommande
        .publie<CommandeCreerDemandeAide, DemandeAide>(commandeCreerAide)
        .then(async (aide: DemandeAide) => {
          let utilisateurMAC: UtilisateurMACDTO | undefined = undefined;
          if (saga.relationUtilisateur) {
            utilisateurMAC = await uneRechercheUtilisateursMAC(
              this.entrepotUtilisateurMAC
            ).rechercheParMail(saga.relationUtilisateur);
          }

          if (
            !utilisateurMAC ||
            utilisateurMAC.profil !== 'UtilisateurInscrit'
          ) {
            await envoieRecapitulatifDemandeAide(
              this.adaptateurEnvoiMail,
              aide,
              saga.relationUtilisateur
            );
          }

          await envoieConfirmationDemandeAide(
            this.adaptateurEnvoiMail,
            aide,
            saga.relationUtilisateur
          );

          await this.busEvenement.publie<DemandeAideCree>({
            identifiant: aide.identifiant,
            type: 'AIDE_CREE',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiantAide: aide.identifiant,
              departement: saga.departement.code,
            },
          });
        });
    } catch (erreur) {
      return Promise.reject("Votre demande d'aide n'a pu aboutir");
    }
  }
}
