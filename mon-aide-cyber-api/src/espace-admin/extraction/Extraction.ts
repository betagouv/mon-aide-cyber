import { EntrepotDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  DemandeDevenirAidant,
  DemandesDevenirAidant,
  unServiceDemandesDevenirAidant,
} from '../../gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';
import { EntrepotDemandeAideLecture } from '../../gestion-demandes/aide/DemandeAide';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

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

export type DemandeAide = {
  dateDemande: string;
};
export type DemandesAide = DemandeAide[];
type RepresentationDemandeAide = RepresentationRapport<
  DemandesAide,
  DemandeAide
>;

class ExtractionMAC implements Extraction {
  constructor(private readonly parametres: Parametres) {}

  async extrais<T>(rapport: Rapport<T>): Promise<T> {
    const demandesEnCours = unServiceDemandesDevenirAidant(
      this.parametres.entrepotDemandes
    ).demandesEnCours();
    await this.ajouteLesDemandesDevenirAidant(demandesEnCours, rapport);
    await this.ajouteLesDemandesAvantArbitrage(demandesEnCours, rapport);
    await this.ajouteLesDemandesAide(
      this.parametres.entrepotDemandesAide,
      rapport
    );
    return rapport.genere();
  }

  private async ajouteLesDemandesDevenirAidant<T>(
    demandesEnCours: Promise<DemandesDevenirAidant>,
    rapport: Rapport<T>
  ) {
    await demandesEnCours
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
  }

  private async ajouteLesDemandesAvantArbitrage<T>(
    demandesEnCours: Promise<DemandesDevenirAidant>,
    rapport: Rapport<T>
  ) {
    await demandesEnCours
      .then((demandes) =>
        demandes.filter((d) => !d.entiteMorale && !d.enAttenteAdhesion)
      )
      .then((demandes) => {
        rapport.ajoute<DemandesDevenirAidant, RepresentationDemande>({
          entetes: [
            { entete: 'Nom', clef: 'nom' },
            { entete: 'Prénom', clef: 'prenom' },
            { entete: 'Date de la demande', clef: 'dateDemande' },
            { entete: 'Département', clef: 'departement' },
          ],
          intitule: 'Demandes avant arbitrage',
          valeur: demandes,
        });
      });
  }

  private async ajouteLesDemandesAide<T>(
    entrepotDemandesAide: EntrepotDemandeAideLecture,
    rapport: Rapport<T>
  ) {
    await entrepotDemandesAide.tous().then((demandes) =>
      rapport.ajoute<DemandesAide, RepresentationDemandeAide>({
        entetes: [{ entete: 'Date de la demande', clef: 'dateDemande' }],
        intitule: 'Demandes Aide',
        valeur: demandes.map((demande) => ({
          dateDemande: FournisseurHorloge.formateDate(demande.dateSignatureCGU)
            .date,
        })),
      })
    );
  }
}

type Parametres = {
  entrepotDemandes: EntrepotDemandeDevenirAidant;
  entrepotDemandesAide: EntrepotDemandeAideLecture;
};

export const uneExtraction = (parametres: Parametres) =>
  new ExtractionMAC(parametres);
