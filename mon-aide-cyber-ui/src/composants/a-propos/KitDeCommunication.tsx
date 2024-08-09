import { Link } from 'react-router-dom';
import HeroBloc from '../communs/HeroBloc.tsx';
import { useEffect } from 'react';
import { Header } from '../Header.tsx';
import { LienMAC } from '../LienMAC.tsx';
import { Footer } from '../Footer.tsx';
import useDefilementFluide from '../../hooks/useDefilementFluide.ts';
import Sidemenu from '../communs/Sidemenu/Sidemenu.tsx';
import Cadre from './Cadre.tsx';

export type AncreHtml = {
  id: ANCRES_POSSIBLES;
  libelle: string;
};

export enum ANCRES_POSSIBLES {
  KIT_DE_COMMUNICATION = 'kit-de-communication',
  LOGOS_POLICES_COULEURS = 'logos-polices-couleurs',
  ILLUSTRATIONS = 'illustrations',
  BONNES_PRATIQUES = 'bonnes-pratiques',
}

const liensNavigation: AncreHtml[] = [
  {
    id: ANCRES_POSSIBLES.KIT_DE_COMMUNICATION,
    libelle: 'Kit de communication',
  },
  {
    id: ANCRES_POSSIBLES.LOGOS_POLICES_COULEURS,
    libelle: 'Logo, polices et couleurs',
  },
  {
    id: ANCRES_POSSIBLES.ILLUSTRATIONS,
    libelle: 'Illlustrations',
  },
  {
    id: ANCRES_POSSIBLES.BONNES_PRATIQUES,
    libelle: 'Bonnes pratiques',
  },
];

type Couleur = {
  nom: string;
  codehexadecimal: string;
};

const couleursMAC: Couleur[] = [
  {
    nom: 'Purple Dark',
    codehexadecimal: '#5D2A9D',
  },
  {
    nom: 'Purple Light',
    codehexadecimal: '#E1CBF1',
  },
  {
    nom: 'Purple Extra Light',
    codehexadecimal: '#F5F1F9',
  },
  {
    nom: 'Yellow',
    codehexadecimal: '#FDC82E',
  },
  {
    nom: 'Yellow Light',
    codehexadecimal: '#FFE7A0',
  },
  {
    nom: 'Grey Dark',
    codehexadecimal: '#282828',
  },
];
function observeLeDefilement() {
  const observateurDIntersection = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const lienDeSection = document.querySelector(
          `nav ul li a.${entry.target.id}`
        );
        console.log('lien de section', lienDeSection);
        if (!lienDeSection) return;

        if (entry.isIntersecting) {
          lienDeSection.setAttribute('aria-current', 'page');
        } else {
          lienDeSection.removeAttribute('aria-current');
        }
      });
    },
    {
      rootMargin: '-30% 0% -62% 0%',
    }
  );

  const titresRubriques = document.querySelectorAll('section');
  titresRubriques.forEach((titreRubrique) =>
    observateurDIntersection.observe(titreRubrique)
  );
}

