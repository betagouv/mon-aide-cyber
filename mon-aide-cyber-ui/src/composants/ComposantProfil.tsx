import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';

export const ComposantProfil = () => {
  return (
    <>
      <Header />
      <main role="main">
        <div className="mode-fonce ">
          <div className="fr-container">
            <div className="fr-grid-row">
              <h2 className="titre-profil">Mon profil</h2>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-md-8 fr-col-sm-12 section"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
