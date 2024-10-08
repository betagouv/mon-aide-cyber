import { FormulaireCreationEspaceAidant } from './FormulaireCreationEspaceAidant.tsx';
import { Header } from '../../../composants/layout/Header.tsx';
import { LienMAC } from '../../../composants/LienMAC.tsx';
import { Footer } from '../../../composants/layout/Footer.tsx';

export const EcranCreationEspaceAidant = () => {
  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
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
                <FormulaireCreationEspaceAidant />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
