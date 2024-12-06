import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  EtatFormulaireMotDePasseOublie,
  initialiseFormulaireMotDePasseOublie,
  reducteurFormulaireMotDePasseOublie,
} from '../../../../../src/domaine/vitrine/mot-de-passe-oublie/formulaire-mot-de-passe-oublie/reducteurFormulaireMotDePasseOublie';

describe('Formulaire de réinitialisation de mot de passe', () => {
  let etatInitial: EtatFormulaireMotDePasseOublie =
    {} as EtatFormulaireMotDePasseOublie;

  beforeEach(() => {
    etatInitial = initialiseFormulaireMotDePasseOublie();
  });

  describe("L'adresse électronique est modifiée", () => {
    it('La prend en compte dans le formulaire', () => {
      const etat = reducteurFormulaireMotDePasseOublie(
        etatInitial,
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireMotDePasseOublie>({
        email: 'jean.dupont@email.com',
        pretPourEnvoi: true,
      });
    });

    it('Saisie un mail invalide', () => {
      const etat = reducteurFormulaireMotDePasseOublie(
        etatInitial,
        adresseElectroniqueSaisie('jean.dupont-mauvais-format')
      );

      expect(etat).toStrictEqual<EtatFormulaireMotDePasseOublie>({
        email: 'jean.dupont-mauvais-format',
        pretPourEnvoi: false,
        erreurs: {
          adresseElectronique:
            'Veuillez saisir une adresse électronique valide.',
        },
      });
    });

    it('Corrige le mail', () => {
      const etat = reducteurFormulaireMotDePasseOublie(
        {
          ...etatInitial,
          email: 'email-incorrect',
          erreurs: {
            adresseElectronique:
              'Veuillez saisir une adresse électronique valide.',
          },
        },
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireMotDePasseOublie>({
        email: 'jean.dupont@email.com',
        pretPourEnvoi: true,
      });
    });

    it('Rend le formulaire valide', () => {
      const etat = reducteurFormulaireMotDePasseOublie(
        {
          ...etatInitial,
        },
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireMotDePasseOublie>({
        email: 'jean.dupont@email.com',
        pretPourEnvoi: true,
      });
    });
  });
});
