import Button from '../../../composants/atomes/Button/Button.tsx';
import './formulaire-demande-autodiagnostic.scss';
import { Input } from '../../../composants/atomes/Input/Input.tsx';
import { FormEvent, useReducer } from 'react';
import { ChampValidationCGUs } from '../../../composants/formulaires/ChampValidationCGUs.tsx';
import {
  adresseElectroniqueSaisie,
  cguCliquees,
  initialiseFormulaireDemandeAutodiagnostic,
  reducteurFormulaireDemandeAutodiagnostic,
} from './reducteurFormulaireDemandeAutodiagnostic.ts';

export type TypeFormulaireSaisieEmail = {
  email: string;
  cguSignees: boolean;
};

export const FormulaireDemandeAutodiagnostic = ({
  surSoumission,
}: {
  surSoumission: (formulaire: TypeFormulaireSaisieEmail) => void;
}) => {
  const [etatFormulaire, declencheChangement] = useReducer(
    reducteurFormulaireDemandeAutodiagnostic,
    initialiseFormulaireDemandeAutodiagnostic()
  );

  const soumetFormulaire = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    surSoumission({
      email: etatFormulaire.email,
      cguSignees: etatFormulaire.cguValidees,
    });
  };

  return (
    <form
      className="formulaire-demande-autodiagnostic"
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
          <Input
            type="text"
            id="adresse-electronique"
            name="adresse-electronique"
            onBlur={(e) =>
              declencheChangement(adresseElectroniqueSaisie(e.target.value))
            }
            onChange={(e) =>
              declencheChangement(adresseElectroniqueSaisie(e.target.value))
            }
          />
          {etatFormulaire.erreurs?.adresseElectronique ? (
            <p className="fr-error-text">
              {etatFormulaire.erreurs?.adresseElectronique}
            </p>
          ) : null}
        </div>
      </div>
      <div className="fr-col-12">
        <ChampValidationCGUs
          sontValidees={etatFormulaire.cguValidees}
          surCguCliquees={() => declencheChangement(cguCliquees())}
        />
      </div>
      <div className="actions">
        <Button type="submit" disabled={!etatFormulaire.pretPourEnvoi}>
          Accéder au diagnostic
        </Button>
      </div>
    </form>
  );
};
