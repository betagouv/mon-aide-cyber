import {
  Link,
  matchPath,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { LienMAC } from '../LienMAC';
import { FooterEspaceAidant } from '../espace-aidant/FooterEspaceAidant';
import { HeaderAidant } from './HeaderAidant';
import { TypographieH6 } from '../communs/typographie/TypographieH6/TypographieH6';
import { LienNavigation } from './LayoutPublic';
import { useCallback, useEffect, useState } from 'react';
import { useMoteurDeLiens } from '../../hooks/useMoteurDeLiens';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { ROUTE_AIDANT } from '../../domaine/MoteurDeLiens';

export type MenuNavigationElement = LienNavigation & {
  actif: boolean;
  enfants?: MenuNavigationElement[];
};

const Separateur = () => {
  return <div className="separateur"></div>;
};

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
                      style={{
                        backgroundColor: aUnEnfantOuvert
                          ? '#9C51D0'
                          : '#5d2a9d',
                      }}
                      className={`${estCheminCourant(enfant.route) ? 'actif' : ''}`}
                    >
                      <div className="lien-navigation-enfant">{enfant.nom}</div>
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
          className={`${estCheminCourant(element.route) && !aUnEnfantOuvert ? 'actif' : ''}`}
        >
          <div className="lien-navigation">{element.nom}</div>
        </li>
      </Link>
    );
  }
};

export const MenuNavigation = ({
  elements,
}: {
  elements: MenuNavigationElement[];
}) => {
  return (
    <ul className="menu-lateral">
      {elements?.map((element) => (
        <LienMenuNavigation key={element.nom} element={element} />
      ))}
    </ul>
  );
};

export const BarreNavigationLaterale = () => {
  const { accedeALaRessource: peutAfficherTableauDeBord } = useMoteurDeLiens(
    'afficher-tableau-de-bord'
  );

  const { estFonctionaliteActive } = useFeatureFlag(
    'ESPACE_AIDANT_ECRAN_MES_PREFERENCES'
  );

  return (
    <aside className="barre-navigation-laterale mode-fonce">
      <div className="barre-navigation-laterale-sticky">
        <TypographieH6>Mon espace Aidant</TypographieH6>
        <Separateur />
        <div>
          <MenuNavigation
            elements={[
              ...(peutAfficherTableauDeBord
                ? [
                    {
                      nom: 'Mes diagnostics',
                      route: '/aidant/tableau-de-bord',
                      actif: true,
                      enfants: [
                        //{ nom: 'Mes demandes', route: '/mes-demandes', actif: false },
                        //{ nom: 'Mes diagnostics', route: '/diagnostics', actif: true },
                        //{ nom: 'Mes tests', route: '/mes-tests', actif: false },
                      ],
                    },
                  ]
                : []),
            ]}
          />
        </div>
        <Separateur />
        <div>
          <MenuNavigation
            elements={[
              {
                nom: 'Mon compte',
                route: `${ROUTE_AIDANT}/mes-informations`,
                actif: true,
                enfants: [
                  ...(estFonctionaliteActive
                    ? [
                        {
                          nom: 'Mes informations',
                          route: `${ROUTE_AIDANT}/mes-informations`,
                          actif: true,
                        },
                        {
                          nom: 'Mes préférences',
                          route: `${ROUTE_AIDANT}/mes-preferences`,
                          actif: true,
                        },
                      ]
                    : []),
                ],
              },
            ]}
          />
        </div>
      </div>
    </aside>
  );
};

export const LayoutAidant = () => {
  return (
    <div>
      <HeaderAidant
        lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />}
      />
      <main role="main" className="tableau-de-bord">
        <BarreNavigationLaterale />
        <Outlet />
      </main>
      <div className="separateur-footer w-100"></div>
      <FooterEspaceAidant />
    </div>
  );
};
