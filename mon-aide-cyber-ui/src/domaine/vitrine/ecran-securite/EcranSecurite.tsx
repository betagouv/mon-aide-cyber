import './ecran-securite.scss';
import HeroBloc from '../../../composants/communs/HeroBloc.tsx';
import { TypographieH1 } from '../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import homologationDesktop from '../../../../public/images/homologation/encart-homologation.desktop.png';
import homologationTablet from '../../../../public/images/homologation/encart-homologation.tablette.png';
import homologationMobile from '../../../../public/images/homologation/encart-homologation.mobile.png';

export const EcranSecurite = () => {
  return (
    <main role="main" className="ecran-securite">
      <HeroBloc>
        <div id="corps" className="hero-layout">
          <section>
            <TypographieH1>Sécurité</TypographieH1>
          </section>
        </div>
      </HeroBloc>
      <section className="contenu-page-statique">
        <div className="contenu-section">
          <img
            className="encart-homologation encart-desktop"
            src={homologationDesktop}
            alt="Preuve de l'homologation de MonAideCyber sur MonServiceSecurise"
          />
          <img
            className="encart-homologation encart-tablette"
            src={homologationTablet}
            alt="Preuve de l'homologation de MonAideCyber sur MonServiceSecurise"
          />
          <img
            className="encart-homologation encart-mobile"
            src={homologationMobile}
            alt="Preuve de l'homologation de MonAideCyber sur MonServiceSecurise"
          />
          <lab-anssi-resume-pssi nomService="MonAideCyber"></lab-anssi-resume-pssi>
        </div>
      </section>
    </main>
  );
};
