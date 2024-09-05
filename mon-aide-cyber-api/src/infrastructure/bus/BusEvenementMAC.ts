import {
  BusEvenement,
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from '../../domaine/BusEvenement';

export class BusEvenementMAC implements BusEvenement {
  constructor(
    private readonly consommateurs: Map<TypeEvenement, ConsommateurEvenement[]>
  ) {}

  async publie<E extends Evenement<unknown>>(evenement: E): Promise<void> {
    const consommateurEvenements = this.consommateurs.get(evenement.type);
    if (consommateurEvenements) {
      const consommations = consommateurEvenements.map((consommateur) =>
        consommateur.consomme(evenement)
      );
      await Promise.all(consommations);
    }
  }
}
