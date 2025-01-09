import { ActionsPiedDePage } from '../../../composants/communs/ActionsPiedDePage';
import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import useDefilementFluide from '../../../hooks/useDefilementFluide';
import { verbatims } from '../../../infrastructure/donnees/Verbatims';
import { CommentDevenirAidant } from './composants/CommentDevenirAidant';
import { HeroDevenirAidant } from './composants/HeroDevenirAidant';
import { LesEngagementsDeLAidant } from './composants/LesEngagementsDeLAidant';
import { QuiEstConcerne } from './composants/QuiEstConcerne';
import { Temoignages } from './composants/Temoignages';
import './ecran-devenir-aidant.scss';
import { CapteurFormulaireDevenirAidant } from '../../gestion-demandes/devenir-aidant/formulaire-devenir-aidant/CapteurFormulaireDevenirAidant.tsx';

export const EcranDevenirAidant = () => {
  useDefilementFluide();

  return (
    <main role="main" className="ecran-devenir-aidant">
      <HeroDevenirAidant />
      <QuiEstConcerne />
      <CommentDevenirAidant />
      <LesEngagementsDeLAidant />
      <section id="formulaire-formation" className="fond-clair-mac">
        <CapteurFormulaireDevenirAidant />
      </section>
      <Temoignages verbatims={verbatims} />
      <ActionsPiedDePage className="fond-clair-mac fr-pt-4w" />
      <FormulaireDeContact />
    </main>
  );
};
