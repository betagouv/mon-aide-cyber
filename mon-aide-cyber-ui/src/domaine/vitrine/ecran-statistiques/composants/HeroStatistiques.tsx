import HeroBloc from '../../../../composants/communs/HeroBloc';
import statistiquesSvg from '../../../../../public/images/illustration-statistiques.svg';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1';

export const HeroStatistiques = () => {
  return (
    <HeroBloc>
      <div id="corps" className="fr-container hero-layout">
        <section>
          <TypographieH1>Statistiques</TypographieH1>
          <p>
            Nous sommes ravis de constater l’utilisation grandissante de
            MonAideCyber !
            <br />
            <br />
            Consultez ici les statistiques concernant le projet.
          </p>
        </section>
        <section>
          <img
            src={statistiquesSvg}
            alt="illustration de deux personnes de face bras croisés et souriants"
          />
        </section>
      </div>
    </HeroBloc>
  );
};
