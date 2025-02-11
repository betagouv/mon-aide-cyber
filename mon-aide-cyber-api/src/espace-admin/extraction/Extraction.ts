import { EntrepotDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  DemandeDevenirAidant,
  DemandesDevenirAidant,
  unServiceDemandesDevenirAidant,
} from '../../gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';

export type Entete<T> = { entete: string; clef: keyof T };

export type RepresentationRapport<T, U> = {
  entetes: Entete<U>[];
  intitule: string;
  valeur: T;
};

export interface Extraction {
  extrais<T>(rapport: Rapport<T>): Promise<T>;
}

export interface Rapport<T> {
  ajoute<
    REPRESENTATION_VALEUR,
    REPRESENTATION_RAPPORT extends RepresentationRapport<
      REPRESENTATION_VALEUR,
      any
    >,
  >(
    representation: REPRESENTATION_RAPPORT
  ): void;

  genere(): Promise<T>;
}

export type RepresentationDemande = RepresentationRapport<
  DemandesDevenirAidant,
  DemandeDevenirAidant
>;

type Parametres = {
  entrepotDemandes: EntrepotDemandeDevenirAidant;
};

class ExtractionMAC implements Extraction {
  constructor(private readonly parametres: Parametres) {}

  async extrais<T>(rapport: Rapport<T>): Promise<T> {
    await unServiceDemandesDevenirAidant(this.parametres.entrepotDemandes)
      .demandesEnCours()
      .then((demandes) =>
        demandes.filter((d) => !!d.entiteMorale || !!d.enAttenteAdhesion)
      )
      .then((demandes) => {
        rapport.ajoute<DemandesDevenirAidant, RepresentationDemande>({
          entetes: [
            { entete: 'Nom', clef: 'nom' },
            { entete: 'Prénom', clef: 'prenom' },
            { entete: 'Date de la demande', clef: 'dateDemande' },
            { entete: 'Département', clef: 'departement' },
            { entete: 'Entité Morale', clef: 'entiteMorale' },
            {
              entete: 'En attente d’adhésion à une Association',
              clef: 'enAttenteAdhesion',
            },
          ],
          intitule: 'Demandes devenir Aidant',
          valeur: demandes,
        });
      });
    return rapport.genere();
  }
}

export const uneExtraction = (parametres: Parametres) =>
  new ExtractionMAC(parametres);
