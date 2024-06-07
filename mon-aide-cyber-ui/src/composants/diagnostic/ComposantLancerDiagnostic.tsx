import { ReactElement, useCallback, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  useNavigationMAC,
  useMACAPI,
  useModale,
} from '../../fournisseurs/hooks.ts';
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

export const ComposantBoutonCreerDiagnostic = ({
  surClick,
}: ProprietesComposant): ReactElement<HTMLButtonElement> => {
  return (
    <button className="bouton-mac bouton-mac-primaire" onClick={surClick}>
      Créer un diagnostic
    </button>
  );
};

export const ComposantLienCreerDiagnostic = ({
  surClick,
}: ProprietesComposant): ReactElement<HTMLAnchorElement> => {
  return (
    <a
      href="#"
      className="fr-icon-arrow-go-forward-line fr-link--icon-right"
      onClick={surClick}
    >
      Créer un diagnostic
    </a>
  );
};

function ValidationCGU(proprietesValidationCGU: {
  surFermeture: () => void;
  surValidation: () => void;
}) {
  const [cguValidees, setCguValidees] = useState(false);

  const validationCGU = useCallback(() => {
    setCguValidees(!cguValidees);
  }, [cguValidees]);

  return (
    <>
      <section>
        <div>
          Vous vous apprêtez à réaliser un diagnostic.
          <br />
          Est-ce que l&apos;entité a validé les CGU de MonAideCyber ?
        </div>
        <div className="fr-radio-group mac-radio-group fr-pt-4w">
          <input
            type="radio"
            name="radio-validation-cgu"
            id="radio-validation-cgu-oui"
            onChange={() => validationCGU()}
          />
          <label className="fr-label" htmlFor="radio-validation-cgu-oui">
            <div>
              L&apos;entité confirme avoir rempli le&nbsp;
              <a href="/demande-aide">formulaire</a> et accepté les CGU
            </div>
          </label>
        </div>
        <div className="fr-radio-group mac-radio-group fr-pt-4w">
          <input
            type="radio"
            name="radio-validation-cgu"
            id="radio-validation-cgu-non"
            onChange={() => setCguValidees(false)}
          />
          <label className="fr-label" htmlFor="radio-validation-cgu-non">
            <div>
              L&apos;entité n&apos;a pas encore accepté les CGU.
              <br />
              L&apos;utilisation du diagnostic nécessite l&apos;acceptation des
              CGU par l&apos;entité diagnostiquée. Veuillez partager à
              l&apos;entité&nbsp;
              <a href="/demande-aide">le lien du formulaire</a> afin
              qu&apos;elle accepte les CGU avant de démarrer le diagnostic :
              <br />
              <a href={`${import.meta.env['VITE_URL_MAC']}/demande-aide`}>
                {`${import.meta.env['VITE_URL_MAC']}/demande-aide`}
              </a>
            </div>
          </label>
        </div>
        <div className="fr-pt-4w alignement-droite">
          <button
            type="button"
            key="annule-validation-cgu-entite"
            className="fr-btn bouton-mac bouton-mac-secondaire fr-mr-2w"
            onClick={proprietesValidationCGU.surFermeture}
          >
            Retour à la liste des diagnostics
          </button>
          <button
            disabled={!cguValidees}
            type="button"
            key="validation-cgu-entite"
            className="fr-btn bouton-mac bouton-mac-primaire"
            onClick={() =>
              cguValidees && proprietesValidationCGU.surValidation()
            }
          >
            Commencer le diagnostic
          </button>
        </div>
      </section>
    </>
  );
}

export const ComposantLancerDiagnostic = ({
  composant,
}: ProprietesComposantLancerDiagnostic) => {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();
  const { affiche, ferme } = useModale();

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

  const afficherModale = useCallback(() => {
    affiche({
      titre: "Acceptation des CGU par l'entité",
      corps: (
        <ValidationCGU
          surFermeture={ferme}
          surValidation={async () => {
            ferme();
            await lancerDiagnostic();
          }}
        />
      ),
      taille: 'moyenne',
    });
  }, [affiche, ferme, lancerDiagnostic]);

  return composant({ surClick: afficherModale });
};
