import { EntrepotDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  DemandeDevenirAidant,
  DemandesDevenirAidant,
  unServiceDemandesDevenirAidant,
} from '../../gestion-demandes/devenir-aidant/ServiceDemandeDevenirAidant';
import { EntrepotDemandeAideLecture } from '../../gestion-demandes/aide/DemandeAide';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { EntrepotStatistiquesAidant } from '../../statistiques/aidant/StastistiquesAidant';
import { EntrepotStatistiquesUtilisateurInscrit } from '../../statistiques/utilisateur-inscrit/StatistiquesUtilisateurInscrit';

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

export type StatistiquesAidant = {
  email: string;
  nomPrenom: string;
  nombreDiagnostics: number;
  departements: string;
  entiteMorale: string;
};
export type ListeDesAidants = StatistiquesAidant[];
type RepresentationStatistiquesAidant = RepresentationRapport<
  ListeDesAidants,
  StatistiquesAidant
>;

type RepresentationStatistiquesUtilisateurInscrit = RepresentationRapport<
  ListeDesUtilisateursInscrits,
  StatistiquesUtilisateurInscrit
>;

export type StatistiquesUtilisateurInscrit = {
  nomPrenom: string;
  email: string;
  nombreDiagnostics: number;
};
export type ListeDesUtilisateursInscrits = StatistiquesUtilisateurInscrit[];

class ExtractionMAC implements Extraction {
  constructor(private readonly parametres: Parametres) {}

  async extrais<T>(rapport: Rapport<T>): Promise<T> {
    const demandesEnCours = unServiceDemandesDevenirAidant(
      this.parametres.entrepotDemandes
    ).demandesEnCours();
    const demandesDevenirAidant = this.ajouteLesDemandesDevenirAidant(
      demandesEnCours,
      rapport
    );
    const demandesAvantArbitrage = this.ajouteLesDemandesAvantArbitrage(
      demandesEnCours,
      rapport
    );
    const demandesAide = this.ajouteLesDemandesAide(rapport);
    const listeDesAidants = this.ajouteLaListeDesAidants(rapport);
    const listeDesUtilisateursInscrits =
      this.ajouteLaListeDesUtilisateursInscrits(rapport);
    return Promise.all([
      demandesDevenirAidant,
      demandesAvantArbitrage,
      demandesAide,
      listeDesAidants,
      listeDesUtilisateursInscrits,
    ])
      .then(() => rapport.genere())
      .catch((erreur) => Promise.reject(erreur));
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
            { entete: 'Email', clef: 'email' },
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
            { entete: 'Email', clef: 'email' },
            { entete: 'Date de la demande', clef: 'dateDemande' },
            { entete: 'Département', clef: 'departement' },
          ],
          intitule: 'Demandes avant arbitrage',
          valeur: demandes,
        });
      });
  }

  private async ajouteLesDemandesAide<T>(rapport: Rapport<T>) {
    await this.parametres.entrepotDemandesAide.tous().then((demandes) =>
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

  private async ajouteLaListeDesAidants<T>(rapport: Rapport<T>) {
    await this.parametres.entrepotStatistiquesAidant
      .rechercheAidantAvecNombreDeDiagnostics()
      .then((statistiques) =>
        rapport.ajoute<ListeDesAidants, RepresentationStatistiquesAidant>({
          entetes: [
            { entete: 'Nom Prénom', clef: 'nomPrenom' },
            { entete: 'Département', clef: 'departements' },
            { entete: 'Mail', clef: 'email' },
            { entete: 'Entité Morale', clef: 'entiteMorale' },
            {
              entete: 'Nombre de diagnostics effectués',
              clef: 'nombreDiagnostics',
            },
          ],
          intitule: 'Liste des Aidants',
          valeur: statistiques.map((stat) => ({
            email: stat.email,
            nomPrenom: stat.nomPrenom,
            nombreDiagnostics: stat.nombreDiagnostics || 0,
            entiteMorale: stat.entite,
            departements: stat.departements.map((d) => d.nom).join(','),
          })),
        })
      );
  }

  private async ajouteLaListeDesUtilisateursInscrits<T>(rapport: Rapport<T>) {
    await this.parametres.entrepotStatistiquesUtilisateurInscrit
      .rechercheUtilisateursInscritsAvecNombreDeDiagnostics()
      .then((statistiques) =>
        rapport.ajoute<
          ListeDesUtilisateursInscrits,
          RepresentationStatistiquesUtilisateurInscrit
        >({
          entetes: [
            { entete: 'Nom Prénom', clef: 'nomPrenom' },
            { entete: 'Mail', clef: 'email' },
            {
              entete: 'Nombre de diagnostics effectués',
              clef: 'nombreDiagnostics',
            },
          ],
          intitule: 'Liste des Utilisateurs Inscrits',
          valeur: statistiques.map((stat) => ({
            nomPrenom: stat.nomPrenom,
            email: stat.email,
            nombreDiagnostics: stat.nombreDiagnostics,
          })),
        })
      );
  }
}

type Parametres = {
  entrepotDemandes: EntrepotDemandeDevenirAidant;
  entrepotDemandesAide: EntrepotDemandeAideLecture;
  entrepotStatistiquesAidant: EntrepotStatistiquesAidant;
  entrepotStatistiquesUtilisateurInscrit: EntrepotStatistiquesUtilisateurInscrit;
};

export const uneExtraction = (parametres: Parametres) =>
  new ExtractionMAC(parametres);
