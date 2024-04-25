import { useEffect, useState } from 'react';
import { useAuthentification } from '../fournisseurs/hooks.ts';
import { ComposantLancerDiagnostic } from './diagnostic/ComposantLancerDiagnostic.tsx';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';
import { LienMAC } from './LienMAC.tsx';

export const TableauDeBord = () => {
  const [nomPrenom, setNomPrenom] = useState<string>('');
  const authentification = useAuthentification();

  useEffect(() => {
    setNomPrenom(authentification.utilisateur?.nomPrenom || '');
  }, [authentification, setNomPrenom]);

  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <main role="main">
        <div className="mode-fonce">
          <div className="fr-container">
            <div className="fr-grid-row contenu">
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
