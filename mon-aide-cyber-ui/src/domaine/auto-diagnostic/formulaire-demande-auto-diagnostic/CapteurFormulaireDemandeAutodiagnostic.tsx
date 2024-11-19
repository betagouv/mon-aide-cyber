import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useMutation } from '@tanstack/react-query';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { CorpsMotDePasseOublie } from '../../vitrine/mot-de-passe-oublie/formulaire-mot-de-passe-oublie/CapteurFormulaireMotDePasseOublie.tsx';
import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import {
  FormulaireDemandeAutodiagnostic,
  TypeFormulaireSaisieEmail,
} from './FormulaireDemandeAutodiagnostic.tsx';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import { FormatLien } from '../../../composants/diagnostic/ComposantLancerDiagnostic.tsx';
import { useNavigueVersModifierDiagnostic } from '../../../fournisseurs/ContexteNavigationMAC.tsx';

export const CapteurFormulaireDemandeAutodiagnostic = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { navigue } = useNavigueVersModifierDiagnostic('/diagnostic');

  useRecupereContexteNavigation('utiliser-outil-diagnostic:creer');

  const { mutate, isSuccess, error, isError, isPending, variables } =
    useMutation({
      mutationKey: ['creer-auto-diagnostic'],
      mutationFn: (formulaire: TypeFormulaireSaisieEmail) => {
        const actionSoumettre = new MoteurDeLiens(
          navigationMAC.etat
        ).trouveEtRenvoie('creer-diagnostic');

        if (!actionSoumettre)
          throw new Error(
            `Une erreur est survenue lors de la demande de diagnostic`
          );

        return macAPI.execute<string, FormatLien, CorpsMotDePasseOublie>(
          constructeurParametresAPI<CorpsMotDePasseOublie>()
            .url(actionSoumettre.url)
            .methode(actionSoumettre.methode!)
            .corps(formulaire)
            .construis(),
          async (lienHeader) => await lienHeader
        );
      },
      onSuccess: (lien) => {
        navigue({ url: lien, methode: 'GET' });
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
          Votre demande a été prise en compte. Un lien d&apos;accès à votre auto
          diagnostic va être envoyé à : <b>{variables.email}</b>. Veuillez
          vérifier votre boîte de réception.
        </div>
      </div>
    );

  return <FormulaireDemandeAutodiagnostic surSoumission={mutate} />;
};
