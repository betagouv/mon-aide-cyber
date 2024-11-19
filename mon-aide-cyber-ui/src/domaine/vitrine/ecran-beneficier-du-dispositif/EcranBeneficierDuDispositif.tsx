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
import Button from '../../../composants/atomes/Button/Button.tsx';
import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { useNavigate } from 'react-router-dom';
import illustrationAutodiag from './../../../../public/images/illustration-autodiag.svg';

export const EcranBeneficierDuDispositif = () => {
  useDefilementFluide();
  const navigate = useNavigate();

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
      <section className="fond-clair-mac">
        <div className="fr-container focus-restitution-layout">
          <section>
            <TypographieH3>
              Accéder à l&apos;outil de diagnostic MonAideCyber
            </TypographieH3>
            <p>
              Réalisez vous-même le diagnostic de votre entité pour évaluer
              votre niveau en cybersécurité et mettre en place des premières
              mesures. Le diagnostic comprend une trentaine de questions, elles
              sont adaptées pour des entités avec un faible niveau de
              cybersécurité et souhaitant passer à l’action.
            </p>
            <p>
              Le diagnostic :
              <ul>
                <li>permet de faire ressortir les lacunes majeures</li>
                <li>
                  identifie les mesures prioritaires et les plus impactantes
                </li>
                <li>n’est pas exhaustif</li>
              </ul>
            </p>

            <Button
              type="button"
              onClick={() => navigate('/demande-autodiagnostic')}
            >
              J'initie un diagnostic
            </Button>
          </section>
          <section>
            <img src={illustrationAutodiag} alt="" />
          </section>
        </div>
      </section>
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
