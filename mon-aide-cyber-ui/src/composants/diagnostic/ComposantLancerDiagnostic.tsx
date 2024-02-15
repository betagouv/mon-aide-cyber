import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useActionsUtilisateur, useMACAPI } from '../../fournisseurs/hooks.ts';
import { trouveParmiLesLiens } from '../../domaine/Actions.ts';
import { FormatLien, LienRoutage } from '../../domaine/LienRoutage.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';

type ProprietesComposantLancerDiagnostic = {
  style: string;
};

export const ComposantLancerDiagnostic = ({
  style,
}: ProprietesComposantLancerDiagnostic) => {
  const { showBoundary } = useErrorBoundary();
  const navigate = useNavigate();
  const actions = useActionsUtilisateur();
  const macapi = useMACAPI();

  const lancerDiagnostic = useCallback(async () => {
    const lien = trouveParmiLesLiens(actions, 'lancer-diagnostic');
    return macapi
      .appelle<LienRoutage>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        async (json) => new LienRoutage((await json) as FormatLien),
      )
      .then((lien) => navigate(lien.route()))
      .catch((erreur) => showBoundary(erreur));
  }, [actions, macapi, navigate, showBoundary]);

  return (
    <button className={style} onClick={lancerDiagnostic}>
      Lancer un diagnostic
    </button>
  );
};
