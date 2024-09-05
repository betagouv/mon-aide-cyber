import { describe, expect, it } from 'vitest';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { creeAidant } from '../../../src/administration/aidant/creeAidant';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Crée un aidant', () => {
  let busEvenement: BusEvenementDeTest;

  beforeEach(() => {
    busEvenement = new BusEvenementDeTest();
  });

  it("l'événement aidantCréé est envoyé", async () => {
    FournisseurHorlogeDeTest.initialise(new Date(2024, 2, 4));
    const entrepotAidant = new EntrepotAidantMemoire();

    await creeAidant(entrepotAidant, busEvenement, {
      identifiantConnexion: 'jean.dupont@beta.fr',
      motDePasse: 'mdp',
      nomPrenom: 'jean Dupont',
    });

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@beta.fr',
        'mdp'
      );
    expect(
      busEvenement.consommateursTestes.get('AIDANT_CREE')?.[0].evenementConsomme
    ).toMatchObject({
      type: 'AIDANT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: { identifiant: aidant.identifiant },
      identifiant: aidant.identifiant,
    });
  });
});
