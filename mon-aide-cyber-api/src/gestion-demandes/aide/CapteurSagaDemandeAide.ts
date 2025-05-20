import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { Departement } from '../departements';
import { DemandeAide, RechercheDemandeAide } from './DemandeAide';
import { CommandeRechercheAideParEmail } from './CapteurCommandeRechercheDemandeAideParEmail';
import { CommandeCreerDemandeAide } from './CapteurCommandeCreerDemandeAide';
import { CommandeMettreAJourDemandeAide } from './CapteurCommandeMettreAJourDemandeAide';
import {
  EntrepotUtilisateursMAC,
  uneRechercheUtilisateursMAC,
  UtilisateurMACDTO,
} from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  DirecteAidant,
  DirecteUtilisateurInscrit,
  FabriqueMiseEnRelation,
  ParCriteres,
  ResultatMiseEnRelation,
} from './miseEnRelation';
import { AdaptateurRechercheEntreprise } from '../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';

export class ErreurUtilisateurMACInconnu extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ErreurDemandeAideEntrepriseInconnue extends Error {
  constructor() {
    super('Aucune entreprise ne correspond au SIRET');
  }
}

export type SagaDemandeAide = Saga & {
  cguValidees: boolean;
  email: string;
  departement: Departement;
  raisonSociale?: string;
  relationUtilisateur?: string;
  identifiantAidant?: crypto.UUID;
  siret: string;
};

export type DemandeAideCree<
  T extends ResultatMiseEnRelation<
    ParCriteres | DirecteAidant | DirecteUtilisateurInscrit
  >,
> = Evenement<{
  identifiantAide: crypto.UUID;
  departement: string;
  miseEnRelation: T;
}>;

const rechercheUtilisateurMAC = async (
  saga: SagaDemandeAide,
  entrepotUtilisateurMAC: EntrepotUtilisateursMAC
) => {
  let utilisateurMAC: UtilisateurMACDTO | undefined = undefined;
  if (saga.relationUtilisateur) {
    utilisateurMAC = await uneRechercheUtilisateursMAC(
      entrepotUtilisateurMAC
    ).rechercheParMail(saga.relationUtilisateur);
    if (!utilisateurMAC) {
      throw new ErreurUtilisateurMACInconnu(
        'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.'
      );
    }
  }
  if (saga.identifiantAidant) {
    utilisateurMAC = await uneRechercheUtilisateursMAC(
      entrepotUtilisateurMAC
    ).rechercheParIdentifiant(saga.identifiantAidant);
    if (!utilisateurMAC) {
      throw new ErreurUtilisateurMACInconnu(
        'L’Aidant fourni n’est pas référencé.'
      );
    }
  }
  return utilisateurMAC;
};

export class CapteurSagaDemandeAide
  implements CapteurSaga<SagaDemandeAide, void>
{
  constructor(
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement,
    private readonly entrepotUtilisateurMAC: EntrepotUtilisateursMAC,
    private readonly fabriqueMiseEnRelation: FabriqueMiseEnRelation,
    private readonly adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise
  ) {}

  async execute(saga: SagaDemandeAide): Promise<void> {
    const utilisateurMAC = await rechercheUtilisateurMAC(
      saga,
      this.entrepotUtilisateurMAC
    );

    const rechercheEntreprise = async () => {
      const entreprise =
        await this.adaptateurRechercheEntreprise.rechercheParSiret(saga.siret);

      if (!entreprise) {
        throw new ErreurDemandeAideEntrepriseInconnue();
      }
      return entreprise;
    };

    const entreprise = await rechercheEntreprise();

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
          siret: saga.siret,
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
        siret: saga.siret,
        ...(saga.raisonSociale && { raisonSociale: saga.raisonSociale }),
        ...(aide.etat === 'INCOMPLET' && { etat: 'INCOMPLET' }),
      };

      await this.busCommande
        .publie<CommandeCreerDemandeAide, DemandeAide>(commandeCreerAide)
        .then(async (aide: DemandeAide) => {
          const miseEnRelation =
            this.fabriqueMiseEnRelation.fabrique(utilisateurMAC);
          const resultat = await miseEnRelation.execute({
            demandeAide: aide,
            siret: entreprise.siret,
            secteursActivite: entreprise.secteursActivite,
            typeEntite: entreprise.typeEntite,
          });

          await this.busEvenement.publie<DemandeAideCree<typeof resultat>>({
            identifiant: aide.identifiant,
            type: 'AIDE_CREE',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiantAide: aide.identifiant,
              departement: saga.departement.code,
              miseEnRelation: resultat,
            },
          });
        });
    } catch (erreur) {
      return Promise.reject("Votre demande d'aide n'a pu aboutir");
    }
  }
}
