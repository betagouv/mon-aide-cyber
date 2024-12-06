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
  public evenementConsomme?: Evenement<unknown> = undefined;
  consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
    this.evenementConsomme = evenement;
    return Promise.resolve(undefined);
  }
}

export class BusEvenementDeTest extends BusEvenementMAC {
  public evenementRecu: Evenement<unknown> | undefined;
  public consommateursTestes: Map<
    TypeEvenement,
    ConsommateurEvenementDeTest[]
  > = new Map();
  private _genereErreur = false;

  constructor(
    public readonly configuration: {
      adaptateurRelations?: AdaptateurRelations;
      entrepotJournalisation?: EntrepotEvenementJournal;
    } = {
      adaptateurRelations: new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      ),
      entrepotJournalisation: new EntrepotEvenementJournalMemoire(),
    },
    consomme: TypeEvenement[] = []
  ) {
    const consommateursEvenements = fabriqueConsommateursEvenements(
      configuration.adaptateurRelations,
      configuration.entrepotJournalisation
    );
    for (const [clef, evenements] of consommateursEvenements.entries()) {
      if (!consomme.includes(clef)) {
        consommateursEvenements.set(
          clef,
          evenements.map(() => new ConsommateurEvenementDeTest())
        );
      }
    }
    super(consommateursEvenements);
    this.consommateursTestes = consommateursEvenements;
  }

  publie(evenement: Evenement<unknown>): Promise<void> {
    if (this._genereErreur) {
      return Promise.reject();
    }
    this.evenementRecu = evenement;
    return super.publie(evenement);
  }
}