function KitDeCommunication() {
  useDefilementFluide();

  useEffect(() => {
    observeLeDefilement();
  }, []);

  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <article>
        <HeroBloc
          titre="Kit de communication"
          description="Vous êtes convaincus de l’utilité de MonAideCyber et souhaitez en parler autour de vous ? Retrouvez ici toutes les ressources de communication mises à votre disposition !"
          lienIcone="/images/illustration-tornade.svg"
        />
        <div className="fond-clair-mac">
          <div className="fr-container kit-de-communication">
            <div className="fr-grid-row">
              <div className="fr-col-md-3 fr-col-3">
                <Sidemenu sticky={true} aria-labelledby="fr-sidemenu-title">
                  {liensNavigation?.map(({ id, libelle }) => (
                    <Sidemenu.Link key={id} to={`#${id}`} anchorId={id}>
                      {libelle}
                    </Sidemenu.Link>
                  ))}
                </Sidemenu>
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
                    fonctionnement et l&apos;impact de MonAideCyber.
                  </p>
                  <img src="/images/illustration-tuto.svg" /> <br />
                  <a href="#">Télécharger la plaquette MonAideCyber (pdf)</a>
                </section>
                <section
                  id={ANCRES_POSSIBLES.LOGOS_POLICES_COULEURS}
                  className="section"
                >
                  <h4>Logos, police et couleurs</h4>
                  <h5>Logos</h5>
                  <p>
                    Téléchargez le pack de 3 logos pour l&apos;intégrer sur
                    votre site, dans une présentation, dans une newsletter, ...
                  </p>
                  <br />
                  <div className="grille-logos">
                    <Cadre className="grille-logos-1 centree">
                      <img src="/images/logo_mac.svg" />
                    </Cadre>
                    <Cadre
                      className="grille-logos-2 centree"
                      style={{
                        backgroundColor: '#282828',
                      }}
                    >
                      <img src="/images/MonAideCyber_Logo_long.svg" />
                    </Cadre>
                    <Cadre className="grille-logos-3 centree">
                      <img src="/images/MonAideCyber_Logo_Haut.svg" />
                    </Cadre>
                  </div>
                  <br />
                  <a href="#">Télécharger le pack des 3 logos (pdf)</a>
                  <br />
                  <br />
                  <h5>Police</h5>
                  <p>
                    MonAideCyber utilise la typographie Marianne, qui est
                    l&apos;une{' '}
                    <u>
                      des typographies officielles de la charte de l&apos;État
                    </u>
                    .
                  </p>
                  <Cadre
                    style={{
                      padding: '2rem .5rem',
                    }}
                    className="centree"
                  >
                    <h4>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      <br />
                      abcdefghijklmnopqrstuvwxyz
                      <br />
                      0123456789
                    </h4>
                  </Cadre>

                  <br />
                  <a href="#">
                    Aller sur le site de téléchargement (site officiel) (pdf)
                  </a>
                  <br />
                  <br />
                  <h5>Couleurs</h5>
                  <p>
                    La gamme des couleurs MonAideCyber est présentée ci-dessous.
                    Vous pouvez utiliser les codes hexadécimaux qui sont
                    indiqués.
                  </p>
                  <div className="grille-typos">
                    {couleursMAC.map((couleurMac) => (
                      <Cadre
                        key={couleurMac.nom}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '81px',
                            backgroundColor: couleurMac.codehexadecimal,
                          }}
                        ></div>
                        <div
                          className="flex flex-column items-center"
                          style={{
                            width: '100%',
                            padding: '0.5rem 0 0.5rem 0',
                          }}
                        >
                          <span>{couleurMac.nom}</span>
                          <b>{couleurMac.codehexadecimal}</b>
                        </div>
                      </Cadre>
                    ))}
                  </div>
                </section>
                <section
                  id={ANCRES_POSSIBLES.ILLUSTRATIONS}
                  className="section"
                >
                  <h4>Illustrations</h4>
                  <p>
                    Voici 4 de nos illustrations à intégrer dans vos supports de
                    communication.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: '1fr 1fr',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '2rem',
                    }}
                  >
                    <TuileIllustration src="/images/illustration-echange.svg" />
                    <TuileIllustration src="/images/illustration-avancer-ensemble.svg" />
                    <TuileIllustration src="/images/illustration-marelle.svg" />
                    <TuileIllustration src="/images/illustration-deux-personnes.svg" />
                  </div>
                  <br />
                  <a href="#">Télécharger le pack des 4 illustrations (zip)</a>
                </section>
                <section
                  id={ANCRES_POSSIBLES.BONNES_PRATIQUES}
                  className="section"
                >
                  <h4>Bonnes pratiques</h4>
                  <div className="fr-mt-2w" id="information-contenu">
                    <p>
                      Quelques bonnes pratiques pour faire connaître
                      MonAideCyber au grand public :
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
                        <b>
                          L’utilisation du logo de l’ANSSI n’est pas autorisée
                        </b>
                      </li>
                      <li>
                        N&apos;hésitez pas à nous contacter pour toute question
                        sur{' '}
                        <a href="mailto:monaidecyber@ssi.gouv.fr">
                          monaidecyber@ssi.gouv.fr
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}

export function TuileIllustration({
  texteByPass,
  ...restProps
}: { texteByPass?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Cadre className="centree" style={{ padding: '0.5rem' }}>
      {texteByPass ? texteByPass : <img {...restProps} />}
    </Cadre>
  );
}
export default KitDeCommunication;
