import { describe, expect, it } from 'vitest';
import {
  etapeChargee,
  etapeSuivanteCliquee,
  EtatBouton,
  reducteurThematiqueSuivante,
} from '../../../src/composants/diagnostic/reducteurThematiqueSuivante';

describe('Réducteur bouton thématique suivante', () => {
  describe('Lors du chargement', () => {
    const etatBoutonInitial: EtatBouton = {
      derniereThematique: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick: (_thematique: string) => {},
      thematiques: [],
      thematiqueCourante: '',
    };

    it("devrait avoir la thématique courante 'premiere-thematique' ainsi que la liste des thématiques", () => {
      const etatBouton = reducteurThematiqueSuivante(
        etatBoutonInitial,
        etapeChargee('premiere-thematique', [
          'premiere-thematique',
          'derniere-thematique',
        ]),
      );

      expect(etatBouton.thematiqueCourante).toBe('premiere-thematique');
      expect(etatBouton.thematiques).toStrictEqual([
        'premiere-thematique',
        'derniere-thematique',
      ]);
      expect(etatBouton.derniereThematique).to.be.false;
    });

    it('devrait être la dernière thématique', () => {
      const etatBouton = reducteurThematiqueSuivante(
        etatBoutonInitial,
        etapeChargee('derniere-thematique', [
          'premiere-thematique',
          'derniere-thematique',
        ]),
      );

      expect(etatBouton.derniereThematique).to.be.true;
      expect(etatBouton.thematiqueCourante).toBe('derniere-thematique');
    });
  });

  describe('Lors du passage à la thématique suivante', () => {
    let thematiqueChoisie: string;
    const etatBoutonInitial: EtatBouton = {
      derniereThematique: false,
      onClick: (thematique: string) => (thematiqueChoisie = thematique),
      thematiques: [
        'premiere-thematique',
        'deuxieme-thematique',
        'derniere-thematique',
      ],
      thematiqueCourante: 'premiere-thematique',
    };

    it("la thématique choisie devrait être 'deuxieme-thematique'", () => {
      reducteurThematiqueSuivante(etatBoutonInitial, etapeSuivanteCliquee());

      expect(thematiqueChoisie).toBe('deuxieme-thematique');
    });

    it('ne passe pas à la thématique suivante lorsque la dernière thématique est atteinte', () => {
      const etatBouton = reducteurThematiqueSuivante(
        {
          ...etatBoutonInitial,
          thematiqueCourante: 'derniere-thematique',
        },
        etapeSuivanteCliquee(),
      );

      expect(etatBouton.derniereThematique).to.be.true;
      expect(etatBouton.thematiqueCourante).toBe('derniere-thematique');
      expect(thematiqueChoisie).toBe('derniere-thematique');
    });
  });
});
