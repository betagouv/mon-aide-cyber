import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import TuileActionDemandeAide from '../../../composants/communs/tuiles/TuileActionDemandeAide';
import TuileActionKitDeCommunication from '../../../composants/communs/tuiles/TuileActionKitDeCommunication';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2';
import { HeroAnnuaire } from './composants/HeroAnnuaire';
import { UUID } from '../../../types/Types';
import './ecran-annuaire.scss';
import { ListeAidants } from './composants/ListeAidants';

export type AidantAnnuaire = {
  identifiant: UUID;
  nomPrenom: string;
};
export type ReponseAidantAnnuaire = AidantAnnuaire[];

export const EcranAnnuaire = () => {
  return (
    <main role="main" className="ecran-annuaire-aidants">
      <HeroAnnuaire />
      <section className="fond-clair-mac">
        <div className="fr-container layout-annuaire">
          <ListeAidants />
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
