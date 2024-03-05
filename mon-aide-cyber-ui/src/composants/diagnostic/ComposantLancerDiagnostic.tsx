import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigationMAC, useMACAPI } from '../../fournisseurs/hooks.ts';
import { FormatLien, LienRoutage } from '../../domaine/LienRoutage.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';

type ProprietesComposantLancerDiagnostic = {
  style: string;
};

export const ComposantLancerDiagnostic = ({
  style,
}: ProprietesComposantLancerDiagnostic) => {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();

  const lancerDiagnostic = useCallback(async () => {
    const lien = new MoteurDeLiens(navigationMAC.etat).trouve(
      'lancer-diagnostic',
    );
    macapi
      .appelle<LienRoutage>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        async (json) => new LienRoutage((await json) as FormatLien),
      )
      .then((lien) => {
        return navigationMAC.navigue(
          new MoteurDeLiens({
            'afficher-diagnostic': {
              url: '',
              route: lien.route(),
              methode: 'GET',
            },
          }),
          'afficher-diagnostic',
        );
      })
      .catch((erreur) => showBoundary(erreur));
  }, [navigationMAC, macapi, showBoundary]);

  return (
    <button className={style} onClick={lancerDiagnostic}>
      Lancer un diagnostic
    </button>
  );
};
