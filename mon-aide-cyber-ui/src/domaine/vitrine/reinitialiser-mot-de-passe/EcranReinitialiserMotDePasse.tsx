import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import illustrationSecuritePostesSvg from '../../../../public/images/illustration-securite-des-postes.svg';
import { FormulaireReinitialiserMotDePasseConnecte } from './formulaire-reinitialiser-mot-de-passe/FormulaireReinitialiserMotDePasseConnecte.tsx';
import 'ecran-reinitialiser-mot-de-passe.scss';
import { useSearchParams } from 'react-router-dom';

export const EcranReinitialiserMotDePasse = () => {
  const [params] = useSearchParams();
  const parametresUrl = new URLSearchParams(params);

  const tokenDeReinitialisation = parametresUrl.get('token')!;

  console.log('token actif', tokenDeReinitialisation);

  return (
    <main role="main" className="ecran-reinitialiser-mot-de-passe">
      <div>
        <div className="fr-container formulaire-colonne-gauche">
          <TypographieH3 style={{ textAlign: 'center' }}>
            Réinitialisation de votre mot de passe
          </TypographieH3>
          <FormulaireReinitialiserMotDePasseConnecte
            token={tokenDeReinitialisation}
          />
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img src={illustrationSecuritePostesSvg} alt="" />
      </div>
    </main>
  );
};
