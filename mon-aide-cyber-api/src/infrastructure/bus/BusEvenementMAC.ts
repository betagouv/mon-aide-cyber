import {
  BusEvenement,
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from '../../domaine/BusEvenement';

export class BusEvenementMAC implements BusEvenement {
  constructor(
    private readonly consomateurs: Map<TypeEvenement, ConsommateurEvenement[]>,
  ) {}

  async publie<E extends Evenement>(evenement: E): Promise<void> {
    const consommateurEvenements = this.consomateurs.get(evenement.type);
    if (consommateurEvenements) {
      for (const consommateurEvenement of consommateurEvenements) {
        await consommateurEvenement.consomme(evenement);
      }
    }
  }
}
