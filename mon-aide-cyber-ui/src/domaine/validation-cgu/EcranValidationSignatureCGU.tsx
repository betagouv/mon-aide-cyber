import { FormulaireValidationSignatureCGU } from './FormulaireValidationSignatureCGU.tsx';
import illustrationValidationCGU from '../../../public/images/illustration-mesures.svg';
import './ecran-validation-cgu.scss';
import { LienMAC } from '../../composants/LienMAC.tsx';
import { Footer } from '../../composants/layout/Footer.tsx';
import { HeaderAidant } from '../../composants/layout/HeaderAidant.tsx';

export const EcranValidationSignatureCGU = () => {
  return (
    <>
      <HeaderAidant
        lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />}
      />
      <main role="main" className="ecran-validation-cgu">
        <div className="formulaire-colonne-gauche">
          <div className="fr-container">
            <FormulaireValidationSignatureCGU />
          </div>
        </div>
        <div className="fond-clair-mac icone-colonne-droite">
          <img
            src={illustrationValidationCGU}
            alt="Illustration d’une personne passant en revue une liste de tâche."
          />
        </div>
      </main>
      <Footer />
    </>
  );
};
