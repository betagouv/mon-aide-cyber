import HeroBloc from '../../../../composants/communs/HeroBloc.tsx';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import statistiquesSvg from '../../../../../public/images/illustration-qui-est-concerne.svg';

export const HeroRelaisAssociatifs = () => {
  return (
    <HeroBloc>
      <div id="corps" className="fr-container hero-layout">
        <section>
          <TypographieH1>Nos relais associatifs</TypographieH1>
          <p>
            MonAideCyber collabore avec des associations locales présentes sur
            l‘ensemble du territoire. Les membres de ces associations peuvent
            effectuer des diagnostics, et les utilisateurs du dispositif ont la
            possibilité de les contacter pour y adhérer et devenir AidantcCyber.
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
