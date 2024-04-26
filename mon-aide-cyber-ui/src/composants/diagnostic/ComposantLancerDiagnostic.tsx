import { PropsWithChildren, useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigationMAC, useMACAPI } from '../../fournisseurs/hooks.ts';
import { FormatLien, LienRoutage } from '../../domaine/LienRoutage.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Lien } from '../../domaine/Lien.ts';

export const ComposantLancerDiagnostic = ({ children }: PropsWithChildren) => {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();

  const lanceDiagnostic = useCallback(
    (lien: Lien) => {
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
    },
    [macapi, navigationMAC, showBoundary],
  );

  const lancerDiagnostic = useCallback(async () => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'lancer-diagnostic',
      (lien: Lien) => lanceDiagnostic(lien),
    );
  }, [navigationMAC.etat, lanceDiagnostic]);

  return <div onClick={lancerDiagnostic}>{children}</div>;
};
