import { FormulaireAuthentification } from '../authentification/FormulaireAuthentification.tsx';
import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';

export const ComposantConnexion = () => {
  return (
    <>
      <Header />
      <main role="main" className="connectez-vous">
        <div className="fond-clair-mac">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-md-6 fr-col-sm-12 section">
                <div className="texte-centre">
                  <h2>Connectez-vous</h2>
                  <p>à votre espace Aidant</p>
                </div>
                <FormulaireAuthentification />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
