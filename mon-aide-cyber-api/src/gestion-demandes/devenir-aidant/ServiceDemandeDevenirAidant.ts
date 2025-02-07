import {
  EntrepotDemandeDevenirAidant,
  StatutDemande,
} from './DemandeDevenirAidant';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

type DemandeDevenirAidant = {
  nom: string;
  prenom: string;
  dateDemande: string;
  departement: string;
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
          dateDemande: FournisseurHorloge.formateDate(demande.date).date,
          departement: demande.departement.nom,
        }))
    );
  }
}

export const unServiceDemandesDevenirAidant = (
  entrepot: EntrepotDemandeDevenirAidant
): ServiceDemandesDevenirAidant =>
  new ServiceDemandesDevenirAidantMAC(entrepot);
