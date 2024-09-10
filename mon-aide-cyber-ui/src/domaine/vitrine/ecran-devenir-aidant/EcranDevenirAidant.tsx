import { ActionsPiedDePage } from '../../../composants/communs/ActionsPiedDePage';
import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact';
import useDefilementFluide from '../../../hooks/useDefilementFluide';
import { FormulaireDevenirAidant } from '../../gestion-demandes/devenir-aidant/formulaire-devenir-aidant/FormulaireDevenirAidant';
import { CommentDevenirAidant } from './composants/CommentDevenirAidant';
import { HeroDevenirAidant } from './composants/HeroDevenirAidant';
import { LesEngagementsDeLAidant } from './composants/LesEngagementsDeLAidant';
import { QuiEstConcerne } from './composants/QuiEstConcerne';
import { Temoignages, Verbatim } from './composants/Temoignages';
import './ecran-devenir-aidant.scss';

const verbatims: Verbatim[] = [
  {
    id: 1,
    auteur: 'Un Aidant de la Réunion (974)',
    commentaire:
      "Encore merci pour cet outil qui, une fois la communauté d'aidants réunionnaise structurée et formée, nous aidera grandement dans le passage à l'échelle.",
  },
  {
    id: 2,
    auteur: 'Un Aidant, réserviste de la Police, du Rhône (69)',
    commentaire:
      'MonAideCyber remplit très bien sa mission, et le fait de pouvoir tout de suite donner un rapport aux interlocteurs est un réel atout.',
  },
];

export const EcranDevenirAidant = () => {
  useDefilementFluide();

  return (
    <main role="main" className="ecran-devenir-aidant">
      <HeroDevenirAidant />
      <QuiEstConcerne />
      <CommentDevenirAidant />
      <LesEngagementsDeLAidant />
      <section id="formulaire-formation" className="fond-clair-mac">
        <FormulaireDevenirAidant />
      </section>
      <Temoignages verbatims={verbatims} />
      <ActionsPiedDePage className="fond-clair-mac fr-pt-4w" />
      <FormulaireDeContact />
    </main>
  );
};
