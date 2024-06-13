import { describe, expect, it } from 'vitest';
import {
  thematiqueChargee,
  boutonThematiqueCliquee,
  EtatBouton,
  reducteurBoutonThematiqueSuivante,
  reducteurBoutonThematiquePrecedente,
} from '../../../src/composants/diagnostic/reducteurBoutonThematique';

describe('Réducteur bouton thématique', () => {
  describe('suivante', () => {
    describe('Lors du chargement', () => {
      const etatBoutonInitial: EtatBouton = {
        borneThematique: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick: (_thematique: string) => {},
        thematiques: [],
        thematiqueCourante: '',
      };

      it("devrait avoir la thématique courante 'premiere-thematique' ainsi que la liste des thématiques", () => {
        const etatBouton = reducteurBoutonThematiqueSuivante(
          etatBoutonInitial,
          thematiqueChargee('premiere-thematique', [
            'premiere-thematique',
            'derniere-thematique',
          ])
        );

        expect(etatBouton.thematiqueCourante).toBe('premiere-thematique');
        expect(etatBouton.thematiques).toStrictEqual([
          'premiere-thematique',
          'derniere-thematique',
        ]);
        expect(etatBouton.borneThematique).to.be.false;
      });

      it('devrait être la dernière thématique', () => {
        const etatBouton = reducteurBoutonThematiqueSuivante(
          etatBoutonInitial,
          thematiqueChargee('derniere-thematique', [
            'premiere-thematique',
            'derniere-thematique',
          ])
        );

        expect(etatBouton.borneThematique).to.be.true;
        expect(etatBouton.thematiqueCourante).toBe('derniere-thematique');
      });
    });

    describe('Lors du passage à la thématique suivante', () => {
      let thematiqueChoisie: string;
      const etatBoutonInitial: EtatBouton = {
        borneThematique: false,
        onClick: (thematique: string) => (thematiqueChoisie = thematique),
        thematiques: [
          'premiere-thematique',
          'deuxieme-thematique',
          'derniere-thematique',
        ],
        thematiqueCourante: 'premiere-thematique',
      };

      it("la thématique choisie devrait être 'deuxieme-thematique'", () => {
        reducteurBoutonThematiqueSuivante(
          etatBoutonInitial,
          boutonThematiqueCliquee()
        );

        expect(thematiqueChoisie).toBe('deuxieme-thematique');
      });

      it('ne passe pas à la thématique suivante lorsque la dernière thématique est atteinte', () => {
        const etatBouton = reducteurBoutonThematiqueSuivante(
          {
            ...etatBoutonInitial,
            thematiqueCourante: 'derniere-thematique',
          },
          boutonThematiqueCliquee()
        );

        expect(etatBouton.borneThematique).to.be.true;
        expect(etatBouton.thematiqueCourante).toBe('derniere-thematique');
        expect(thematiqueChoisie).toBe('derniere-thematique');
      });
    });
  });

  describe('précédente', () => {
    describe('Lors du chargement', () => {
      const etatBoutonInitial: EtatBouton = {
        borneThematique: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick: (_thematique: string) => {},
        thematiques: [],
        thematiqueCourante: '',
      };

      it("devrait avoir la thématique courante 'deuxieme-thematique' ainsi que la liste des thématiques", () => {
        const etatBouton = reducteurBoutonThematiquePrecedente(
          etatBoutonInitial,
          thematiqueChargee('deuxieme-thematique', [
            'premiere-thematique',
            'deuxieme-thematique',
          ])
        );

        expect(etatBouton.thematiqueCourante).toBe('deuxieme-thematique');
        expect(etatBouton.thematiques).toStrictEqual([
          'premiere-thematique',
          'deuxieme-thematique',
        ]);
        expect(etatBouton.borneThematique).to.be.false;
      });

      it('devrait être la première thématique', () => {
        const etatBouton = reducteurBoutonThematiquePrecedente(
          etatBoutonInitial,
          thematiqueChargee('premiere-thematique', [
            'premiere-thematique',
            'deuxieme-thematique',
          ])
        );

        expect(etatBouton.borneThematique).to.be.true;
        expect(etatBouton.thematiqueCourante).toBe('premiere-thematique');
      });
    });

    describe('Lors du passage à la thématique précédente', () => {
      let thematiqueChoisie: string;
      const etatBoutonInitial: EtatBouton = {
        borneThematique: false,
        onClick: (thematique: string) => (thematiqueChoisie = thematique),
        thematiques: [
          'premiere-thematique',
          'deuxieme-thematique',
          'trousieme-thematique',
        ],
        thematiqueCourante: 'deuxieme-thematique',
      };

      it('la thématique choisie devrait être premiere-thematique', () => {
        reducteurBoutonThematiquePrecedente(
          etatBoutonInitial,
          boutonThematiqueCliquee()
        );

        expect(thematiqueChoisie).toBe('premiere-thematique');
      });

      it('ne passe pas à la thématique précédente lorsque la première thématique est atteinte', () => {
        const etatBouton = reducteurBoutonThematiquePrecedente(
          {
            ...etatBoutonInitial,
            thematiqueCourante: 'premiere-thematique',
          },
          boutonThematiqueCliquee()
        );

        expect(etatBouton.borneThematique).to.be.true;
        expect(etatBouton.thematiqueCourante).toBe('premiere-thematique');
        expect(thematiqueChoisie).toBe('premiere-thematique');
      });
    });
  });
});
