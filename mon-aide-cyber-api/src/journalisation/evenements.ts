import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal } from './Publication';

const consommateurEvenement = () => (entrepot: EntrepotEvenementJournal) =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      return entrepot.persiste(genereEvenement(evenement));
    }
  })();

export const restitutionLancee = consommateurEvenement();

export const diagnosticLance = consommateurEvenement();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

const genereEvenement = <E extends Evenement>(evenement: E) => {
  return {
    date: evenement.date,
    donnees: evenement.corps,
    identifiant: crypto.randomUUID(),
    type: evenement.type,
  };
};
