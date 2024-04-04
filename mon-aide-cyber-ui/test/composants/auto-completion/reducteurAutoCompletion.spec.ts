import { describe, expect, it } from 'vitest';
import {
  EtatAutoCompletion,
  initialiseEtatAutoCompletion,
  optionChoisie,
  reducteurAutoCompletion,
  toucheClavierAppuyee,
  valeursChargees,
  valeurSaisie,
} from '../../../src/composants/auto-completion/reducteurAutoCompletion.ts';

describe('Réducteur Auto complétion', () => {
  const etatInitial = initialiseEtatAutoCompletion('auto-complétion');

  it('Initialise l’état', () => {
    const etat = initialiseEtatAutoCompletion('auto-complétion');

    expect(etat).toStrictEqual<EtatAutoCompletion>({
      nom: 'auto-complétion',
      valeurs: [],
      valeursFiltrees: [],
      visibilite: 'invisible',
    });
  });

  it('Valide l’option choisie', () => {
    let appelRecu = '';
    const etat = reducteurAutoCompletion(
      { ...etatInitial, valeurs: ['1', '2', '3'], visibilite: 'visible' },
      optionChoisie('2', (valeur) => (appelRecu = valeur)),
    );

    expect(etat).toStrictEqual<EtatAutoCompletion>({
      nom: 'auto-complétion',
      valeurs: ['1', '2', '3'],
      valeursFiltrees: [],
      visibilite: 'invisible',
    });
    expect(appelRecu).toStrictEqual('2');
  });

  describe('Lorsque l’on utilise le clavier', () => {
    it('La touche tab vide les valeurs', () => {
      const etat = reducteurAutoCompletion(
        { ...etatInitial, valeurs: ['1', '2', '3'], visibilite: 'visible' },
        toucheClavierAppuyee('Tab'),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: [],
        valeursFiltrees: [],
        visibilite: 'invisible',
      });
    });
  });

  describe('Avec des valeurs sous forme de chaine de caractère', () => {
    it('Charge les valeurs sans valeur par défaut', () => {
      const etat = reducteurAutoCompletion(
        etatInitial,
        valeursChargees({ valeurs: ['1', '2', '3'] }),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: ['1', '2', '3'],
        valeursFiltrees: ['1', '2', '3'],
        visibilite: 'invisible',
      });
    });

    it('filtre les valeurs', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion(
        { ...etatInitial, valeurs: ['1', '13', '2', '3', '33'] },
        valeurSaisie('3', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: ['1', '13', '2', '3', '33'],
        valeursFiltrees: ['13', '3', '33'],
        visibilite: 'visible',
      });
      expect(appelRecu).toStrictEqual('3');
    });

    it('filtre les valeurs en étant insensible à la casse', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion(
        { ...etatInitial, valeurs: ['A', 'B', 'aC', 'D', 'Ea'] },
        valeurSaisie('a', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: ['A', 'B', 'aC', 'D', 'Ea'],
        valeursFiltrees: ['A', 'aC', 'Ea'],
        visibilite: 'visible',
      });
      expect(appelRecu).toStrictEqual('a');
    });
  });

  describe('Avec des valeurs sous forme d’objet', () => {
    it('Charge les valeurs', () => {
      const etat = reducteurAutoCompletion(
        etatInitial,
        valeursChargees({ valeurs: [{ a: '1' }, { b: '2' }, { c: '3' }] }),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: [{ a: '1' }, { b: '2' }, { c: '3' }],
        valeursFiltrees: [{ a: '1' }, { b: '2' }, { c: '3' }],
        visibilite: 'invisible',
      });
    });

    it('filtre les valeurs sur tous les champs de l’objet', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion(
        {
          ...etatInitial,
          valeurs: [
            { a: '1', b: '2', c: '3' },
            { a: '1', b: '23', c: '3' },
            { a: '1', b: '2', c: '4' },
          ],
        },
        valeurSaisie('3', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: [
          { a: '1', b: '2', c: '3' },
          { a: '1', b: '23', c: '3' },
          { a: '1', b: '2', c: '4' },
        ],
        valeursFiltrees: [
          { a: '1', b: '2', c: '3' },
          { a: '1', b: '23', c: '3' },
        ],
        visibilite: 'visible',
      });
      expect(appelRecu).toStrictEqual('3');
    });

    it('filtre les valeurs sur tous les champs de l’objet en étant insensible à la casse', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion(
        {
          ...etatInitial,
          valeurs: [
            { a: 'A', b: 'B', c: 'aC' },
            { a: 'A', b: 'AB', c: 'AC' },
            { a: 'C', b: 'B', c: 'D' },
          ],
        },
        valeurSaisie('a', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion>({
        nom: 'auto-complétion',
        valeurs: [
          { a: 'A', b: 'B', c: 'aC' },
          { a: 'A', b: 'AB', c: 'AC' },
          { a: 'C', b: 'B', c: 'D' },
        ],
        valeursFiltrees: [
          { a: 'A', b: 'B', c: 'aC' },
          { a: 'A', b: 'AB', c: 'AC' },
        ],
        visibilite: 'visible',
      });
      expect(appelRecu).toStrictEqual('a');
    });
  });
});
