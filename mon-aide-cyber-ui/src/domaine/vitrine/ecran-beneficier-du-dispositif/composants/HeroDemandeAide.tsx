import { Link } from 'react-router-dom';
import HeroBloc from '../../../../composants/communs/HeroBloc';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1';
import dialogueSvg from '../../../../../public/images/illustration-echange.svg';

export const HeroDemandeAide = () => {
  return (
    <HeroBloc>
      <div id="corps" className="fr-container hero-layout">
        <section>
          <TypographieH1>Faire une demande MonAideCyber</TypographieH1>
          <p>
            Vous souhaitez bénéficier du dispositif MonAideCyber ? Rien de plus
            simple !
            <br />
            <br />
            Remplissez le formulaire ci-dessous afin d’être mis en relation avec
            un Aidant de proximité et réaliser un diagnostic de maturité cyber.
          </p>
          <div>
            <Link to="#formulaire-demande-aide">
              <button
                type="button"
                className="bouton-mac bouton-mac-primaire-inverse"
              >
                Je fais une demande
              </button>
            </Link>
          </div>
        </section>
        <section>
          <img
            src={dialogueSvg}
            alt="illustration de deux personnes de face bras croisés et souriants"
          />
        </section>
      </div>
    </HeroBloc>
  );
};
