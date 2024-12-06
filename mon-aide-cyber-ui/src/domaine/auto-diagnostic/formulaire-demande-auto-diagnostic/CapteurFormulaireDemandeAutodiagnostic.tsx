import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useMutation } from '@tanstack/react-query';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Toast } from '../../../composants/communs/Toasts/Toast.tsx';
import {
  FormulaireDemandeAutodiagnostic,
  TypeFormulaireSaisieEmail,
} from './FormulaireDemandeAutodiagnostic.tsx';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import { FormatLien } from '../../../composants/diagnostic/ComposantLancerDiagnostic.tsx';
import { useNavigueVersModifierDiagnostic } from '../../../fournisseurs/ContexteNavigationMAC.tsx';

export type CorpsDemandeAutodiagnostic = {
  cguSignees: boolean;
};

export const CapteurFormulaireDemandeAutodiagnostic = () => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { navigue } = useNavigueVersModifierDiagnostic('/diagnostic');

  useRecupereContexteNavigation('utiliser-outil-diagnostic:creer');

  const { mutate, error, isError, isPending } = useMutation({
    mutationKey: ['creer-auto-diagnostic'],
    mutationFn: (formulaire: TypeFormulaireSaisieEmail) => {
      const actionSoumettre = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('creer-diagnostic');

      if (!actionSoumettre)
        throw new Error(
          `Une erreur est survenue lors de la demande de diagnostic`
        );

      return macAPI.execute<string, FormatLien, CorpsDemandeAutodiagnostic>(
        constructeurParametresAPI<CorpsDemandeAutodiagnostic>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps({
            cguSignees: formulaire.cguSignees,
          })
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

  return <FormulaireDemandeAutodiagnostic surSoumission={mutate} />;
};
