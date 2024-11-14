import { FormEvent, useReducer } from 'react';
import {
  confirmationMotDePasseSaisi,
  initialiseFormulaireReinitialiserMotDePasse,
  motDePasseSaisi,
  reducteurFormulaireReinitialiserMotDePasse,
} from './reducteurFormulaireReinitialiserMotDePasse.ts';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { PasswordInput } from '../../../../composants/atomes/Input/PasswordInput.tsx';

export const FormulaireReinitialiserMotDePasse = ({
  surSoumission,
}: {
  surSoumission: ({
    motDePasse,
    confirmationMotDePasse,
  }: {
    motDePasse: string;
    confirmationMotDePasse: string;
  }) => void;
}) => {
  const [etatFormulaire, declencheActionFormulaire] = useReducer(
    reducteurFormulaireReinitialiserMotDePasse,
    initialiseFormulaireReinitialiserMotDePasse()
  );

  const soumetFormulaire = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    surSoumission({
      motDePasse: etatFormulaire.motDePasse,
      confirmationMotDePasse: etatFormulaire.confirmationMotDePasse,
    });
  };

  return (
    <div className="formulaire-reinitialiser-mot-de-passe-layout">
      <p className="text-center">
        Veuillez spécifier un nouveau mot de passe pour accéder à votre compte
        Aidant MonAideCyber
      </p>
      <p>
        Le mot de passe doit comporter <b>16 caractères minimum</b>, dont au
        moins :
        <br />
        <ul>
          <li>1 majuscule</li>
          <li>1 minuscule</li>
          <li>1 chiffre</li>
          <li>
            1 caractère spécial parmi
            &#35;?!@&#36;&#37;^&amp;*-&apos;+_&#40;&#41;[]
          </li>
        </ul>
      </p>
      <div className="mac-callout mac-callout-information">
        <i className="mac-icone-information" />
        <div>
          Évitez d’utiliser des mots du dictionnaire, des suites de lettres, des
          suites de chiffre, des dates, des informations personnelles (ex: nom,
          prénom, date de naissance).
        </div>
      </div>
      <form
        className="formulaire-reinitialiser-mot-de-passe"
        onSubmit={soumetFormulaire}
      >
        <fieldset className="fr-col-12">
          <div
            className={`fr-input-group ${
              etatFormulaire.erreurs?.motDePasse ? 'fr-input-group--error' : ''
            }`}
          >
            <label className="fr-label" htmlFor="motDePasse">
              <span className="asterisque">*</span>
              <span> Choisissez un nouveau mot de passe</span>
            </label>
            <PasswordInput
              id="motDePasse"
              name="motDePasse"
              onBlur={(e) =>
                declencheActionFormulaire(motDePasseSaisi(e.target.value))
              }
            />
            {etatFormulaire.erreurs?.motDePasse ? (
              <p className="fr-error-text">
                {etatFormulaire.erreurs?.motDePasse}
              </p>
            ) : null}
          </div>
        </fieldset>
        <fieldset className="fr-col-12">
          <div
            className={`fr-input-group ${
              etatFormulaire.erreurs?.confirmationMotDePasse
                ? 'fr-input-group--error'
                : ''
            }`}
          >
            <label className="fr-label" htmlFor="confirmationMotDePasse">
              <span className="asterisque">*</span>
              <span> Confirmez votre nouveau mot de passe</span>
            </label>
            <PasswordInput
              id="confirmationMotDePasse"
              name="confirmationMotDePasse"
              onBlur={(e) =>
                declencheActionFormulaire(
                  confirmationMotDePasseSaisi(e.target.value)
                )
              }
            />
            {etatFormulaire.erreurs?.confirmationMotDePasse ? (
              <p className="fr-error-text">
                {etatFormulaire.erreurs?.confirmationMotDePasse}
              </p>
            ) : null}
          </div>
        </fieldset>
        <div className="actions">
          <Button
            type="submit"
            variant="primary"
            disabled={!etatFormulaire.pretPourEnvoi}
          >
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
};
