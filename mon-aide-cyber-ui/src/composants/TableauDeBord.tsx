import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useUtilisateurAuthentifie } from '../fournisseurs/hooks.ts';
import { ComposantLancerDiagnostic } from './diagnostic/ComposantLancerDiagnostic.tsx';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';

export const TableauDeBord = () => {
  const { showBoundary } = useErrorBoundary();
  const [nomPrenom, setNomPrenom] = useState<string>('');
  const utilisateurAuthentifie = useUtilisateurAuthentifie();

  useEffect(() => {
    utilisateurAuthentifie
      .then((aidant) => setNomPrenom(aidant.nomPrenom))
      .catch((erreur) => showBoundary(erreur));
  }, [setNomPrenom, showBoundary, utilisateurAuthentifie]);

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
