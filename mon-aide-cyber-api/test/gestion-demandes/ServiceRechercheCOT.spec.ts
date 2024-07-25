import { listeDepartements } from '../../src/infrastructure/departements/listeDepartements/listeDepartements';
import { ServiceRechercheCOT } from '../../src/gestion-demandes/ServiceRechercheCOT';

describe('Service de recherche COT', () => {
  describe('Trouve un mail de COT pour chacun des départements', () => {
    it.each(listeDepartements)('$nom', (departement) => {
      expect(
        new ServiceRechercheCOT().chercheMailParDepartement(departement.nom)
      ).toBeDefined();
    });
  });

  it("Retourne 'undefined' lorsque le mail du COT n'est pas trouvé", () => {
    expect(
      new ServiceRechercheCOT().chercheMailParDepartement(
        'département-introuvable'
      )
    ).toBeUndefined();
  });
});
