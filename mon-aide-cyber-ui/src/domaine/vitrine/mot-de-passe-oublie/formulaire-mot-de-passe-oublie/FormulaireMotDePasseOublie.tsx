import Button from '../../../../composants/atomes/Button/Button.tsx';
import { FormEvent, useReducer } from 'react';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMutation } from '@tanstack/react-query';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import {
  adresseElectroniqueSaisie,
  initialiseFormulaireMotDePasseOublie,
  reducteurFormulaireMotDePasseOublie,
} from './reducteurFormulaireMotDePasseOublie.ts';
import { Toast } from '../../../../composants/communs/Toasts/Toast.tsx';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';

export type CorpsMotDePasseOublie = {
  email: string;
};

export const FormulaireMotDePasseOublieConnecte = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  useRecupereContexteNavigation(
    'reinitialisation-mot-de-passe:reinitialisation-mot-de-passe'
  );

  const { mutate, isSuccess, error, isError, isPending } = useMutation({
    mutationKey: ['reinitialisation-mot-de-passe'],
    mutationFn: (email: string) => {
      if (!email) Promise.reject('Aucun email renseigné !');

      const actionSoumettre = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('reinitialisation-mot-de-passe');

      if (!actionSoumettre)
        throw new Error(
          'Une erreur est survenue lors de la demande de réinitialisation de mot de passe'
        );

      return macAPI.execute<void, void, CorpsMotDePasseOublie>(
        constructeurParametresAPI<CorpsMotDePasseOublie>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps({
            email: email,
          })
          .construis(),
        (corps) => corps
      );
    },
  });

  if (isPending)
    return (
      <Toast
        className="w-100"
        type="INFO"
        message="Traitement de votre demande en cours"
      />
    );

  if (isError)
    return <Toast className="w-100" type="ERREUR" message={error.message} />;

  if (isSuccess)
    return (
      <div className="mac-callout mac-callout-information">
        <i className="mac-icone-information" />
        <div>
          Si le compte existe, un e-mail de redéfinition de mot de passe sera
          envoyé à : <b>martin@mail.com</b> Veuillez vérifier votre boîte de
          réception.
        </div>
      </div>
    );

  return <FormulaireMotDePasseOublie surSoumission={mutate} />;
};

export const FormulaireMotDePasseOublie = ({
  surSoumission,
}: {
  surSoumission: (email: string) => void;
}) => {
  const [etatFormulaire, declencheActionFormulaire] = useReducer(
    reducteurFormulaireMotDePasseOublie,
    initialiseFormulaireMotDePasseOublie()
  );
  const soumetFormulaire = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('soumet le formulaire', e);
    surSoumission(etatFormulaire.email);
  };

  return (
    <div className="formulaire-mot-de-passe-oublie-layout">
      <p style={{ textAlign: 'center' }}>
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
          <Button type="button" variant="secondary">
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
