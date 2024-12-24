import { FormEvent, useCallback, useReducer } from 'react';
import {
  cguCliquees,
  initialiseReducteur,
  reducteurValidationCGU,
  validationCGUInvalidee,
} from './reducteurValidationCGU.tsx';
import { MACAPIType, useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens, ROUTE_AIDANT } from '../MoteurDeLiens.ts';
import { Lien, ReponseHATEOAS } from '../Lien.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ValidationSignatureCGU } from '../espace-aidant/EspaceAidant.ts';
import { TypographieH2 } from '../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';

type ProprietesComposantCreationEspaceAidant = {
  macAPI: MACAPIType;
};

export const ComposantValidationSignatureCGU = ({
  macAPI,
}: ProprietesComposantCreationEspaceAidant) => {
  const [etatCreationEspaceAidant, envoie] = useReducer(
    reducteurValidationCGU,
    initialiseReducteur()
  );
  const navigationMAC = useNavigationMAC();

  const valideLesCGU = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'valider-signature-cgu',
        (lien: Lien) => {
          if (etatCreationEspaceAidant.saisieValide()) {
            const parametresAPI =
              constructeurParametresAPI<ValidationSignatureCGU>()
                .url(lien.url)
                .methode(lien.methode!)
                .corps({
                  cguValidees: etatCreationEspaceAidant.cguSignees,
                })
                .construis();
            macAPI
              .execute<ReponseHATEOAS, ReponseHATEOAS, ValidationSignatureCGU>(
                parametresAPI,
                async (json) => await json
              )
              .then((reponse) => {
                navigationMAC.navigue(
                  `${ROUTE_AIDANT}/tableau-de-bord`,
                  reponse.liens,
                  ['valider-signature-cgu']
                );
              })
              .catch((erreur) => envoie(validationCGUInvalidee(erreur)));
          }
        },
        () =>
          navigationMAC.navigue(
            `${ROUTE_AIDANT}/tableau-de-bord`,
            navigationMAC.etat
          )
      );
    },
    [navigationMAC, etatCreationEspaceAidant]
  );

  const surCGUSignees = useCallback(() => {
    envoie(cguCliquees());
  }, []);

  return (
    <>
      <div className="texte-centre">
        <TypographieH2>
          Les Conditions Générales d’Utilisation MonAideCyber évoluent !
        </TypographieH2>
      </div>
      <form onSubmit={valideLesCGU}>
        <fieldset className="fr-fieldset">
          <div className="fr-fieldset__content">
            <label className="fr-label">
              Veuillez accepter les nouvelles CGU afin d’accéder au service :
            </label>
          </div>
          <div className="fr-fieldset__content">
            <div className="fr-checkbox-group mac-radio-group">
              <input
                type="checkbox"
                id="cgu-aidant"
                name="cgu-aidant"
                onChange={surCGUSignees}
                checked={etatCreationEspaceAidant.cguSignees}
              />
              <label className="fr-label" htmlFor="cgu-aidant">
                J&apos;accepte les &nbsp;
                <b>
                  <a href="/cgu" target="_blank">
                    conditions générales d&apos;utilisation
                  </a>
                </b>
                &nbsp; de MonAideCyber
              </label>
              {etatCreationEspaceAidant.erreur?.cguSignees?.texteExplicatif}
            </div>
            <div className="fr-grid-row fr-grid-row--right">
              <button
                type="submit"
                className="fr-btn bouton-mac bouton-mac-primaire"
              >
                Valider
              </button>
            </div>
          </div>
          <div className="fr-mt-2w">
            {etatCreationEspaceAidant.champsErreur}
          </div>
        </fieldset>
      </form>
    </>
  );
};

export const FormulaireValidationSignatureCGU = () => {
  return <ComposantValidationSignatureCGU macAPI={useMACAPI()} />;
};
