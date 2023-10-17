import {
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from "../domaine/BusEvenement";
import crypto from "crypto";
import { EntrepotEvenementJournal } from "./EvenementJournal";

export function diagnosticTermnine(entrepot?: EntrepotEvenementJournal) {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      entrepot?.persiste({
        identifiant: crypto.randomUUID(),
        date: evenement.date,
        type: evenement.type,
        donnees: evenement.corps,
      });

      return Promise.resolve(undefined);
    }
  })();
}

export function diagnosticLance() {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      console.log(`${evenement.type} :`, evenement);
      return Promise.resolve(undefined);
    }
  })();
}

export function reponseAjoutee() {
  return new (class implements ConsommateurEvenement {
    consomme<E extends Evenement>(evenement: E): Promise<void> {
      console.log(`${evenement.type} :`, evenement);
      return Promise.resolve(undefined);
    }
  })();
}

export const consommateursEvenements: Map<
  TypeEvenement,
  ConsommateurEvenement
> = new Map([
  ["DIAGNOSTIC_TERMINE", diagnosticTermnine()],
  ["DIAGNOSTIC_LANCE", diagnosticLance()],
  ["REPONSE_AJOUTEE", reponseAjoutee()],
]);
