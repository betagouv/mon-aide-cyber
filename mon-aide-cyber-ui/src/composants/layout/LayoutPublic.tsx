import { Link, matchPath, Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LienMAC } from '../LienMAC';
import { Footer } from './Footer';

export type LienNavigation = {
  route: string;
  nom: string;
};

export const liensNavigation: LienNavigation[] = [
  {
    route: '/',
    nom: 'Accueil',
  },
  {
    route: '/demandes/etre-aide',
    nom: 'Bénéficier du dispositif',
  },
  {
    route: '/demandes/devenir-aidant',
    nom: 'Devenir aidant',
  },
  {
    route: '/a-propos/kit-de-communication',
    nom: 'Kit de communication',
  },
];

export const BarreDeNavigation = () => {
  const location = useLocation();

  const estCheminCourant = (cheminATester: string) =>
    !!matchPath(location.pathname, cheminATester);

  return (
    <nav
      className="fr-nav"
      id="navigation-494"
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="fr-container barre-navigation">
        <ul className="fr-nav__list">
          {liensNavigation.map((lien) => (
            <li
              className={`fr-nav__item ${estCheminCourant(lien.route) ? 'lien actif' : 'lien'}`}
              key={lien.nom}
            >
              <Link className="fr-nav__link" to={lien.route}>
                {lien.nom}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export const LayoutPublic = () => {
  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <Outlet />
      <Footer />
    </>
  );
};
