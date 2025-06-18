import { describe, expect, it } from 'vitest';
import { fabriqueConsommateursEvenements } from '../../src/adaptateurs/fabriqueConsommateursEvenements';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import { EntrepotEvenementJournalMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';

describe('La fabrique consommateurs d‘événements', () => {
  it("Consomme l'événément REPONSE_TALLY_RECUE", async () => {
    const entrepotEvenementJournalMemoire =
      new EntrepotEvenementJournalMemoire();
    const fabriqueConsommateurs = fabriqueConsommateursEvenements(
      new AdaptateurRelationsMAC(new EntrepotRelationMemoire()),
      entrepotEvenementJournalMemoire
    );

    await fabriqueConsommateurs.get('REPONSE_TALLY_RECUE')?.[0].consomme({
      corps: {},
      date: FournisseurHorloge.maintenant(),
      identifiant: crypto.randomUUID(),
      type: 'REPONSE_TALLY_RECUE',
    });

    expect(await entrepotEvenementJournalMemoire.tous()).toHaveLength(1);
  });
});
