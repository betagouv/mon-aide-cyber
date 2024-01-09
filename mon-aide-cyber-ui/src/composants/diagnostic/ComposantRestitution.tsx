import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useCallback, useEffect, useState } from 'react';
import { useEntrepots } from '../../fournisseurs/hooks.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';
import { Restitution } from '../../domaine/diagnostic/Restitution.ts';
import '../../assets/styles/_restitution.scss';
import '../../assets/styles/_commun.scss';

export const ComposantRestitution = () => {
  const entrepots = useEntrepots();
  const { idDiagnostic } = useParams();
  const { showBoundary } = useErrorBoundary();
  const [restitution, setRestitution] = useState<Restitution>();
  const navigate = useNavigate();

  useEffect(() => {
    entrepots
      .diagnostic()
      .restitution(idDiagnostic!)
      .then((restitution) => setRestitution(restitution))
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, idDiagnostic, showBoundary]);

  const modifierLeDiagnostic = useCallback(
    () => navigate(`/diagnostic/${idDiagnostic}`),
    [idDiagnostic, navigate],
  );

  return (
    <>
      <Header />
      <main role="main">
        <div className="bandeau-violet fr-pt-md-4w fr-pb-md-8w">
          <div className="fr-container">
            <div className="fr-grid-row">
              <div>
                <i className="mac-icone-retour" />
                <a href="/tableau-de-bord">
                  Retour à la liste des bénéficiaires
                </a>
              </div>
            </div>
            <div className="fr-grid-row fr-pt-md-2w">
              <div className="identifiant-diagnostic">
                ID {idDiagnostic?.substring(0, 8)}
              </div>
            </div>
            <div className="fr-grid-row fr-grid-row--right">
              <div className="fr-pl-2w">
                <button
                  className={`fr-btn fr-btn--icon-left fr-icon-download-line bouton-mac bouton-mac-secondaire-inverse`}
                  disabled={true}
                >
                  Télécharger
                </button>
              </div>
              <div className="fr-pl-2w">
                <button
                  className={`fr-btn fr-btn--icon-left fr-icon-pencil-line bouton-mac bouton-mac-primaire-inverse`}
                  onClick={modifierLeDiagnostic}
                >
                  Modifier le diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container restitution">
            <div className="fr-grid-row">
              <div className="fr-col-md-3 fr-col-3">MENU</div>
              <div className="fr-col-md-9 fr-col-9 section">
                <h3>Récapitulatif</h3>
                <div>INFORMATIONS</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: restitution?.indicateurs || '',
                  }}
                ></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: restitution?.mesuresPrioritaires || '',
                  }}
                ></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: restitution?.autresMesures || '',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
