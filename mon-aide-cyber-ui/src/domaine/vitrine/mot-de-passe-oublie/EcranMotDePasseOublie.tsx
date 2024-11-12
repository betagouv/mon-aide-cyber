import './ecran-mot-de-passe-oublie.scss';
import { FormulaireMotDePasseOublie } from './formulaire-mot-de-passe-oublie/FormulaireMotDePasseOublie.tsx';
import illustrationSecuritePostesSvg from '../../../../public/images/illustration-securite-des-postes.svg';

export const EcranMotDePasseOublie = () => {
  return (
    <main role="main" className="ecran-mot-de-passe-oublie">
      <div>
        <div className="fr-container">
          <FormulaireMotDePasseOublie />
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img src={illustrationSecuritePostesSvg} alt="" />
      </div>
    </main>
  );
};
