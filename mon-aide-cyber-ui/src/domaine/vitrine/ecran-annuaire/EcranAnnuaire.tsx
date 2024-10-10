import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import TuileActionDemandeAide from '../../../composants/communs/tuiles/TuileActionDemandeAide';
import TuileActionKitDeCommunication from '../../../composants/communs/tuiles/TuileActionKitDeCommunication';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2';
import { CarteAidant } from './composants/CarteAidant';
import { HeroAnnuaire } from './composants/HeroAnnuaire';

export const EcranAnnuaire = () => {
  return (
    <main role="main" className="ecran-annuaire-aidants">
      <HeroAnnuaire />
      <section className="fond-clair-mac">
        <div className="fr-container cartes-aidants">
          <CarteAidant nomPrenom="Marc ETOURNEAU" />
          <CarteAidant nomPrenom="Marc ETOURNEAU" />
          <CarteAidant nomPrenom="Marc ETOURNEAU" />
          <CarteAidant nomPrenom="Marc ETOURNEAU" />
        </div>
      </section>
      <section className="fond-clair-mac fr-pt-4w participer">
        <div className="fr-container conteneur-participer">
          <div className="fr-col-12">
            <TypographieH2>Vous souhaitez participer ?</TypographieH2>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionDemandeAide />
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionKitDeCommunication />
            </div>
          </div>
        </div>
      </section>
      <FormulaireDeContact />
    </main>
  );
};
