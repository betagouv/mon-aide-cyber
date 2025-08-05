import { CharteAidant } from './CharteAidant.tsx';
import { useDonneesSEO } from '../hooks/useDonneesSEO.ts';

export const EcranCharteAidant = () => {
  useDonneesSEO("Charte de l'Aidant cyber");

  return (
    <main role="main">
      <div className="fr-container mac-contenu-charte">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-8 fr-col-lg-9">
            <CharteAidant />
          </div>
        </div>
      </div>
    </main>
  );
};
