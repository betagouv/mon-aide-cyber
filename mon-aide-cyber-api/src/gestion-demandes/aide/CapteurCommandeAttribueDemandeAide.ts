import { CapteurCommande, Commande } from '../../domaine/commande';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { DemandeAide } from './DemandeAide';
import { gironde } from '../departements';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { Aidant } from '../../espace-aidant/Aidant';
import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';

export type CommandeAttribueDemandeAide = Omit<Commande, 'type'> & {
  type: 'CommandeAttribueDemandeAide';
  identifiantDemande: crypto.UUID;
  identifiantAidant: crypto.UUID;
  emailDemande: string;
};

export type DemandeAidePourvue = Evenement<{
  identifiantDemande: crypto.UUID;
  identifiantAidant: crypto.UUID;
  statut: 'SUCCESS' | 'DEJA_POURVUE';
}>;

export class DemandeAideDejaPourvue extends Error {
  constructor() {
    super('La demande d’Aide est déjà pourvue.');
  }
}

export class CapteurCommandeAttribueDemandeAide
  implements CapteurCommande<CommandeAttribueDemandeAide, void>
{
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly relations: AdaptateurRelations,
    private readonly bus: BusEvenement
  ) {}

  async execute(commande: CommandeAttribueDemandeAide): Promise<void> {
    const dejaPourvue = await this.relations.demandeDejaPourvue(
      commande.identifiantDemande
    );

    if (dejaPourvue) {
      await this.bus.publie(
        this.evenementTropTard(
          commande.identifiantDemande,
          commande.identifiantAidant
        )
      );
      throw new DemandeAideDejaPourvue();
    }

    const demandeAide: DemandeAide = {
      email: 'entite-aidee@yopmail.com',
      raisonSociale: 'BETAGOUV',
      departement: gironde,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      identifiant: crypto.randomUUID(),
      siret: '12345',
    };

    const aidant: Aidant = {
      consentementAnnuaire: false,
      email: 'user-xavier@yopmail.com',
      nomPrenom: 'User XAVIER',
      preferences: {
        secteursActivite: [],
        departements: [],
        typesEntites: [],
        nomAffichageAnnuaire: 'User X.',
      },
      identifiant: crypto.randomUUID(),
    };

    await this.relations.attribueDemandeAAidant(
      commande.identifiantDemande,
      commande.identifiantAidant
    );

    await this.adaptateurEnvoiMail.envoieConfirmationDemandeAideAttribuee({
      emailAidant: aidant.email,
      nomPrenomAidant: aidant.nomPrenom,
      departement: demandeAide.departement,
      emailEntite: demandeAide.email,
    });

    await this.bus.publie<DemandeAidePourvue>(
      this.evenementSucces(
        commande.identifiantDemande,
        commande.identifiantAidant
      )
    );
  }

  private evenementTropTard(
    identifiantDemande: crypto.UUID,
    identifiantAidant: crypto.UUID
  ): DemandeAidePourvue {
    return {
      identifiant: crypto.randomUUID(),
      type: 'DEMANDE_AIDE_POURVUE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande,
        identifiantAidant,
        statut: 'DEJA_POURVUE',
      },
    };
  }

  private evenementSucces(
    identifiantDemande: crypto.UUID,
    identifiantAidant: crypto.UUID
  ): DemandeAidePourvue {
    return {
      identifiant: crypto.randomUUID(),
      type: 'DEMANDE_AIDE_POURVUE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande,
        identifiantAidant,
        statut: 'SUCCESS',
      },
    };
  }
}
