import { useCallback, useContext } from 'react';
import { FournisseurEntrepots } from '../../fournisseurs/FournisseurEntrepot.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useActionsUtilisateur } from '../../fournisseurs/hooks.ts';
import { trouveParmiLesLiens } from '../../domaine/Actions.ts';

type ProprietesComposantLancerDiagnostic = {
  style: string;
};

export const ComposantLancerDiagnostic = ({
  style,
}: ProprietesComposantLancerDiagnostic) => {
  const entrepots = useContext(FournisseurEntrepots);
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();
  const actions = useActionsUtilisateur();

  const lancerDiagnostic = useCallback(async () => {
    return await entrepots
      .diagnostic()
      .lancer(trouveParmiLesLiens(actions, 'lancer-diagnostic'))
      .then((lien) => navigate(lien.route()))
      .catch((erreur) => showBoundary(erreur));
  }, [actions, entrepots, navigate, showBoundary]);

  return (
    <button className={style} onClick={lancerDiagnostic}>
      Lancer un diagnostic
    </button>
  );
};
