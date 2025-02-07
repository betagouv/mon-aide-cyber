import { EntrepotDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  DemandesDevenirAidant,
  unServiceDemandesDevenirAidant,
} from '../../gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';

type RepresentationRapport<T> = {
  entete: string | string[];
  intitule: string;
  valeur: T;
};

export interface Extraction {
  extrais<T>(rapport: Rapport<T>): Promise<T>;
}

export interface Rapport<T> {
  ajoute<
    REPRESENTATION_VALEUR,
    REPRESENTATION_RAPPORT extends RepresentationRapport<REPRESENTATION_VALEUR>,
  >(
    representation: REPRESENTATION_RAPPORT
  ): void;

  genere(): Promise<T>;
}

export type RepresentationDemande =
  RepresentationRapport<DemandesDevenirAidant>;

type Parametres = {
  entrepotDemandes: EntrepotDemandeDevenirAidant;
};

class ExtractionMAC implements Extraction {
  constructor(private readonly parametres: Parametres) {}

  async extrais<T>(rapport: Rapport<T>): Promise<T> {
    await unServiceDemandesDevenirAidant(this.parametres.entrepotDemandes)
      .demandesEnCours()
      .then((demandes) => {
        rapport.ajoute<DemandesDevenirAidant, RepresentationDemande>({
          entete: ['Nom', 'Prénom', 'Date de la demande', 'Département'],
          intitule: 'Demandes devenir Aidant',
          valeur: demandes,
        });
      });
    return rapport.genere();
  }
}
export const uneExtraction = (parametres: Parametres) =>
  new ExtractionMAC(parametres);
