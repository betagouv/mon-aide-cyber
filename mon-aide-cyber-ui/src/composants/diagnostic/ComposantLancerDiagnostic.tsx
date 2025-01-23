import { ReactElement, useCallback, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useModale, useNavigationMAC } from '../../fournisseurs/hooks.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
} from '../../domaine/MoteurDeLiens.ts';
import { Lien } from '../../domaine/Lien.ts';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import Button from '../atomes/Button/Button.tsx';
import { useNavigueVersModifierDiagnostic } from '../../fournisseurs/ContexteNavigationMAC.tsx';

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
    <Button
      className="bouton-mac-icone-conteneur"
      variant="primary"
      onClick={surClick}
    >
      <span className="fr-icon-add-line"></span>
      <span>Créer un diagnostic</span>
    </Button>
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
          Est-ce-que le bénéficiaire a rempli le formulaire de demande
          d&apos;aide sur MonAideCyber ?
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
              Le bénéficiaire confirme avoir rempli{' '}
              <a href="/beneficier-du-dispositif/etre-aide">
                le formulaire de demande d&apos;aide
              </a>
              .
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
              Le bénéficiaire n&apos;a pas encore rempli{' '}
              <a href="/beneficier-du-dispositif/etre-aide">
                le formulaire de demande d&apos;aide
              </a>
              .
              <br />
              <br />
              <b>
                Vous devez faire valider les CGU au bénéficiaire de
                l&apos;entité aidée.
              </b>
              <br />
              L&apos;utilisation du diagnostic nécessite l&apos;acceptation des
              CGU par le bénéficiaire. Veuillez l&apos;orienter vers{' '}
              <a href="/beneficier-du-dispositif/etre-aide">
                le lien du formulaire
              </a>{' '}
              afin qu&apos;il puisse accepter les CGU avant de démarrer le
              diagnostic
              <br />
              <a
                href={`${import.meta.env['VITE_URL_MAC']}/beneficier-du-dispositif/etre-aide`}
              >
                {`${import.meta.env['VITE_URL_MAC']}/beneficier-du-dispositif/etre-aide`}
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

export type FormatLien = `/api/${string}`;
export const ComposantLancerDiagnostic = ({
  composant,
}: ProprietesComposantLancerDiagnostic) => {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { navigue } = useNavigueVersModifierDiagnostic(
    `${ROUTE_MON_ESPACE}/diagnostic`
  );

  const { affiche, ferme } = useModale();

  const lanceDiagnostic = useCallback(
    (lien: Lien) => {
      macAPI
        .execute<string, FormatLien>(
          constructeurParametresAPI()
            .url(lien.url)
            .methode(lien.methode!)
            .construis(),
          async (lienDansHeader) => await lienDansHeader
        )
        .then((lien) => {
          return navigue({
            url: lien,
            methode: 'GET',
          });
        })
        .catch((erreur) => showBoundary(erreur));
    },
    [navigationMAC, showBoundary]
  );

  const lancerDiagnostic = useCallback(async () => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'lancer-diagnostic',
      (lien: Lien) => lanceDiagnostic(lien)
    );
  }, [navigationMAC.etat, lanceDiagnostic]);

  const afficherModale = () => {
    affiche({
      titre: 'Prérequis à la réalisation du diagnostic',
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
  };

  return composant({ surClick: afficherModale });
};
