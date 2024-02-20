import { SeConnecter } from './authentification/SeConnecter.tsx';

export const Header = () => (
  <header role="banner" className="fr-header">
    <div className="fr-header__body">
      <div className="fr-container">
        <div className="fr-header__body-row">
          <div className="fr-header__brand fr-enlarge-link">
            <div className="fr-header__brand-top">
              <div className="fr-header__logo">
                <p className="fr-logo">
                  {' '}
                  République <br />
                  Française
                </p>
              </div>
              <div className="fr-header__operator">
                <img
                  style={{ maxWidth: '3.5rem' }}
                  className="fr-responsive-img"
                  src="/images/logo_anssi.png"
                  alt="ANSSI"
                />
              </div>
              <div className="fr-header__navbar icone-se-connecter-mobile">
                <button className="fr-btn fr-btn--lg fr-icon-account-circle-line">
                  <SeConnecter />
                </button>
              </div>
            </div>
            <div className="fr-header__service fr-col-md-5">
              <a href="/" title="Accueil - MonAideCyber">
                <img
                  className="fr-responsive-img taille-reduite-en-mobile"
                  src="/images/logo_mac.svg"
                  alt="ANSSI"
                />
              </a>
            </div>
          </div>
          <div className="fr-header__tools">
            <div className="fr-header__tools-links">
              <ul className="fr-btns-group">
                <li>
                  <SeConnecter />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
