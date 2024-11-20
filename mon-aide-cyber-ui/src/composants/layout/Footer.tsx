import { LiensFooter } from './LiensFooter.tsx';
import './footer-layout.scss';

export const Footer = () => (
  <footer role="contentinfo" id="footer">
    <section className="fr-container">
      <div className="footer-logos">
        <a
          className="logo logo1"
          href="https://www.interieur.gouv.fr/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/images/logo_comcybermi.svg" alt="Logo de COMCYBER-MI" />
        </a>
        <a
          className="logo logo2"
          href="https://www.gendarmerie.interieur.gouv.fr/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/images/logo_gendarmerie_nationale.svg"
            alt="Logo de la Gendarmerie Nationale"
          />
        </a>
        <a
          className="logo logo3"
          href="https://www.cnil.fr"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/images/logo_cnil.svg"
            alt="Logo de la Commission Nationale de l’Informatique et des Libertés"
          />
        </a>
        <a
          className="logo logo4"
          href="https://www.cybermalveillance.gouv.fr/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/images/logo_acyma.svg" alt="Logo de CyberMalveillance" />
        </a>
        <a
          className="logo logo5"
          href="https://www.police-nationale.interieur.gouv.fr/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/images/logo_police_nationale.svg"
            alt="Logo de la Police Nationale"
          />
        </a>
      </div>
    </section>
    <div className="fr-footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a href="/" title="Retour à l’accueil du site - MonAideCyber">
              <p className="fr-logo">
                {' '}
                République <br />
                Française
              </p>
            </a>
            <a
              className="fr-footer__brand-link"
              href="/"
              title="Retour à l'accueil du site - MonAideCyber"
            >
              <img
                style={{ width: '120px', marginLeft: '2rem' }}
                className="fr-responsive-img"
                src="/images/logo_anssi.svg"
                alt="ANSSI"
              />
            </a>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              MonAideCyber aide les entités publiques et privées sensibilisées à
              la sécurité informatique à passer à l’action. Le dispositif
              MonAideCyber est développé par l&apos;Agence Nationale de la
              Sécurité des Systèmes d&apos;Information, en lien avec BetaGouv et
              la Direction interministérielle du numérique.
            </p>
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://legifrance.gouv.fr"
                  rel="noreferrer"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://gouvernement.fr"
                  rel="noreferrer"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://service-public.fr"
                  rel="noreferrer"
                >
                  service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  href="https://data.gouv.fr"
                  rel="noreferrer"
                >
                  data.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <LiensFooter />
        </div>
      </div>
    </div>
  </footer>
);
