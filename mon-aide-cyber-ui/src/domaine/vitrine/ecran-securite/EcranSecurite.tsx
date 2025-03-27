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
          <p>
            L‘ANSSI soumet MonAideCyber à un rythme d‘homologation soutenu (tous
            les 6 mois) dans le cadre d‘une démarche de renforcement continue de
            la sécurité du service numérique.
          </p>
          <p>
            MonAideCyber est hébergé chez{' '}
            <a
              href="https://www.clever-cloud.com/fr/"
              target="_blank"
              rel="noreferrer"
            >
              Clever Cloud
            </a>{' '}
            prenant appui sur Cloud Temple qualifié SecNumCloud.
          </p>
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
        </div>
      </section>
    </main>
  );
};
