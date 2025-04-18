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

export class ErreurUtilisateurMACInconnu extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type SagaDemandeAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: Departement;
  raisonSociale?: string;
  relationUtilisateur?: string;
  identifiantAidant?: crypto.UUID;
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
      relationUtilisateur: UtilisateurMACDTO | undefined
    ) => {
      await adaptateurEnvoiMail.envoieConfirmationDemandeAide(
        aide.email,
        relationUtilisateur
          ? {
              nomPrenom: relationUtilisateur.nomUsage,
              email: relationUtilisateur.email,
            }
          : undefined
      );
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
        copie: adaptateurEnvironnement.messagerie().copieMAC(),
        corps: adaptateursCorpsMessage
          .demande()
          .recapitulatifDemandeAide()
          .genereCorpsMessage(aide, relationUtilisateur),
      });
    };

    const rechercheUtilisateurMAC = async () => {
      let utilisateurMAC: UtilisateurMACDTO | undefined = undefined;
      if (saga.relationUtilisateur) {
        utilisateurMAC = await uneRechercheUtilisateursMAC(
          this.entrepotUtilisateurMAC
        ).rechercheParMail(saga.relationUtilisateur);
        if (!utilisateurMAC) {
          throw new ErreurUtilisateurMACInconnu(
            'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.'
          );
        }
      }
      if (saga.identifiantAidant) {
        utilisateurMAC = await uneRechercheUtilisateursMAC(
          this.entrepotUtilisateurMAC
        ).rechercheParIdentifiant(saga.identifiantAidant);
        if (!utilisateurMAC) {
          throw new ErreurUtilisateurMACInconnu(
            'L’Aidant fourni n’est pas référencé.'
          );
        }
      }
      return utilisateurMAC;
    };

    const utilisateurMAC = await rechercheUtilisateurMAC();
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
          if (
            !utilisateurMAC ||
            utilisateurMAC.profil !== 'UtilisateurInscrit'
          ) {
            await envoieRecapitulatifDemandeAide(
              this.adaptateurEnvoiMail,
              aide,
              utilisateurMAC?.email
            );
          }

          await envoieConfirmationDemandeAide(
            this.adaptateurEnvoiMail,
            aide,
            utilisateurMAC
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
