import { Header } from '../layout/Header.tsx';
import { Footer } from '../layout/Footer.tsx';
import { LienMAC } from '../LienMAC.tsx';
import { ReactElement, useEffect, useState } from 'react';
import { Action, Liens } from '../../domaine/Lien.ts';
import { MoteurDeLiens, ROUTE_AIDANT } from '../../domaine/MoteurDeLiens.ts';
import { FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { useNavigationMAC, useUtilisateur } from '../../fournisseurs/hooks.ts';
import { Link } from 'react-router-dom';

type ProprietesComposantAffichageErreur = Omit<FallbackProps, 'error'> & {
  error: { message: string; liens?: Liens; titre?: string };
};

const ActionsDisponibles: Map<Action, () => ReactElement> = new Map([
  [
    'afficher-tableau-de-bord',
    () => (
      <>
        Revenir au{' '}
        <Link to={`${ROUTE_AIDANT}/tableau-de-bord`}>tableau de bord</Link>.
      </>
    ),
  ],
]);

export const ComposantAffichageErreur = ({
  error,
}: ProprietesComposantAffichageErreur) => {
  const [titreLien, setTitreLien] = useState('Accueil - MonAideCyber');
  const [route, setRoute] = useState('/');
  const { utilisateur } = useUtilisateur();
  const { resetBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();

  useEffect(() => {
    if (utilisateur) {
      setTitreLien('Espace Aidant - MonAideCyber');
      setRoute('/aidant/tableau-de-bord');
    }
  }, [utilisateur]);

  useEffect(() => {
    if (
      error.liens &&
      new MoteurDeLiens(error.liens).existe('valider-signature-cgu')
    ) {
      resetBoundary();
      navigationMAC.navigue('/aidant/valide-signature-cgu', error.liens);
    }
  }, [navigationMAC]);

  const actions = error.liens ? (
    <div className="fond-clair-mac">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-md-8 fr-col-sm-12 section">
            <ul>
              {Object.entries(error.liens || []).map(
                ([nom]) => ActionsDisponibles.get(nom as Action)?.() || <></>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );

  return (
    <>
      <Header lienMAC={<LienMAC titre={titreLien} route={route} />} />
      <main role="main" className="composant-erreur">
        <div role="alert" className="mode-fonce">
          <div className="fr-container">
            <div className="contenu">
              <h2>{error.titre || 'Une erreur est survenue :'}</h2>
              <p>{error.message}</p>
            </div>
          </div>
        </div>
        <div>{actions}</div>
      </main>
      <Footer />
    </>
  );
};
