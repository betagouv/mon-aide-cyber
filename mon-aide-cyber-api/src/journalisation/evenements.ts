import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal } from './Publication';

export const diagnosticTermnine = (entrepot: EntrepotEvenementJournal) => {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      entrepot.persiste(genereEvenement(evenement));

      return Promise.resolve(undefined);
    }
  })();
};

export const diagnosticLance = (entrepot: EntrepotEvenementJournal) => {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      entrepot.persiste(genereEvenement(evenement));
      return Promise.resolve(undefined);
    }
  })();
};

export const reponseAjoutee = (entrepot: EntrepotEvenementJournal) =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      entrepot.persiste(genereEvenement(evenement));
      return Promise.resolve(undefined);
    }
  })();

const genereEvenement = <E extends Evenement>(evenement: E) => {
  return {
    date: evenement.date,
    donnees: evenement.corps,
    identifiant: crypto.randomUUID(),
    type: evenement.type,
  };
};
