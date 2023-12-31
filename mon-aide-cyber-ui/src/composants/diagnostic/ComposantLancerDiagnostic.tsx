import { useCallback, useContext } from 'react';
import { FournisseurEntrepots } from '../../fournisseurs/FournisseurEntrepot.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

type ProprietesComposantLancerDiagnostic = {
  style: string;
};

export const ComposantLancerDiagnostic = ({
  style,
}: ProprietesComposantLancerDiagnostic) => {
  const entrepots = useContext(FournisseurEntrepots);
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  const lancerDiagnostic = useCallback(async () => {
    return await entrepots
      .diagnostic()
      .lancer()
      .then((lien) => navigate(lien.route()))
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, showBoundary, navigate]);

  return (
    <button className={style} onClick={lancerDiagnostic}>
      Lancer un diagnostic
    </button>
  );
};
