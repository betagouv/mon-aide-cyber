import { Footer } from '../Footer';
import { Header } from '../Header';
import { SaisieInformations } from './SaisieInformations.tsx';

export const ComposantParcoursCGUAide = () => {
  const etape = <SaisieInformations />;
  return (
    <>
      <Header />
      <main role="main" className="profil">
        <div className="mode-fonce">
          <div className="fr-container">
            <div className="fr-grid-row">
              <h2 className="titre-profil">
                Vous souhaitez bénéficier de MonAideCyber
              </h2>
              <p>
                Afin de vous diriger au mieux, merci de répondre à quelques
                questions.
              </p>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-md-8 fr-col-sm-12 section">{etape}</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
