import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal } from './Publication';

export const diagnosticTermnine = (entrepot: EntrepotEvenementJournal) => {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      entrepot.persiste({
        identifiant: crypto.randomUUID(),
        date: evenement.date,
        type: evenement.type,
        donnees: evenement.corps,
      });

      return Promise.resolve(undefined);
    }
  })();
};

export const diagnosticLance = () => {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      console.log(`${evenement.type} :`, evenement);
      return Promise.resolve(undefined);
    }
  })();
};

export const reponseAjoutee = () =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      console.log(`${evenement.type} :`, evenement);
      return Promise.resolve(undefined);
    }
  })();
