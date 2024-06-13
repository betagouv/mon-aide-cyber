import {
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from '../../../src/domaine/BusEvenement';
import { BusEvenementMAC } from '../../../src/infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../src/adaptateurs/fabriqueConsommateursEvenements';
import { EntrepotEvenementJournalMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { AdaptateurRelations } from '../../../src/relation/AdaptateurRelations';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { EntrepotEvenementJournal } from '../../../src/journalisation/Publication';

class ConsommateurEvenementDeTest implements ConsommateurEvenement {
  public evenementConsomme?: Evenement = undefined;
  consomme<E extends Evenement>(evenement: E): Promise<void> {
    this.evenementConsomme = evenement;
    return Promise.resolve(undefined);
  }
}

export class BusEvenementDeTest extends BusEvenementMAC {
  public evenementRecu: Evenement | undefined;
  public consommateurs: Map<TypeEvenement, ConsommateurEvenementDeTest> =
    new Map();

  constructor(
    public readonly configuration: {
      adaptateurRelations?: AdaptateurRelations;
      entrepotJournalisation?: EntrepotEvenementJournal;
    } = {
      adaptateurRelations: new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      ),
      entrepotJournalisation: new EntrepotEvenementJournalMemoire(),
    }
  ) {
    const consommateurAidantCree = new ConsommateurEvenementDeTest();
    const consommateurAideCree = new ConsommateurEvenementDeTest();
    const consommateursEvenements = fabriqueConsommateursEvenements(
      configuration.adaptateurRelations,
      configuration.entrepotJournalisation,
      {
        aidantCree: () => consommateurAidantCree,
        aideCree: () => consommateurAideCree,
      }
    );
    super(consommateursEvenements);
    this.consommateurs.set('AIDANT_CREE', consommateurAidantCree);
  }

  publie(evenement: Evenement): Promise<void> {
    this.evenementRecu = evenement;
    return super.publie(evenement);
  }
}
