import { BusEvenement, Evenement } from '../../../src/domaine/BusEvenement';

export class BusEvenementDeTest implements BusEvenement {
  public evenementRecu: Evenement | undefined;

  publie(evenement: Evenement): Promise<void> {
    this.evenementRecu = evenement;
    return Promise.resolve(undefined);
  }
}
