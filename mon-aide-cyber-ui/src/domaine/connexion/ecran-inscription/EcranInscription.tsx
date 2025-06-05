import illustrationSecuritePostesSvg from '../../../../public/images/illustration-securite-des-postes.svg';
import { BoutonProConnect } from '../composants/BoutonProConnect.tsx';
import './ecran-inscription.scss';
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';

export const EcranInscription = () => {
  useTitreDePage("S'inscrire");

  return (
    <main role="main" className="ecran-inscription">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container texte-centre">
          <TypographieH2>Créez votre compte MonAideCyber</TypographieH2>
          <BoutonProConnect />
          <span>
            Vous avez déjà un compte ? <a href="/connexion">Se connecter</a>
          </span>
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
