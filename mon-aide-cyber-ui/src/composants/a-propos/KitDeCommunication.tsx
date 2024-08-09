import { Link } from 'react-router-dom';
import HeroBloc from '../communs/HeroBloc.tsx';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function ScrollToAnchor() {
  const location = useLocation();
  const lastHash = useRef('');

  // listen to location change using useEffect with location as dependency
  // https://jasonwatmore.com/react-router-v6-listen-to-location-route-change-without-history-listen
  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document
          .getElementById(lastHash.current)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastHash.current = '';
      }, 100);
    }
  }, [location]);

  return null;
}

export enum ANCRES_POSSIBLES {
  KIT_DE_COMMUNICATION = 'kit-de-communication',
  LOGOS_POLICES_COULEURS = 'logos-polices-couleurs',
  ILLUSTRATIONS = 'illustrations',
  BONNES_PRATIQUES = 'bonnes-pratiques',
}

function KitDeCommunication() {
  const liensNavigation: ANCRES_POSSIBLES[] = [
    ...Object.values(ANCRES_POSSIBLES),
  ];

  return (
    <article>
      <HeroBloc
        titre="Kit de communication"
        description="Vous êtes convaincus de l’utilité de MonAideCyber et souhaitez en parler autour de vous ? Retrouvez ici toutes les ressources de communication mises à votre disposition !"
        lienIcone="/images/illustration-marelle.svg"
      />
      <ScrollToAnchor />
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
                      {liensNavigation.map((lienNavigation) => (
                        <li
                          key={lienNavigation}
                          className={`fr-sidemenu__item fr-sidemenu__item--active`}
                        >
                          <Link
                            className="fr-sidemenu__link"
                            to={`#${lienNavigation}`}
                          >
                            {lienNavigation}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
            <div className="fr-col-md-9 fr-col-9">
              <section
                id={ANCRES_POSSIBLES.KIT_DE_COMMUNICATION}
                className="section"
              >
                <h4>Plaquette de communication</h4>
                <p>
                  Cette plaquette de 8 pages au format A5 est à diffuser
                  largement par mail, sur vos réseaux sociaux ou même à
                  imprimer. Elle détaille de façon synthétique le rôle, le
                  fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">Télécharger la plaquette MonAideCyber (pdf)</a>
              </section>
              <section
                id={ANCRES_POSSIBLES.LOGOS_POLICES_COULEURS}
                className="section"
              >
                <h4>Logos, police et couleurs</h4>
                <p>
                  Cette plaquette de 8 pages au format A5 est à diffuser
                  largement par mail, sur vos réseaux sociaux ou même à
                  imprimer. Elle détaille de façon synthétique le rôle, le
                  fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">Télécharger la plaquette MonAideCyber (pdf)</a>
              </section>
              <section id={ANCRES_POSSIBLES.ILLUSTRATIONS} className="section">
                <h4>Illustrations</h4>
                <p>
                  Cette plaquette de 8 pages au format A5 est à diffuser
                  largement par mail, sur vos réseaux sociaux ou même à
                  imprimer. Elle détaille de façon synthétique le rôle, le
                  fonctionnement et l'impact de MonAideCyber.
                </p>
                <a href="#">Télécharger la plaquette MonAideCyber (pdf)</a>
              </section>
              <section
                id={ANCRES_POSSIBLES.BONNES_PRATIQUES}
                className="section"
              >
                <h4>Bonnes pratiques</h4>
                <div className="fr-mt-2w" id="information-contenu">
                  <p>
                    Quelques bonnes pratiques pour faire connaître MonAideCyber
                    au grand public :
                  </p>
                  <ul style={{ paddingLeft: '3rem' }}>
                    <li>
                      Vous pouvez personnaliser vos textes mais veillez à
                      utiliser les éléments graphiques et typographiques
                      conformément à ce qui est fourni dans le kit
                    </li>
                    <li>
                      Ce kit est uniquement réservé aux activités de
                      communication MonAideCyber
                    </li>
                    <li>
                      L’utilisation du logo de l’ANSSI n’est pas autorisée
                    </li>
                    <li>
                      N'hésitez pas à nous contacter pour toute question sur
                      monaidecyber@ssi.gouv.fr
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default KitDeCommunication;
