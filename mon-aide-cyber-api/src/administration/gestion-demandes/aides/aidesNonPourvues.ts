import { Entrepots } from '../../../domaine/Entrepots';
import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';

type DetailsDemande = {
  entite: string;
  departement: string;
  dateDeDemande: Date;
};
type DemandeAidesNonPourvues = {
  demandesSansDiagnostic: DetailsDemande[];
  demandesSansAidant: DetailsDemande[];
};

class RechercheDemandesAidesNonPourvues {
  constructor(
    private readonly entrepots: Entrepots,
    private adaptateurRelationsMAC: AdaptateurRelationsMAC
  ) {}

  async recherche(): Promise<DemandeAidesNonPourvues> {
    const toutesLesDemandes = await this.entrepots.demandesAides().toutes({
      dateSignatureCGU: new Date(Date.parse('2025-06-04T00:00:00+01:00')),
    });
    const toutesLesDemandesAvecDiagnostic =
      await this.adaptateurRelationsMAC.toutesLesDemandesAyantUnDiagnosticInitie(
        toutesLesDemandes.map((demande) => demande.email)
      );

    const toutesLesDemandesAyantUnAidant =
      await this.adaptateurRelationsMAC.toutesLesDemandesAyantUnAidant(
        toutesLesDemandes.map((demande) => demande.identifiant)
      );

    return toutesLesDemandes.reduce(
      (precedent, courant) => {
        const demandeSansDiagnostic = toutesLesDemandesAvecDiagnostic.some(
          (d) => d.utilisateur.identifiant === courant.email
        );
        if (!demandeSansDiagnostic) {
          precedent.demandesSansDiagnostic.push({
            entite: courant.email,
            departement: courant.departement.nom,
            dateDeDemande: courant.dateSignatureCGU,
          });
        }
        const demandeSansAidant = toutesLesDemandesAyantUnAidant.some(
          (d) => d.objet.identifiant === courant.identifiant
        );
        if (!demandeSansAidant) {
          precedent.demandesSansAidant.push({
            entite: courant.email,
            departement: courant.departement.nom,
            dateDeDemande: courant.dateSignatureCGU,
          });
        }
        return precedent;
      },
      {
        demandesSansAidant: [],
        demandesSansDiagnostic: [],
      } as DemandeAidesNonPourvues
    );
  }
}

export const lesAidesNonPourvues = (
  entrepots: Entrepots,
  adaptateurRelationsMAC: AdaptateurRelationsMAC
): RechercheDemandesAidesNonPourvues => {
  return new RechercheDemandesAidesNonPourvues(
    entrepots,
    adaptateurRelationsMAC
  );
};
