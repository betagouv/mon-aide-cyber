import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal, Publication } from './Publication';

const consommateurEvenement = () => (entrepot: EntrepotEvenementJournal) =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
      return entrepot.persiste(genereEvenement(evenement));
    }
  })();

export const restitutionLancee = consommateurEvenement();

export const diagnosticLance = consommateurEvenement();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

export const aideCree = consommateurEvenement();

export const demandeDevenirAidantCree = consommateurEvenement();

export const mailCreationCompteAidantEnvoye = consommateurEvenement();

export const mailCreationCompteAidantNonEnvoye = consommateurEvenement();

export const demandeDevenirAidantespaceAidantCree = consommateurEvenement();

export const preferencesAidantModifiees = consommateurEvenement();

export const profilAidantModifie = consommateurEvenement();

const genereEvenement = <E extends Evenement<unknown>>(
  evenement: E
): Publication => {
  return {
    date: evenement.date,
    donnees: evenement.corps as object,
    identifiant: crypto.randomUUID(),
    type: evenement.type,
  };
};
