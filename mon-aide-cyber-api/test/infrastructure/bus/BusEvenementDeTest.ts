import { ConsommateurEvenement, Evenement, TypeEvenement } from '../../../src/domaine/BusEvenement';
import { BusEvenementMAC } from '../../../src/infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../src/adaptateurs/fabriqueConsommateursEvenements';
import { EntrepotEvenementJournalMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

class ConsommateurEvenementDeTest implements ConsommateurEvenement {
  public evenementConsomme?: Evenement = undefined;
  consomme<E extends Evenement>(evenement: E): Promise<void> {
    this.evenementConsomme = evenement;
    return Promise.resolve(undefined);
  }
}

export class BusEvenementDeTest extends BusEvenementMAC {
  public evenementRecu: Evenement | undefined;
  public consommateurs: Map<TypeEvenement, ConsommateurEvenementDeTest> = new Map();

  constructor(
    public readonly entrepotJournalisation: EntrepotEvenementJournalMemoire = new EntrepotEvenementJournalMemoire(),
  ) {
    const consommateurAidantCree = new ConsommateurEvenementDeTest();
    const consommateursEvenements = fabriqueConsommateursEvenements(entrepotJournalisation, {
      aidantCree: () => consommateurAidantCree,
    });
    super(consommateursEvenements);
    this.consommateurs.set('AIDANT_CREE', consommateurAidantCree);
  }

  publie(evenement: Evenement): Promise<void> {
    this.evenementRecu = evenement;
    return super.publie(evenement);
  }
}
