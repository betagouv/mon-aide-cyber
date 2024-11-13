import { beforeEach, describe, expect, it } from 'vitest';
import {
  confirmationMotDePasseSaisi,
  EtatFormulaireReinitialiserMotDePasse,
  initialiseFormulaireReinitialiserMotDePasse,
  motDePasseSaisi,
  reducteurFormulaireReinitialiserMotDePasse,
} from '../../../../../src/domaine/vitrine/reinitialiser-mot-de-passe/formulaire-reinitialiser-mot-de-passe/reducteurFormulaireReinitialiserMotDePasse';

describe('Formulaire de modification du mot de passe, suite à une demande dé réinitialisation', () => {
  let etatInitial: EtatFormulaireReinitialiserMotDePasse =
    {} as EtatFormulaireReinitialiserMotDePasse;

  beforeEach(() => {
    etatInitial = initialiseFormulaireReinitialiserMotDePasse();
  });

  describe('Le mot de passe est modifié', () => {
    it('Le prend en compte dans le formulaire', () => {
      const etat = reducteurFormulaireReinitialiserMotDePasse(
        etatInitial,
        motDePasseSaisi('123456789')
      );

      expect(etat).toStrictEqual<EtatFormulaireReinitialiserMotDePasse>({
        motDePasse: '123456789',
        confirmationMotDePasse: '',
        pretPourEnvoi: true,
      });
    });

    it('La confirmation du mot de passe est prise en compte dans le formulaire', () => {
      const etat = reducteurFormulaireReinitialiserMotDePasse(
        etatInitial,
        confirmationMotDePasseSaisi('123456789')
      );

      expect(etat).toStrictEqual<EtatFormulaireReinitialiserMotDePasse>({
        motDePasse: '',
        confirmationMotDePasse: '123456789',
        erreurs: {
          confirmationMotDePasse: 'Les deux mots de passe doivent correspondre',
        },
        pretPourEnvoi: false,
      });
    });

    it('le formulaire est valide car les deux mots de passes correspondent', () => {
      const etat = reducteurFormulaireReinitialiserMotDePasse(
        {
          ...etatInitial,
          confirmationMotDePasse: '123456789',
        },
        motDePasseSaisi('123456789')
      );

      expect(etat).toStrictEqual<EtatFormulaireReinitialiserMotDePasse>({
        motDePasse: '123456789',
        confirmationMotDePasse: '123456789',
        pretPourEnvoi: true,
      });
    });
  });
});
