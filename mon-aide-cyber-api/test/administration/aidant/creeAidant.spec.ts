import { describe, it, expect } from 'vitest';
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
  it('la date de signature des CGU est prise en compte', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCGU = new Date(Date.parse('2023-11-10T15:45:00+01:00'));

    await creeAidant(entrepotAidant, busEvenement, {
      identifiantConnexion: 'jean.dupont@beta.fr',
      motDePasse: 'mdp',
      nomPrenom: 'jean Dupont',
      dateSignatureCGU,
      dateSignatureCharte: new Date(),
    });

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@beta.fr',
        'mdp',
      );
    expect(aidant.dateSignatureCGU).toStrictEqual(dateSignatureCGU);
  });

  it('la date de signature de la charte est prise en compte', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCharte = new Date(
      Date.parse('2023-11-10T15:45:00+01:00'),
    );

    await creeAidant(entrepotAidant, busEvenement, {
      identifiantConnexion: 'jean.dupont@beta.fr',
      motDePasse: 'mdp',
      nomPrenom: 'jean Dupont',
      dateSignatureCGU: new Date(),
      dateSignatureCharte: dateSignatureCharte,
    });

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@beta.fr',
        'mdp',
      );
    expect(aidant.dateSignatureCharte).toStrictEqual(dateSignatureCharte);
  });

  it("l'événement aidantCréé est envoyé", async () => {
    FournisseurHorlogeDeTest.initialise(new Date(2024, 2, 4));
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCharte = new Date(
      Date.parse('2023-11-10T15:45:00+01:00'),
    );

    await creeAidant(entrepotAidant, busEvenement, {
      identifiantConnexion: 'jean.dupont@beta.fr',
      motDePasse: 'mdp',
      nomPrenom: 'jean Dupont',
      dateSignatureCGU: new Date(),
      dateSignatureCharte: dateSignatureCharte,
    });

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@beta.fr',
        'mdp',
      );
    expect(
      busEvenement.consommateurs.get('AIDANT_CREE')?.evenementConsomme,
    ).toMatchObject({
      type: 'AIDANT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: { identifiant: aidant.identifiant },
      identifiant: aidant.identifiant,
    });
  });
});
