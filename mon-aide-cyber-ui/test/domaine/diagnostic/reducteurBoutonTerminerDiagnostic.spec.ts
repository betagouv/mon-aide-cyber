import { describe, expect, it } from 'vitest';
import {
  EtatBoutonTerminerDiagnostic,
  reducteurBoutonTerminerDiagnostic,
  thematiqueChargee,
} from '../../../src/composants/diagnostic/reducteurBoutonTerminerDiagnostic.ts';

describe('Réducteur bouton terminer le diagnostic', () => {
  describe('Lors du chargement', () => {
    const etatBoutonInitial: EtatBoutonTerminerDiagnostic = {
      derniereThematique: false,
      thematiques: [],
    };

    it('ne devrait pas être sur la dernière thématique', () => {
      const etatBouton = reducteurBoutonTerminerDiagnostic(
        etatBoutonInitial,
        thematiqueChargee('premiere-thematique', [
          'premiere-thematique',
          'derniere-thematique',
        ])
      );

      expect(etatBouton.thematiques).toStrictEqual([
        'premiere-thematique',
        'derniere-thematique',
      ]);
      expect(etatBouton.derniereThematique).to.be.false;
    });

    it('devrait être sur la dernière thématique', () => {
      const etatBouton = reducteurBoutonTerminerDiagnostic(
        etatBoutonInitial,
        thematiqueChargee('derniere-thematique', [
          'premiere-thematique',
          'derniere-thematique',
        ])
      );

      expect(etatBouton.derniereThematique).to.be.true;
    });
  });
});
