import { GestionnaireDeJetonJWT } from '../../../src/infrastructure/authentification/GestionnaireDeJetonJWT';

describe('Gestionnaire de jeton JWT', () => {
  describe('verifie', () => {
    it('ne lève pas erreur quand la vérification réussie', () => {
      const gestionnaireDeJetonJWT = new GestionnaireDeJetonJWT('une-clef');

      expect(() =>
        gestionnaireDeJetonJWT.verifie(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb25uZWUiOiJkZSBsJ2Ftb3VyIn0.BRztkwPxRPU8LdU9Psw_5M76DsbSoPAsPqSDWdLVkHw',
        ),
      ).not.toThrow();
    });

    it('lève une erreur quand la vérification échoue', () => {
      const gestionnaireDeJetonJWT = new GestionnaireDeJetonJWT('une-clef');

      expect(() =>
        gestionnaireDeJetonJWT.verifie('un-mauvais-jeton'),
      ).toThrow();
    });
  });
});
