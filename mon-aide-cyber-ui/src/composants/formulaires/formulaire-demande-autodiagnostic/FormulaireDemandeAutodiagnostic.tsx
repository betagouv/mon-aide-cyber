import Button from '../../atomes/Button/Button.tsx';
import './formulaire-demande-autodiagnostic.scss';
import { Input } from '../../atomes/Input/Input.tsx';
import { useState } from 'react';
import { ChampValidationCGUs } from '../ChampValidationCGUs.tsx';

type TypeFormulaireSaisieEmail = {
  email: string;
  cguValidees: boolean;
};

export const FormulaireDemandeAutodiagnostic = () => {
  const [formulaire, setFormulaire] = useState<TypeFormulaireSaisieEmail>({
    email: '',
    cguValidees: false,
  });

  const surSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formulaire);
  };

  const surMailSaisi = (email: string) => {
    setFormulaire((etatPrecedent) => {
      return {
        ...etatPrecedent,
        email,
      };
    });
  };

  const surCguCliquees = () => {
    setFormulaire((etatPrecedent) => {
      return {
        ...etatPrecedent,
        cguValidees: !etatPrecedent.cguValidees,
      };
    });
  };

  return (
    <form
      className="formulaire-demande-autodiagnostic"
      onSubmit={surSoumission}
    >
      <div
        className={`fr-input-group ${
          !formulaire.email ? 'fr-input-group--error' : ''
        }`}
      >
        <label htmlFor="email">
          <span className="asterisque">*</span>
          <span> Votre adresse électronique</span>
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          value={formulaire.email}
          onChange={(e) => surMailSaisi(e.target.value)}
        />
        {!formulaire.email && (
          <p className="fr-error-text">Email obligatoire !</p>
        )}
      </div>
      <div className="fr-col-12">
        <ChampValidationCGUs
          sontValidees={formulaire.cguValidees}
          surCguCliquees={surCguCliquees}
        />
      </div>
      <div className="actions">
        <Button type="submit">Accéder au diagnostic</Button>
      </div>
    </form>
  );
};
