import { Input } from '../../../../composants/atomes/Input/Input.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { FormEvent } from 'react';
import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';

export const FormulaireMotDePasseOublie = () => {
  const soumetFormulaire = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('soumet le formulaire', e);
  };

  return (
    <div className="formulaire-mot-de-passe-oublie-layout">
      <TypographieH3 style={{ textAlign: 'center' }}>
        Réinitialisation de votre mot de passe
      </TypographieH3>
      <p style={{ textAlign: 'center' }}>
        Pour réinitialiser votre mot de passe, veuillez spécifier l’adresse
        email que vous avez utilisée pour vous inscrire.
      </p>
      <form
        className="formulaire-mot-de-passe-oublie"
        onSubmit={soumetFormulaire}
      >
        <fieldset>
          <label htmlFor="email">Votre adresse électronique</label>
          <Input id="email" type="email" placeholder="martin@email.com" />
        </fieldset>
        <p>
          En cliquant sur le bouton ci-dessous, vous recevrez un email sur
          l’adresse mail indiquée afin de créer un nouveau mot de passe.
        </p>
        <div className="actions">
          <Button type="button" variant="secondary">
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Réinitialiser le mot de passe
          </Button>
        </div>
      </form>
    </div>
  );
};
