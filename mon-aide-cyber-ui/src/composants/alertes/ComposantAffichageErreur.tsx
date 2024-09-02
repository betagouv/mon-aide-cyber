import { Header } from '../layout/Header.tsx';
import { Footer } from '../layout/Footer.tsx';
import { LienMAC } from '../LienMAC.tsx';
import { useAuthentification } from '../../fournisseurs/hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { Action, Lien, Liens } from '../../domaine/Lien.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { FallbackProps } from 'react-error-boundary';

type ProprietesComposantAffichageErreur = Omit<FallbackProps, 'error'> & {
  error: { message: string; liens?: Liens; titre?: string };
};

const ActionsDisponibles: Map<Action, (lien: Lien) => ReactElement> = new Map([
  [
    'afficher-tableau-de-bord',
    (lien: Lien) => (
      <>
        Revenir au <a href={lien.route}>tableau de bord</a>.
      </>
    ),
  ],
]);

export const ComposantAffichageErreur = ({
  error,
}: ProprietesComposantAffichageErreur) => {
  const [titreLien, setTitreLien] = useState('Accueil - MonAideCyber');
  const [route, setRoute] = useState('/');

  const authentification = useAuthentification();

  useEffect(() => {
    if (authentification.utilisateur) {
      setTitreLien('Espace Aidant - MonAideCyber');
      setRoute('/tableau-de-bord');
    }
  }, [authentification.utilisateur]);

  const actions = error.liens ? (
    <div className="fond-clair-mac">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-md-8 fr-col-sm-12 section">
            <ul>
              {Object.entries(
                new MoteurDeLiens(error.liens).extrais() || []
              ).map(
                ([nom, lien]) =>
                  ActionsDisponibles.get(nom as Action)?.(lien) || <></>
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
