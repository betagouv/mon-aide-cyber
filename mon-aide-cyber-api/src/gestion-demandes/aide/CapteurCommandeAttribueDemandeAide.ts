import { CapteurCommande, Commande } from '../../domaine/commande';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { RechercheDemandeAideComplete } from './DemandeAide';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { Entrepots } from '../../domaine/Entrepots';
import { AdaptateurRechercheEntreprise } from '../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';

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
    private readonly bus: BusEvenement,
    private readonly entrepot: Entrepots,
    private readonly rechercheEntreprise: AdaptateurRechercheEntreprise
  ) {}

  async execute(commande: CommandeAttribueDemandeAide): Promise<void> {
    const dejaPourvue = await this.relations.demandeDejaPourvue(
      commande.identifiantDemande
    );

    if (dejaPourvue) {
      await this.bus.publie(this.evenementDejaPourvue(commande));
      throw new DemandeAideDejaPourvue();
    }

    const { demandeAide }: RechercheDemandeAideComplete = (await this.entrepot
      .demandesAides()
      .rechercheParEmail(
        commande.emailDemande
      )) as RechercheDemandeAideComplete;

    const aidant = await this.entrepot
      .aidants()
      .lis(commande.identifiantAidant);

    await this.relations.attribueDemandeAAidant(
      commande.identifiantDemande,
      commande.identifiantAidant
    );

    const entreprise = await this.rechercheEntreprise.rechercheParSiret(
      demandeAide.siret
    );

    await this.adaptateurEnvoiMail.envoieConfirmationDemandeAideAttribuee({
      emailAidant: aidant.email,
      nomPrenomAidant: aidant.nomPrenom,
      departement: demandeAide.departement,
      emailEntite: demandeAide.email,
      secteursActivite: entreprise!.secteursActivite
        .map((s) => s.nom)
        .join(', '),
      typeEntite: entreprise!.typeEntite.nom,
    });

    await this.bus.publie<DemandeAidePourvue>(this.evenementSucces(commande));
  }

  private evenementDejaPourvue(
    commande: CommandeAttribueDemandeAide
  ): DemandeAidePourvue {
    return {
      identifiant: crypto.randomUUID(),
      type: 'DEMANDE_AIDE_POURVUE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande: commande.identifiantDemande,
        identifiantAidant: commande.identifiantAidant,
        statut: 'DEJA_POURVUE',
      },
    };
  }

  private evenementSucces(
    commande: CommandeAttribueDemandeAide
  ): DemandeAidePourvue {
    return {
      identifiant: crypto.randomUUID(),
      type: 'DEMANDE_AIDE_POURVUE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande: commande.identifiantDemande,
        identifiantAidant: commande.identifiantAidant,
        statut: 'SUCCESS',
      },
    };
  }
}
