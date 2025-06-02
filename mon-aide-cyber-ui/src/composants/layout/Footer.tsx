import { LiensFooter } from './LiensFooter.tsx';
import './footer-layout.scss';

export const Footer = () => (
  <footer className="footer" role="contentinfo" id="footer">
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
