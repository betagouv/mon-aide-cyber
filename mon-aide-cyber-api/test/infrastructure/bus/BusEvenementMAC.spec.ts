import { describe, expect, it } from 'vitest';
import {
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from '../../../src/domaine/BusEvenement';
import { BusEvenementMAC } from '../../../src/infrastructure/bus/BusEvenementMAC';
import { FournisseurHorlogeDeTest } from '../horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';

class ConsommateurEvenementDeTest implements ConsommateurEvenement {
  consommation?: Evenement<unknown>;
  nombreConsommation = 0;
  consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
    this.consommation = evenement;
    this.nombreConsommation++;
    return Promise.resolve(undefined);
  }
}

describe('Bus Événement', () => {
  it("Lorsque l'on publie un événement, il est consommé ", async () => {
    const identifiant = crypto.randomUUID();
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);
    const consommateur = new ConsommateurEvenementDeTest();

    await new BusEvenementMAC(
      new Map<TypeEvenement, ConsommateurEvenement[]>([
        ['DIAGNOSTIC_LANCE', [consommateur]],
      ])
    ).publie({
      identifiant,
      type: 'DIAGNOSTIC_LANCE',
      date: maintenant,
      corps: {},
    });

    expect(consommateur.consommation).toStrictEqual<Evenement<unknown>>({
      identifiant,
      type: 'DIAGNOSTIC_LANCE',
      date: maintenant,
      corps: {},
    });
    expect(consommateur.nombreConsommation).toBe(1);
  });

  it("Lorsque l'on publie un événement, il est consommé uniquement par son consommateur", async () => {
    const identifiant = crypto.randomUUID();
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);
    const premierConsommateur = new ConsommateurEvenementDeTest();
    const secondConsommateur = new ConsommateurEvenementDeTest();

    await new BusEvenementMAC(
      new Map<TypeEvenement, ConsommateurEvenement[]>([
        ['DIAGNOSTIC_LANCE', [premierConsommateur]],
        ['RESTITUTION_LANCEE', [secondConsommateur]],
      ])
    ).publie({
      identifiant,
      type: 'RESTITUTION_LANCEE',
      date: maintenant,
      corps: {},
    });

    expect(premierConsommateur.nombreConsommation).toBe(0);
    expect(secondConsommateur.nombreConsommation).toBe(1);
    expect(secondConsommateur.consommation).toStrictEqual<Evenement<object>>({
      identifiant,
      type: 'RESTITUTION_LANCEE',
      date: maintenant,
      corps: {},
    });
  });
});
