import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import TuileActionDevenirAidant from '../../../composants/communs/tuiles/TuileActionDevenirAidant';
import TuileActionStatistiques from '../../../composants/communs/tuiles/TuileActionStatistiques';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2';
import useDefilementFluide from '../../../hooks/useDefilementFluide';
import { Temoignages } from '../ecran-devenir-aidant/composants/Temoignages';
import { FocusRestitution } from './composants/FocusRestitution';
import { FonctionnementDispositif } from './composants/FonctionnementDispositif';
import { FormulaireDemandeEtreAide } from './composants/FormulaireDemandeEtreAide/FormulaireDemandeEtreAide';
import { HeroDemandeAide } from './composants/HeroDemandeAide';
import { QuiEstConcerne } from './composants/QuiEstConcerne';
import './ecran-beneficier-du-dispositif.scss';

export const EcranBeneficierDuDispositif = () => {
  useDefilementFluide();

  return (
    <main role="main" className="ecran-beneficier-du-dispositif">
      <HeroDemandeAide />
      <QuiEstConcerne />
      <FonctionnementDispositif />
      <FocusRestitution />
      <section id="formulaire-demande-aide" className="fond-clair-mac">
        <div className="fr-container">
          <FormulaireDemandeEtreAide />
        </div>
      </section>
      <Temoignages
        verbatims={[
          {
            id: 1,
            auteur: 'Un bénéficiaire de Seine Maritime (76)',
            commentaire:
              'Cela m’a permis d’avoir une cartographie globale et notre positionnement en terme en cybersécurité.',
          },
          {
            id: 2,
            auteur: 'Un bénéficiaire de Dordogne (24)',
            commentaire: 'C’est une feuille de route, c’est ça qui me séduit !',
          },
        ]}
      />
      <section className="participer fr-pt-4w">
        <div className="fr-container conteneur-participer">
          <div className="fr-col-12">
            <TypographieH2>Pour aller plus loin</TypographieH2>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionDevenirAidant />
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionStatistiques />
            </div>
          </div>
        </div>
      </section>
      <FormulaireDeContact />
    </main>
  );
};
