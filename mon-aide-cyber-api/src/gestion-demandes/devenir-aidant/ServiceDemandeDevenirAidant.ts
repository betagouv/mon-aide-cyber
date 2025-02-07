import { Departement } from '../departements';
import {
  EntrepotDemandeDevenirAidant,
  StatutDemande,
} from './DemandeDevenirAidant';

type DemandeDevenirAidant = {
  nom: string;
  prenom: string;
  dateDemande: Date;
  departement: Departement;
};
export type DemandesDevenirAidant = DemandeDevenirAidant[];

interface ServiceDemandesDevenirAidant {
  demandesEnCours(): Promise<DemandesDevenirAidant>;
}

class ServiceDemandesDevenirAidantMAC implements ServiceDemandesDevenirAidant {
  constructor(private readonly entrepot: EntrepotDemandeDevenirAidant) {}

  demandesEnCours(): Promise<DemandesDevenirAidant> {
    return this.entrepot.tous().then((demandes) =>
      demandes
        .filter((demande) => demande.statut === StatutDemande.EN_COURS)
        .map((demande) => ({
          nom: demande.nom,
          prenom: demande.prenom,
          dateDemande: demande.date,
          departement: demande.departement,
        }))
    );
  }
}

export const unServiceDemandesDevenirAidant = (
  entrepot: EntrepotDemandeDevenirAidant
): ServiceDemandesDevenirAidant =>
  new ServiceDemandesDevenirAidantMAC(entrepot);
