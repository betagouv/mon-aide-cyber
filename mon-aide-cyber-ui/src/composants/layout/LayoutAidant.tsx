import { Link, matchPath, Outlet, useLocation } from 'react-router-dom';
import { LienMAC } from '../LienMAC';
import { FooterEspaceAidant } from '../espace-aidant/FooterEspaceAidant';
import { HeaderAidant } from './HeaderAidant';
import { TypographieH6 } from '../communs/typographie/TypographieH6/TypographieH6';
import { LienNavigation } from './LayoutPublic';
import { useState } from 'react';
import { useMoteurDeLiens } from '../../hooks/useMoteurDeLiens';
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

  const estCheminCourant = (cheminATester: string) =>
    !!matchPath(location.pathname, cheminATester);

  const aUnEnfantOuvert = element.enfants?.some((x) =>
    estCheminCourant(x.route)
  );

  const [deplie, setDeplie] = useState(aUnEnfantOuvert);

  if (element.enfants && element.enfants.length > 0) {
    return (
      <div
        style={{
          backgroundColor: aUnEnfantOuvert ? '#9C51D0' : '#5d2a9d',
        }}
      >
        <div
          className="lien-navigation"
          onClick={() => setDeplie((prev) => !prev)}
        >
          <span>{element.nom}</span>
          <span
            className={
              deplie ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'
            }
          ></span>
        </div>
        {deplie ? (
          <div
            style={{
              backgroundColor: aUnEnfantOuvert ? '#9C51D0' : '#5d2a9d',
            }}
          >
            {element.enfants.map((enfant) =>
              enfant.actif ? (
                <Link key={enfant.nom} to={enfant.route}>
                  <li
                    className={`${estCheminCourant(enfant.route) ? 'actif' : ''}`}
                  >
                    <div className="lien-navigation-enfant">{enfant.nom}</div>
                  </li>
                </Link>
              ) : (
                <Link key={enfant.nom} to={enfant.route}>
                  <li
                    style={{
                      backgroundColor: aUnEnfantOuvert ? '#9C51D0' : '#5d2a9d',
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

  return (
    <aside className="barre-navigation-laterale mode-fonce">
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
            { nom: 'Mon compte', route: '/aidant/profil', actif: true },
          ]}
        />
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
