import { useCallback, useState, useEffect } from 'react';
import { useLocation, useNavigate, matchPath, Link } from 'react-router-dom';
import { LienNavigation } from '../../../LayoutPublic';
import { MenuNavigationElement } from '../../MenuNavigationElement';

export const LienMenuNavigation = ({
  element,
}: {
  element: MenuNavigationElement;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const estCheminCourant = useCallback(
    (cheminATester: string) => !!matchPath(location.pathname, cheminATester),
    [location]
  );

  const aUnEnfantOuvert = element.enfants?.some((x) =>
    estCheminCourant(x.route)
  );

  const [deplie, setDeplie] = useState(aUnEnfantOuvert);

  useEffect(() => {
    if (!aUnEnfantOuvert) {
      setDeplie(false);
    }
  }, [aUnEnfantOuvert]);

  const surParentClique = () => {
    setDeplie((prev) => !prev);
    if (!aUnEnfantOuvert) {
      navigate(element.route);
    }
  };

  if (element.enfants && element.enfants.length > 0) {
    return (
      <div
        style={{
          backgroundColor: aUnEnfantOuvert ? '#7D55B1' : '#5d2a9d',
        }}
      >
        <li
          key={element.nom}
          className="lien-navigation"
          onClick={surParentClique}
        >
          <div>{element.nom}</div>
          <span
            className={
              deplie ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'
            }
          ></span>
        </li>
        {deplie ? (
          <div
            style={{
              backgroundColor: aUnEnfantOuvert ? '#7D55B1' : '#5d2a9d',
            }}
          >
            {element.enfants.map(
              (enfant: LienNavigation & MenuNavigationElement) =>
                enfant.actif ? (
                  <Link key={enfant.nom} to={enfant.route}>
                    <li
                      className={`lien-navigation-enfant ${estCheminCourant(enfant.route) ? 'actif' : ''}`}
                    >
                      <div>{enfant.nom}</div>
                    </li>
                  </Link>
                ) : (
                  <Link key={enfant.nom} to={enfant.route}>
                    <li
                      className={`lien-navigation-enfant ${estCheminCourant(enfant.route) ? 'actif' : ''}`}
                    >
                      <div>{enfant.nom}</div>
                    </li>
                  </Link>
                )
            )}
          </div>
        ) : null}
      </div>
    );
  } else {
    return (
      <Link to={element.route}>
        <li
          className={`lien-navigation ${estCheminCourant(element.route) && !aUnEnfantOuvert ? 'actif' : ''}`}
        >
          <div>{element.nom}</div>
        </li>
      </Link>
    );
  }
};
