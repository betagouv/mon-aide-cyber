import HeroBloc from '../../../../composants/communs/HeroBloc';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1';
import annuaireAidantSvg from '../../../../../public/images/illustration-annuaire-aidant.svg';

export const HeroAnnuaire = () => {
  return (
    <HeroBloc>
      <div id="corps" className="hero-layout">
        <section>
          <TypographieH1>Annuaire des Aidants</TypographieH1>
          <p>
            Consultez l’annuaire des aidants MonAideCyber, formés et outillés
            par l’ANSSI pour réaliser des diagnostics sur tout le territoire.
          </p>
        </section>
        <section>
          <img
            src={annuaireAidantSvg}
            alt="illustration de deux personnes de face bras croisés et souriants"
          />
        </section>
      </div>
    </HeroBloc>
  );
};
