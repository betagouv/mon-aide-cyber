import Button from '../../../../composants/atomes/Button/Button.tsx';
import { FormEvent, useReducer } from 'react';
import {
  adresseElectroniqueSaisie,
  initialiseFormulaireMotDePasseOublie,
  reducteurFormulaireMotDePasseOublie,
} from './reducteurFormulaireMotDePasseOublie.ts';
import { useNavigate } from 'react-router-dom';

export const FormulaireMotDePasseOublie = ({
  surSoumission,
}: {
  surSoumission: (email: string) => void;
}) => {
  const navigate = useNavigate();

  const [etatFormulaire, declencheActionFormulaire] = useReducer(
    reducteurFormulaireMotDePasseOublie,
    initialiseFormulaireMotDePasseOublie()
  );
  const soumetFormulaire = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    surSoumission(etatFormulaire.email);
  };

  return (
    <div className="formulaire-mot-de-passe-oublie-layout">
      <p className="text-center">
        Pour réinitialiser votre mot de passe, veuillez spécifier l’adresse
        email que vous avez utilisée pour vous inscrire.
      </p>
      <form
        className="formulaire-mot-de-passe-oublie"
        onSubmit={soumetFormulaire}
      >
        <div className="fr-col-12">
          <div
            className={`fr-input-group ${
              etatFormulaire.erreurs?.adresseElectronique
                ? 'fr-input-group--error'
                : ''
            }`}
          >
            <label className="fr-label" htmlFor="adresse-electronique">
              <span className="asterisque">*</span>
              <span> Votre adresse électronique</span>
            </label>
            <input
              className="fr-input"
              type="text"
              id="adresse-electronique"
              name="adresse-electronique"
              onBlur={(e) =>
                declencheActionFormulaire(
                  adresseElectroniqueSaisie(e.target.value)
                )
              }
              onChange={(e) =>
                declencheActionFormulaire(
                  adresseElectroniqueSaisie(e.target.value)
                )
              }
            />
            {etatFormulaire.erreurs?.adresseElectronique ? (
              <p className="fr-error-text">
                {etatFormulaire.erreurs?.adresseElectronique}
              </p>
            ) : null}
          </div>
        </div>
        <p>
          En cliquant sur le bouton ci-dessous, vous recevrez un email sur
          l’adresse mail indiquée afin de créer un nouveau mot de passe.
        </p>
        <div className="actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!etatFormulaire.pretPourEnvoi}
          >
            Réinitialiser le mot de passe
          </Button>
        </div>
      </form>
    </div>
  );
};
