import './ecran-mot-de-passe-oublie.scss';
import illustrationSecuritePostesSvg from '../../../../public/images/illustration-securite-des-postes.svg';
import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { CapteurFormulaireMotDePasseOublie } from './formulaire-mot-de-passe-oublie/CapteurFormulaireMotDePasseOublie.tsx';
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';

export const EcranMotDePasseOublie = () => {
  useTitreDePage('Mot de passe oublié');

  return (
    <main role="main" className="ecran-mot-de-passe-oublie">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container">
          <TypographieH3 className="text-center">
            Réinitialisation de votre mot de passe
          </TypographieH3>
          <CapteurFormulaireMotDePasseOublie />
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img
          src={illustrationSecuritePostesSvg}
          alt="illustration de deux écrans de connexion"
        />
      </div>
    </main>
  );
};
