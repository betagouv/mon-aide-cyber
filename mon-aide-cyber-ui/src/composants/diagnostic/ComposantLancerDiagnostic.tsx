import { ReactElement, useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigationMAC, useMACAPI } from '../../fournisseurs/hooks.ts';
import { FormatLien, LienRoutage } from '../../domaine/LienRoutage.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Lien } from '../../domaine/Lien.ts';

type ProprietesComposant = {
  surClick: () => void;
};
type ProprietesComposantLancerDiagnostic = {
  composant: ({
    surClick,
  }: ProprietesComposant) => ReactElement<
    HTMLButtonElement | HTMLAnchorElement
  >;
};

export const ComposantBoutonLancerDiagnostic = ({
  surClick,
}: ProprietesComposant): ReactElement<HTMLButtonElement> => {
  return (
    <button className="bouton-mac bouton-mac-primaire" onClick={surClick}>
      Lancer un diagnostic
    </button>
  );
};

export const ComposantLienLancerDiagnostic = ({
  surClick,
}: ProprietesComposant): ReactElement<HTMLAnchorElement> => {
  return (
    <a
      href="#"
      className="fr-icon-arrow-go-forward-line fr-link--icon-right"
      onClick={surClick}
    >
      Lancer un diagnostic
    </a>
  );
};

export const ComposantLancerDiagnostic = ({
  composant,
}: ProprietesComposantLancerDiagnostic) => {
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

  return composant({ surClick: lancerDiagnostic });
};
