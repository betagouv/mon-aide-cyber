export const Footer = () => (
  <footer role="contentinfo" id="footer">
    <div className="piedpage-mac fr-container">
      <div className="piedpage-mac-logos fr-grid-row fr-grid-row--middle">
        <div className="fr-col-md-2 fr-col-sm-12">
          <a href="https://www.ssi.gouv.fr/" target="_blank" rel="noreferrer">
            {' '}
            <img src="/images/logo_anssi.svg" alt="ANSSI" />
          </a>
        </div>
        <div className="fr-col-md-2 fr-col-sm-12">
          <a
            href="https://www.gendarmerie.interieur.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            <img
              id="logo-gendarmerie-nationale"
              src="/images/logo_gendarmerie_nationale.svg"
              alt="Gendarmerie Nationale"
            />
          </a>
        </div>
        <div className="fr-col-md-2 fr-col-sm-12">
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            {' '}
            <img src="/images/logo_cnil.svg" alt="CNIL" />
          </a>
        </div>
        <div className="fr-col-md-2 fr-col-sm-12">
          <a
            href="https://www.cybermalveillance.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            <img
              id="logo-acyma"
              src="/images/logo_acyma.svg"
              alt="CyberMalveillance"
            />
          </a>
        </div>
        <div className="fr-col-md-2 fr-col-sm-12">
          <a
            href="https://www.police-nationale.interieur.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            <img
              src="/images/logo_police_nationale.svg"
              alt="Police Nationale"
            />
          </a>
        </div>
      </div>
    </div>
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
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/accessibilite">
                Accessibilité : non conforme
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/mentions-legales">
                Mentions légales
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/charte-aidant">
                La charte de l&apos;aidant
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/cgu">
                Les CGU
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
