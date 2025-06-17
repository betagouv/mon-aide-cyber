import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { useMutation } from '@tanstack/react-query';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Alerte } from '../../../../composants/communs/messages/Alerte.tsx';
import { FormulaireMotDePasseOublie } from './FormulaireMotDePasseOublie.tsx';

export type CorpsMotDePasseOublie = {
  email: string;
};

export const CapteurFormulaireMotDePasseOublie = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  useRecupereContexteNavigation(
    'reinitialisation-mot-de-passe:reinitialisation-mot-de-passe'
  );

  const { mutate, isSuccess, error, isError, isPending, variables } =
    useMutation({
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
      <Alerte
        className="w-100"
        type="INFO"
        message="Traitement de votre demande en cours"
      />
    );

  if (isError)
    return <Alerte className="w-100" type="ERREUR" message={error.message} />;

  if (isSuccess)
    return (
      <div className="mac-callout mac-callout-information">
        <i className="mac-icone-information" />
        <div>
          Si le compte existe, un e-mail de redéfinition de mot de passe sera
          envoyé à : <b>{variables}</b>. Veuillez vérifier votre boîte de
          réception.
        </div>
      </div>
    );

  return <FormulaireMotDePasseOublie surSoumission={mutate} />;
};
