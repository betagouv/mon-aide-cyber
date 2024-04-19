import { describe, expect, it } from 'vitest';
import {
  EtatAutoCompletion,
  initialiseEtatAutoCompletion,
  suggestionChoisie,
  reducteurAutoCompletion,
  toucheClavierAppuyee,
  suggestionsInitialesChargees,
  valeurSaisie,
} from '../../../src/composants/auto-completion/reducteurAutoCompletion.ts';

describe('Réducteur Auto complétion', () => {
  const etatInitial = initialiseEtatAutoCompletion<string>()(
    'auto-complétion',
    '',
  );

  it('Initialise l’état', () => {
    const etat = initialiseEtatAutoCompletion<string>()('auto-complétion', '');

    expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
      nom: 'auto-complétion',
      navigationClavierReinitialisee: false,
      valeurSaisie: '',
      suggestionsInitiales: [],
      suggestions: [],
      suggestionsVisibles: 'invisible',
    });
  });

  describe('Lorsque l’on utilise le clavier', () => {
    it('La touche tab vide les suggestions', () => {
      const etat = reducteurAutoCompletion<string>()(
        {
          ...etatInitial,
          suggestionsInitiales: ['1', '2', '3'],
          suggestionsVisibles: 'visible',
        },
        toucheClavierAppuyee('Tab'),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: false,
        valeurSaisie: '',
        suggestionsInitiales: [],
        suggestions: [],
        suggestionsVisibles: 'invisible',
      });
    });

    describe('Navigation clavier avec la flèche bas', () => {
      it('Sélectionne le premier élément', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '2', '3'],
            suggestionsVisibles: 'visible',
          },
          toucheClavierAppuyee('ArrowDown'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '1', index: 0 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '2', '3'],
          suggestions: [],
          suggestionsVisibles: 'visible',
        });
      });

      it('Sélectionne l’élément suivant', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '2', '3'],
            suggestionsVisibles: 'visible',
            elementNavigationCourant: { valeur: '1', index: 0 },
          },
          toucheClavierAppuyee('ArrowDown'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '2', index: 1 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '2', '3'],
          suggestions: [],
          suggestionsVisibles: 'visible',
        });
      });

      it('Sélectionne l’élément suivant en se basant sur les valeurs filtrées', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
            suggestions: ['12', '22', '23'],
            suggestionsVisibles: 'visible',
          },
          toucheClavierAppuyee('ArrowDown'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '12', index: 0 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
          suggestions: ['12', '22', '23'],
          suggestionsVisibles: 'visible',
        });
      });

      it('Se repositionne sur le premier élément si l’utilisateur modifie sa saisie', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            elementNavigationCourant: { valeur: '22', index: 1 },
            suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
            suggestions: ['1', '12', '13'],
            suggestionsVisibles: 'visible',
            navigationClavierReinitialisee: true,
          },
          toucheClavierAppuyee('ArrowDown'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '1', index: 0 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
          suggestions: ['1', '12', '13'],
          suggestionsVisibles: 'visible',
        });
      });

      it('Sélectionne le premier élément de la liste si l’élément courant est le dernier', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '2', '3'],
            suggestionsVisibles: 'visible',
            elementNavigationCourant: { valeur: '3', index: 2 },
          },
          toucheClavierAppuyee('ArrowDown'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '1', index: 0 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '2', '3'],
          suggestions: [],
          suggestionsVisibles: 'visible',
        });
      });
    });

    describe('Navigation clavier avec la flèche haut', () => {
      it('Sélectionne le dernier élément', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '2', '3'],
            suggestionsVisibles: 'visible',
          },
          toucheClavierAppuyee('ArrowUp'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '3', index: 2 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '2', '3'],
          suggestions: [],
          suggestionsVisibles: 'visible',
        });
      });

      it('Sélectionne l’élément précédent', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '2', '3'],
            suggestionsVisibles: 'visible',
            elementNavigationCourant: { valeur: '2', index: 1 },
          },
          toucheClavierAppuyee('ArrowUp'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '1', index: 0 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '2', '3'],
          suggestions: [],
          suggestionsVisibles: 'visible',
        });
      });

      it('Sélectionne l’élément précédent en se basant sur les valeurs filtrées', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
            suggestions: ['12', '22', '23'],
            suggestionsVisibles: 'visible',
          },
          toucheClavierAppuyee('ArrowUp'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '23', index: 2 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
          suggestions: ['12', '22', '23'],
          suggestionsVisibles: 'visible',
        });
      });

      it('Se repositionne sur le premier élément si l’utilisateur modifie sa saisie', () => {
        const etat = reducteurAutoCompletion<string>()(
          {
            ...etatInitial,
            elementNavigationCourant: { valeur: '22', index: 3 },
            suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
            suggestions: ['1', '12', '13'],
            suggestionsVisibles: 'visible',
            navigationClavierReinitialisee: true,
          },
          toucheClavierAppuyee('ArrowUp'),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
          elementNavigationCourant: { valeur: '1', index: 0 },
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: '',
          suggestionsInitiales: ['1', '12', '13', '22', '23', '33'],
          suggestions: ['1', '12', '13'],
          suggestionsVisibles: 'visible',
        });
      });
    });
  });

  describe('Avec des suggestions sous forme de chaine de caractère', () => {
    it('Charge les suggestions initiales sans valeur saisie par défaut', () => {
      const etat = reducteurAutoCompletion<string>()(
        etatInitial,
        suggestionsInitialesChargees({ suggestionsInitiales: ['1', '2', '3'] }),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: false,
        valeurSaisie: '',
        suggestionsInitiales: ['1', '2', '3'],
        suggestions: ['1', '2', '3'],
        suggestionsVisibles: 'invisible',
      });
    });

    it('Valide la suggestion choisie', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion<string>()(
        {
          ...etatInitial,
          suggestionsInitiales: ['1', '2', '3'],
          suggestionsVisibles: 'visible',
        },
        suggestionChoisie('2', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: false,
        suggestionsInitiales: ['1', '2', '3'],
        valeurSaisie: '2',
        suggestions: [],
        suggestionsVisibles: 'invisible',
      });
      expect(appelRecu).toStrictEqual('2');
    });

    it('Réduit les suggestions possibles', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion<string>()(
        { ...etatInitial, suggestionsInitiales: ['1', '13', '2', '3', '33'] },
        valeurSaisie('3', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: '3',
        suggestionsInitiales: ['1', '13', '2', '3', '33'],
        suggestions: ['3', '33'],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('3');
    });

    it('Réduit les suggestions possibles en étant insensible à la casse', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion<string>()(
        { ...etatInitial, suggestionsInitiales: ['A', 'B', 'aC', 'D', 'Ea'] },
        valeurSaisie('a', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: 'a',
        suggestionsInitiales: ['A', 'B', 'aC', 'D', 'Ea'],
        suggestions: ['A', 'aC'],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('a');
    });

    it('N’exécute pas la fonction sur les valeurs filtrées', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion<string>()(
        {
          ...etatInitial,
          suggestionsInitiales: ['un', 'deux', 'trois', 'quatre', 'cinq'],
        },
        valeurSaisie('d', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: 'd',
        suggestionsInitiales: ['un', 'deux', 'trois', 'quatre', 'cinq'],
        suggestions: ['deux'],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('d');
    });

    it('Prend en compte la valeur saisie par l’utilisateur s’il revient sur sa saisie', () => {
      let appelRecu = '';
      const etat = reducteurAutoCompletion<string>()(
        {
          ...etatInitial,
          suggestionsInitiales: [
            'Ain',
            'Finistère',
            'Gironde',
            'Béarn',
            'Alpes-Maritimes',
          ],
          valeurSaisie: 'Finistère',
        },
        valeurSaisie('Finistèr', (valeur) => (appelRecu = valeur)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<string>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: 'Finistèr',
        suggestionsInitiales: [
          'Ain',
          'Finistère',
          'Gironde',
          'Béarn',
          'Alpes-Maritimes',
        ],
        suggestions: ['Finistère'],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('Finistèr');
    });
  });

  describe('Avec des suggestions sous forme d’objet', () => {
    type Test = {
      a: string;
      b: string;
      c: string;
    };

    it('Charge les suggestions initiales', () => {
      const etatInitial = initialiseEtatAutoCompletion<{
        [clef: string]: string;
      }>()('auto-complétion', '');
      const etat = reducteurAutoCompletion<{ [clef: string]: string }>()(
        etatInitial,
        suggestionsInitialesChargees<{ [clef: string]: string }>({
          suggestionsInitiales: [{ a: '1' }, { b: '2' }, { c: '3' }],
        }),
      );

      expect(etat).toStrictEqual<
        EtatAutoCompletion<{ [clef: string]: string }>
      >({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: false,
        valeurSaisie: '',
        suggestionsInitiales: [{ a: '1' }, { b: '2' }, { c: '3' }],
        suggestions: [{ a: '1' }, { b: '2' }, { c: '3' }],
        suggestionsVisibles: 'invisible',
      });
    });

    it('Valide la suggestion choisie avec des objets structurés', () => {
      const etatInitial = initialiseEtatAutoCompletion<{
        code: string;
        valeur: string;
      }>()('auto-complétion', '');
      let appelRecu = {} as { code: string; valeur: string };
      const etat = reducteurAutoCompletion<{ code: string; valeur: string }>()(
        {
          ...etatInitial,
          suggestionsInitiales: [
            { code: '1', valeur: '1' },
            { code: '2', valeur: '2' },
            { code: '3', valeur: '3' },
          ],
          suggestionsVisibles: 'visible',
        },
        suggestionChoisie(
          { code: '2', valeur: '2' },
          (valeur) => (appelRecu = valeur),
        ),
      );

      expect(etat).toStrictEqual<
        EtatAutoCompletion<{ code: string; valeur: string }>
      >({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: false,
        suggestionsInitiales: [
          { code: '1', valeur: '1' },
          { code: '2', valeur: '2' },
          { code: '3', valeur: '3' },
        ],
        valeurSaisie: { code: '2', valeur: '2' },
        suggestions: [],
        suggestionsVisibles: 'invisible',
      });
      expect(appelRecu).toStrictEqual({ code: '2', valeur: '2' });
    });

    it('Réduit les suggestions possibles sur tous les champs de l’objet', () => {
      const etatInitial = initialiseEtatAutoCompletion<Test>()(
        'auto-complétion',
        '',
      );
      let appelRecu = '';
      const etat = reducteurAutoCompletion<Test>()(
        {
          ...etatInitial,
          suggestionsInitiales: [
            { a: '1', b: '2', c: '3' },
            { a: '1', b: '23', c: '3' },
            { a: '1', b: '2', c: '4' },
            { a: '13', b: '2', c: '4' },
          ],
        },
        valeurSaisie('3', (valeur) => (appelRecu = valeur as string)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<Test>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: '3',
        suggestionsInitiales: [
          { a: '1', b: '2', c: '3' },
          { a: '1', b: '23', c: '3' },
          { a: '1', b: '2', c: '4' },
          { a: '13', b: '2', c: '4' },
        ],
        suggestions: [
          { a: '1', b: '2', c: '3' },
          { a: '1', b: '23', c: '3' },
        ],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('3');
    });

    it('Réduit les suggestions possibles sur tous les champs de l’objet en étant insensible à la casse', () => {
      const etatInitial = initialiseEtatAutoCompletion<Test>()(
        'auto-complétion',
        '',
      );
      let appelRecu = {} as Test;
      const etat = reducteurAutoCompletion<Test>()(
        {
          ...etatInitial,
          suggestionsInitiales: [
            { a: 'A', b: 'B', c: 'aC' },
            { a: 'A', b: 'AB', c: 'AC' },
            { a: 'C', b: 'B', c: 'D' },
            { a: 'Da', b: 'BA', c: 'D' },
          ],
        },
        valeurSaisie('a', (valeur) => (appelRecu = valeur as Test)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<Test>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: 'a',
        suggestionsInitiales: [
          { a: 'A', b: 'B', c: 'aC' },
          { a: 'A', b: 'AB', c: 'AC' },
          { a: 'C', b: 'B', c: 'D' },
          { a: 'Da', b: 'BA', c: 'D' },
        ],
        suggestions: [
          { a: 'A', b: 'B', c: 'aC' },
          { a: 'A', b: 'AB', c: 'AC' },
        ],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('a');
    });

    it('Récupère la valeur saisie sous forme d’objet si la saisie correspond', () => {
      const etatInitial = initialiseEtatAutoCompletion<Test>()(
        'auto-complétion',
        '',
      );
      let appelRecu = {} as Test;

      const etat = reducteurAutoCompletion<Test>()(
        {
          ...etatInitial,
          suggestionsInitiales: [
            { a: '1', b: '12', c: '13' },
            { a: '21', b: '22', c: '23' },
            { a: '31', b: '32', c: '33' },
          ],
        },
        valeurSaisie('22', (valeur) => (appelRecu = valeur as Test)),
      );

      expect(etat).toStrictEqual<EtatAutoCompletion<Test>>({
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: { a: '21', b: '22', c: '23' },
        suggestionsInitiales: [
          { a: '1', b: '12', c: '13' },
          { a: '21', b: '22', c: '23' },
          { a: '31', b: '32', c: '33' },
        ],
        suggestions: [{ a: '21', b: '22', c: '23' }],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual({ a: '21', b: '22', c: '23' });
    });

    describe('Avec des objets contenant des nombres', () => {
      type Objet = { a: string; b: number };
      it('Réduit les suggestions possibles suite à la saisie de l’utilisateur', () => {
        const etatInitial = initialiseEtatAutoCompletion<Objet>()(
          'auto-complétion',
          '',
        );
        let appelRecu = {} as Objet;
        const etat = reducteurAutoCompletion<Objet>()(
          {
            ...etatInitial,
            suggestionsInitiales: [
              { a: '1', b: 2 },
              { a: '1', b: 23 },
              { a: '1', b: 33 },
            ],
          },
          valeurSaisie('3', (valeur) => (appelRecu = valeur as Objet)),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<Objet>>({
          nom: 'auto-complétion',
          navigationClavierReinitialisee: true,
          valeurSaisie: '3',
          suggestionsInitiales: [
            { a: '1', b: 2 },
            { a: '1', b: 23 },
            { a: '1', b: 33 },
          ],
          suggestions: [{ a: '1', b: 33 }],
          suggestionsVisibles: 'visible',
        });
        expect(appelRecu).toStrictEqual('3');
      });

      it('Choisit la suggestion', () => {
        const etatInitial = initialiseEtatAutoCompletion<Objet>()(
          'auto-complétion',
          '',
        );
        let appelRecu = {} as Objet;

        const etat = reducteurAutoCompletion<Objet>()(
          {
            ...etatInitial,
            suggestionsInitiales: [
              { a: '1', b: 21 },
              { a: '1', b: 22 },
              { a: '1', b: 23 },
            ],
          },
          suggestionChoisie(
            { a: '1', b: 23 },
            (valeur) => (appelRecu = valeur),
          ),
        );

        expect(etat).toStrictEqual<EtatAutoCompletion<Objet>>({
          nom: 'auto-complétion',
          navigationClavierReinitialisee: false,
          valeurSaisie: { a: '1', b: 23 },
          suggestionsInitiales: [
            { a: '1', b: 21 },
            { a: '1', b: 22 },
            { a: '1', b: 23 },
          ],
          suggestions: [],
          suggestionsVisibles: 'invisible',
        });
        expect(appelRecu).toStrictEqual({ a: '1', b: 23 });
      });
    });

    it('Prend en compte la valeur saisie par l’utilisateur s’il revient sur sa saisie', () => {
      let appelRecu = '';
      const suggestionsInitiales = [
        { departement: 1, nom: 'Ain' },
        { departement: 29, nom: 'Finistère' },
        { departement: 33, nom: 'Gironde' },
        { departement: 64, nom: 'Béarn' },
        { departement: 6, nom: 'Alpes-Maritimes' },
      ];
      const etat = reducteurAutoCompletion<{
        departement: number;
        nom: string;
      }>()(
        {
          ...etatInitial,
          suggestionsInitiales,
          suggestions: suggestionsInitiales,
          valeurSaisie: 'Finistère',
          elementNavigationCourant: undefined,
        },
        valeurSaisie('Finistèr', (valeur) => (appelRecu = valeur as string)),
      );

      expect(etat).toStrictEqual<
        EtatAutoCompletion<{ departement: number; nom: string }>
      >({
        elementNavigationCourant: undefined,
        nom: 'auto-complétion',
        navigationClavierReinitialisee: true,
        valeurSaisie: 'Finistèr',
        suggestionsInitiales,
        suggestions: [{ departement: 29, nom: 'Finistère' }],
        suggestionsVisibles: 'visible',
      });
      expect(appelRecu).toStrictEqual('Finistèr');
    });
  });
});
