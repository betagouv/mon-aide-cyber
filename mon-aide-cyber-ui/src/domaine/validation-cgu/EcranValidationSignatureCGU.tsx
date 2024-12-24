import { FormulaireValidationSignatureCGU } from './FormulaireValidationSignatureCGU.tsx';
import illustrationValidationCGU from '../../../public/images/illustration-mesures.svg';
import './ecran-validation-cgu.scss';
import { Header } from '../../composants/layout/Header.tsx';
import { LienMAC } from '../../composants/LienMAC.tsx';
import { Footer } from '../../composants/layout/Footer.tsx';

export const EcranValidationSignatureCGU = () => {
  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
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
