import { useCallback, useContext } from 'react';
import { FournisseurEntrepots } from '../../fournisseurs/FournisseurEntrepot.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

interface ComposantLancerDiagnosticProps {
  style: string;
}

export const ComposantLancerDiagnostic = ({
  style,
}: ComposantLancerDiagnosticProps) => {
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
