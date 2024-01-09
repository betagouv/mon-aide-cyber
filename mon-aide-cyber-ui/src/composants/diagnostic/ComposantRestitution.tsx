import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useEffect, useState } from 'react';
import { useEntrepots } from '../../fournisseurs/hooks.ts';
import { useParams } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';
import { Restitution } from '../../domaine/diagnostic/Restitution.ts';
import '../../assets/styles/_restitution.scss';
import '../../assets/styles/_commun.scss';

export const ComposantRestitution = () => {
  const entrepots = useEntrepots();
  const { idDiagnostic } = useParams();
  const { showBoundary } = useErrorBoundary();
  const [restitution, setRestitution] = useState<Restitution>();

  useEffect(() => {
    entrepots
      .diagnostic()
      .restitution(idDiagnostic!)
      .then((restitution) => setRestitution(restitution))
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, idDiagnostic, showBoundary]);
  return (
    <>
      <Header />
      <main role="main">
        <div className="bandeau-violet">
          <div className="fr-grid-row">
            <a href="">Retour à la liste des bénificiaires</a>{' '}
          </div>
          <div className="fr-grid-row"></div>
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
