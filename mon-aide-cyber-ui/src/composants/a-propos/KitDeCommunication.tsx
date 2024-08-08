import HeroBloc from "../communs/HeroBloc.tsx"

function KitDeCommunication() {
  return (
    <article>
        <HeroBloc titre="Kit de communication"
          description="Vous êtes convaincus de l’utilité de MonAideCyber et souhaitez en parler autour de vous ? Retrouvez ici toutes les ressources de communication mises à votre disposition !"
          lienIcone="/images/illustration-marelle.svg" />
        <div className="fond-clair-mac">
          <div className="fr-container restitution">
            <div className="fr-grid-row">
            <div className="fr-col-md-3 fr-col-3 menu-restitution">
                <nav
                  className="fr-sidemenu fr-sidemenu--sticky"
                  aria-labelledby="fr-sidemenu-title"
                >
                  <div className="fr-sidemenu__inner">
                    <div className="fr-collapse" id="fr-sidemenu-wrapper">
                      <ul className="fr-sidemenu__list">
                        <li
                          className={`fr-sidemenu__item fr-sidemenu__item--active`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#"
                            target="_self"
                          >
                            Plaquette de présentation
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#"
                            target="_self"
                          >
                            Logos, police et couleurs
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#"
                            target="_self"
                          >
                            Illustrations
                          </a>
                        </li>
                        <li
                          className={`fr-sidemenu__item`}
                        >
                          <a
                            className="fr-sidemenu__link"
                            href="#"
                            target="_self"
                          >
                            Bonnes pratiques
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
              <div className="fr-col-md-9 fr-col-9 section">
                <h4>Récapitulatif</h4>
                <p>
                    Cette plaquette de 8 pages au format A5 est à diffuser largement par mail, sur vos réseaux sociaux ou même à imprimer. Elle détaille de façon synthétique le rôle, le fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">
                    Télécharger la plaquette MonAideCyber (pdf)
                </a>
              </div>
              <div className="fr-col-md-9 fr-col-9 section">
                <h4>Récapitulatif</h4>
                <p>
                    Cette plaquette de 8 pages au format A5 est à diffuser largement par mail, sur vos réseaux sociaux ou même à imprimer. Elle détaille de façon synthétique le rôle, le fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">
                    Télécharger la plaquette MonAideCyber (pdf)
                </a>
              </div>
              <div className="fr-col-md-9 fr-col-9 section">
                <h4>Récapitulatif</h4>
                <p>
                    Cette plaquette de 8 pages au format A5 est à diffuser largement par mail, sur vos réseaux sociaux ou même à imprimer. Elle détaille de façon synthétique le rôle, le fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">
                    Télécharger la plaquette MonAideCyber (pdf)
                </a>
              </div>
              <div className="fr-col-md-9 fr-col-9 section">
                <h4>Récapitulatif</h4>
                <p>
                    Cette plaquette de 8 pages au format A5 est à diffuser largement par mail, sur vos réseaux sociaux ou même à imprimer. Elle détaille de façon synthétique le rôle, le fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">
                    Télécharger la plaquette MonAideCyber (pdf)
                </a>
              </div>
            </div>
          </div>
        </div>
    </article>
  )
}

export default KitDeCommunication