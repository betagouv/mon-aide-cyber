import HeroBloc from '../../../../composants/communs/HeroBloc';
import duoAidants from '../../../../../public/images/illustration-deux-personnes.svg';
import { Link } from 'react-router-dom';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1';

export const HeroDevenirAidant = () => {
  return (
    <HeroBloc>
      <div id="corps" className="fr-container hero-layout">
        <section>
          <TypographieH1>Devenir Aidant</TypographieH1>
          <p>
            Vous souhaitez accompagner des entités dans la réalisation d&apos;un
            diagnostic de maturité cyber ? <br />
            Pour cela, rejoignez la communauté des Aidants MonAideCyber !
            Inscrivez-vous pour être formé par l&apos;ANSSI
          </p>
          <div>
            <Link to="#formulaire-formation">
              <button
                type="button"
                className="bouton-mac bouton-mac-primaire-inverse"
              >
                Je m&apos;inscris à une formation
              </button>
            </Link>
          </div>
        </section>
        <section>
          <img
            src={duoAidants}
            alt="illustration de deux personnes de face bras croisés et souriants"
          />
        </section>
      </div>
    </HeroBloc>
  );
};
