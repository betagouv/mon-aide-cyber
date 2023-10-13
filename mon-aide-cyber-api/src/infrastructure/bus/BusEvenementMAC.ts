import {
  BusEvenement,
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from '../../domaine/BusEvenement';

export class BusEvenementMAC implements BusEvenement {
  constructor(
    private readonly consomateurs: Map<TypeEvenement, ConsommateurEvenement>,
  ) {}

  publie<E extends Evenement>(evenement: E): Promise<void> {
    this.consomateurs.get(evenement.type)?.consomme(evenement);
    return Promise.resolve(undefined);
  }
}
