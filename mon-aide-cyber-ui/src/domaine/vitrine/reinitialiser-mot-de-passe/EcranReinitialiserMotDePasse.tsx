import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import illustrationSecuritePostesSvg from '../../../../public/images/illustration-securite-des-postes.svg';
import { CapteurFormulaireReinitialiserMotDePasse } from './formulaire-reinitialiser-mot-de-passe/CapteurFormulaireReinitialiserMotDePasse.tsx';
import './ecran-reinitialiser-mot-de-passe.scss';
import { useSearchParams } from 'react-router-dom';
import { useDonneesSEO } from '../../../hooks/useDonneesSEO.ts';

export const EcranReinitialiserMotDePasse = () => {
  useDonneesSEO('Réinitialiser mot de passe');

  const [params] = useSearchParams();
  const parametresUrl = new URLSearchParams(params);

  const tokenDeReinitialisation = parametresUrl.get('token')!;

  return (
    <main role="main" className="ecran-reinitialiser-mot-de-passe">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container">
          <TypographieH3 className="text-center">
            Réinitialisation de votre mot de passe
          </TypographieH3>
          <CapteurFormulaireReinitialiserMotDePasse
            token={tokenDeReinitialisation}
          />
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
