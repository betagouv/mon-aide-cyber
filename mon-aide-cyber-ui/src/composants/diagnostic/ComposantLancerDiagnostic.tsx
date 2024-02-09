import { useCallback, useContext } from 'react';
import { FournisseurEntrepots } from '../../fournisseurs/FournisseurEntrepot.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useActionsUtilisateur } from '../../fournisseurs/hooks.ts';
import { ParametresAPI } from '../../domaine/diagnostic/ParametresAPI.ts';

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
    const lancerDiagnostic: ParametresAPI = Object.entries(actions)
      .filter(([action]) => action === 'lancer-diagnostic')
      .map(([, action]) => action as ParametresAPI)[0];
    return await entrepots
      .diagnostic()
      .lancer(lancerDiagnostic)
      .then((lien) => navigate(lien.route()))
      .catch((erreur) => showBoundary(erreur));
  }, [actions, entrepots, navigate, showBoundary]);

  return (
    <button className={style} onClick={lancerDiagnostic}>
      Lancer un diagnostic
    </button>
  );
};
