import {
  EntrepotDemandeDevenirAidant,
  futurAidantEnAttenteAdhesionAssociation,
  StatutDemande,
} from './DemandeDevenirAidant';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

type EnAttenteAdhesion = 'Oui' | 'Non';
export type DemandeDevenirAidant = {
  nom: string;
  prenom: string;
  dateDemande: string;
  departement: string;
  entiteMorale?: string;
  enAttenteAdhesion?: EnAttenteAdhesion;
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
        .map((demande) => {
          const enAttenteAdhesion =
            futurAidantEnAttenteAdhesionAssociation(demande);
          return {
            nom: demande.nom,
            prenom: demande.prenom,
            dateDemande: FournisseurHorloge.formateDate(demande.date).date,
            departement: demande.departement.nom,
            ...(demande.entite?.nom && { entiteMorale: demande.entite.nom }),
            ...(enAttenteAdhesion && {
              enAttenteAdhesion: enAttenteAdhesion
                ? 'Oui'
                : ('Non' as EnAttenteAdhesion),
            }),
          };
        })
    );
  }
}

export const unServiceDemandesDevenirAidant = (
  entrepot: EntrepotDemandeDevenirAidant
): ServiceDemandesDevenirAidant =>
  new ServiceDemandesDevenirAidantMAC(entrepot);
