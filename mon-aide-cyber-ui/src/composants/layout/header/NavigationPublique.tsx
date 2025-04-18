import { LienNavigation } from '../LayoutPublic.tsx';
import { Link, matchPath, useLocation } from 'react-router-dom';
import './navigation-publique.scss';
import { useCallback } from 'react';

const LienNavigationPubliqueMajeur = ({ lien }: { lien: LienNavigation }) => {
  const location = useLocation();

  const estCheminCourant = useCallback(
    (cheminATester: string) => !!matchPath(location.pathname, cheminATester),
    [location]
  );

  const aUnEnfantOuvert = (liensEnfants: LienNavigation[] | undefined) => {
    if (!liensEnfants || liensEnfants.length === 0) return false;

    return liensEnfants.filter((x) => estCheminCourant(x.route)).length > 0;
  };

  const menuId = `menu-${lien.clef}`;

  return (
    <li
      className={`fr-nav__item ${estCheminCourant(lien.route) || aUnEnfantOuvert(lien.enfants) ? 'lien actif' : 'lien'}`}
    >
      <button
        className="fr-nav__btn"
        aria-expanded="false"
        aria-controls={menuId}
      >
        {lien.nom}
      </button>
      <div className="fr-collapse fr-menu" id={menuId}>
        <ul className="fr-menu__list">
          {lien.enfants?.map((x) => (
            <li key={x.nom}>
              <Link className="fr-nav__link" to={x.route}>
                {x.nom}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export const NavigationPublique = ({
  liensNavigation,
}: {
  liensNavigation: LienNavigation[];
}) => {
  const location = useLocation();

  const estCheminCourant = (cheminATester: string) =>
    !!matchPath(location.pathname, cheminATester);

  return (
    <nav
      className="fr-nav barre-navigation"
      id="navigation-773"
      role="navigation"
      aria-label="Menu principal"
    >
      <ul className="fr-nav__list">
        {liensNavigation.map((lien) => {
          if (!!lien.enfants && lien.enfants.length > 0) {
            return <LienNavigationPubliqueMajeur key={lien.nom} lien={lien} />;
          }
          return (
            <li
              className={`fr-nav__item ${estCheminCourant(lien.route) ? 'lien actif' : 'lien'}`}
              key={lien.nom}
            >
              <Link className="fr-nav__link" to={lien.route} target="_self">
                {lien.nom}
              </Link>
            </li>
          );
        })}
        <li className="diagnostic-mes-services-cyber fr-nav__item lien">
          <lab-anssi-mes-services-cyber-lien-diagnostic-cyber
            lien={`${import.meta.env['VITE_URL_MSC']}/cyberdepart`}
            versExterne={true}
          ></lab-anssi-mes-services-cyber-lien-diagnostic-cyber>
        </li>
      </ul>
    </nav>
  );
};
