export const Footer = () => (
  <footer role="contentinfo" id="footer">
    <div className="piedpage-mac">
      <div className="piedpage-mac-logos">
        <div className="fr-footer__partners-sub">
          <ul>
            <li>
              <a
                href="https://www.ssi.gouv.fr/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <img src="/images/logo_anssi.png" alt="ANSSI" />
              </a>
            </li>
            <li>
              <a
                href="https://www.gendarmerie.interieur.gouv.fr/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <img
                  src="/images/logo_gendarmerie_nationale.svg"
                  alt="Gendarmerie Nationale"
                />
              </a>
            </li>
            <li>
              <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
                {' '}
                <img src="/images/logo_cnil.webp" alt="CNIL" />
              </a>
            </li>
            <li>
              <a
                href="https://www.cybermalveillance.gouv.fr/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <img src="/images/logo_acyma.svg" alt="CyberMalveillance" />
              </a>
            </li>
            <li>
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
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="fr-footer">
      <div className="fr-container--fluid">
        <div className="fr-col-offset-2 fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a href="/" title="Retour à l’accueil du site - MonAideCyber">
              <p className="fr-logo">
                {' '}
                République <br />
                Française
              </p>
            </a>
          </div>
          <div className="fr-footer__content fr-col-offset-2--right">
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
        <div className="fr-col-offset-2 fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                Accessibilité : non conforme
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
