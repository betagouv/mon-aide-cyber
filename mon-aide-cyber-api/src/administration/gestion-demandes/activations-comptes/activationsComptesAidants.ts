import { Entrepots } from '../../../domaine/Entrepots';
import crypto from 'crypto';
import { BusCommande } from '../../../domaine/commande';

export type AidantCSV = {
  nom: string;
  email: string;
};

export type Aidant = AidantCSV;

export type DemandeIncomplete = Aidant & {
  identificationDemande: crypto.UUID;
};

export type DemandeEnErreur = Aidant & {
  erreur: string;
};

export type ResultatActivationsComptesAidants = {
  activationsComptesAidants: Aidant[];
  demandesIncomplete: DemandeIncomplete[];
  demandesEnErreur: DemandeEnErreur[];
};

const EN_TETES_FICHIER_CSV = ['Nom', 'mail'];

const recupereListeAidants = (aidants: string) => {
  const tableauAidants = aidants.split('\n');
  const entetes = tableauAidants[0].split(';');

  const entetesPresentes = EN_TETES_FICHIER_CSV.every(
    (valeur, index) => valeur === entetes[index]
  );
  if (!entetesPresentes || entetes.length < 2) {
    throw new Error(
      `Le fichier doit contenir les colones suivantes '${EN_TETES_FICHIER_CSV.join(';')}'.`
    );
  }

  if (tableauAidants[tableauAidants.length - 1].trim() === '') {
    return tableauAidants.slice(1, -1);
  }

  return tableauAidants.slice(1);
};

export const activationsComptesAidants = async (
  entrepots: Entrepots,
  busCommande: BusCommande,
  contenuFichier: string
): Promise<ResultatActivationsComptesAidants> => {
  const transcris = (aidant: string[]): AidantCSV | undefined => {
    const identifiant = aidant[1];
    return {
      email: identifiant.toLowerCase().trim(),
      nom: aidant[0].trim(),
    };
  };
  const activationsEspaceAidant: Aidant[] = [];
  const demandesIncomplete: DemandeIncomplete[] = [];
  const demandesEnErreur: DemandeEnErreur[] = [];
  await Promise.all(
    recupereListeAidants(contenuFichier).map(async (aidantCourant) => {
      const aidant = transcris(aidantCourant.split(';'));

      if (aidant) {
        try {
          const demandeEnCours = await entrepots
            .demandesDevenirAidant()
            .rechercheDemandeEnCoursParMail(aidant.email);
          if (demandeEnCours && demandeEnCours.entite) {
            await busCommande.publie({
              type: 'SagaActivationCompteAidant',
              mail: demandeEnCours.mail,
            });
            activationsEspaceAidant.push({
              nom: aidant.nom,
              email: aidant.email,
            });
          } else if (demandeEnCours) {
            demandesIncomplete.push({
              nom: aidant.nom,
              email: aidant.email,
              identificationDemande: demandeEnCours.identifiant,
            });
          }
        } catch (erreur: unknown | Error) {
          demandesEnErreur.push({
            nom: aidant.nom,
            email: aidant.email,
            erreur: (erreur as Error).message,
          });
        }
      }
    })
  );
  return {
    activationsComptesAidants: activationsEspaceAidant,
    demandesIncomplete,
    demandesEnErreur,
  };
};
