import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { ComposantFormulaireCreationEspaceAidant } from './ComposantFormulaireCreationEspaceAidant.tsx';

export const ComposantCreationEspaceAidant = () => {
  return (
    <>
      <Header />
      <main role="main">
        <div className="mode-fonce fr-pt-md-6w fr-pb-md-7w">
          <div className="fr-container">
            <div className="fr-grid-row">
              <div>
                <h3>Création de votre espace Aidant MonAideCyber</h3>
                <p>Bienvenue dans la communauté !</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac creation-espace-aidant">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              <div className="fr-col-8">
                <ComposantFormulaireCreationEspaceAidant />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
