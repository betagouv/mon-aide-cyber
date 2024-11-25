import Button from '../../../composants/atomes/Button/Button.tsx';
import './formulaire-demande-autodiagnostic.scss';
import { FormEvent, useReducer } from 'react';
import { ChampValidationCGUs } from '../../../composants/formulaires/ChampValidationCGUs.tsx';
import {
  cguCliquees,
  initialiseFormulaireDemandeAutodiagnostic,
  reducteurFormulaireDemandeAutodiagnostic,
} from './reducteurFormulaireDemandeAutodiagnostic.ts';

export type TypeFormulaireSaisieEmail = {
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
      cguSignees: etatFormulaire.cguValidees,
    });
  };

  return (
    <form
      className="formulaire-demande-autodiagnostic"
      onSubmit={soumetFormulaire}
    >
      <fieldset>
        <ChampValidationCGUs
          sontValidees={etatFormulaire.cguValidees}
          surCguCliquees={() => declencheChangement(cguCliquees())}
        />
      </fieldset>
      <div className="actions">
        <Button type="submit" disabled={!etatFormulaire.pretPourEnvoi}>
          Je commence le diagnostic
        </Button>
      </div>
    </form>
  );
};
