import { useEffect, useState } from 'react';
import { useAuthentification } from '../fournisseurs/hooks.ts';
import { ComposantLancerDiagnostic } from './diagnostic/ComposantLancerDiagnostic.tsx';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';

export const TableauDeBord = () => {
  const [nomPrenom, setNomPrenom] = useState<string>('');
  const authentification = useAuthentification();

  useEffect(() => {
    setNomPrenom(authentification.utilisateur?.nomPrenom || '');
  }, [authentification, setNomPrenom]);

  return (
    <>
      <Header />
      <main role="main">
        <div className="mode-fonce">
          <div className="fr-grid-row fr-grid-row--gutters fr-pt-8w">
            <div className="fr-col-12 fr-col-offset-2 fr-pb-8w">
              <h2>Bonjour {nomPrenom} !</h2>
            </div>
          </div>
        </div>
        <div className="fr-container--fluid">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--right tableau-de-bord">
            <div className="fr-col-offset-1--right">
              <ComposantLancerDiagnostic style="bouton-mac bouton-mac-primaire" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
