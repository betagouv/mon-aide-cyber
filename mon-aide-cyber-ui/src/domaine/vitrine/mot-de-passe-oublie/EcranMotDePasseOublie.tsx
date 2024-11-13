import './ecran-mot-de-passe-oublie.scss';
import { FormulaireMotDePasseOublieConnecte } from './formulaire-mot-de-passe-oublie/FormulaireMotDePasseOublie.tsx';
import illustrationSecuritePostesSvg from '../../../../public/images/illustration-securite-des-postes.svg';
import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';

export const EcranMotDePasseOublie = () => {
  return (
    <main role="main" className="ecran-mot-de-passe-oublie">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container">
          <TypographieH3 style={{ textAlign: 'center' }}>
            Réinitialisation de votre mot de passe
          </TypographieH3>
          <FormulaireMotDePasseOublieConnecte />
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img src={illustrationSecuritePostesSvg} alt="" />
      </div>
    </main>
  );
};
