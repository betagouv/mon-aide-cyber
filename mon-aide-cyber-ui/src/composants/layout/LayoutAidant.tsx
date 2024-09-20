import { Link, matchPath, Outlet, useLocation } from 'react-router-dom';
import { LienMAC } from '../LienMAC';
import { FooterEspaceAidant } from '../espace-aidant/FooterEspaceAidant';
import { HeaderAidant } from './HeaderAidant';
import { TypographieH6 } from '../communs/typographie/TypographieH6/TypographieH6';
import { Theme } from '../a-propos/Cadre';
import { LienNavigation } from './LayoutPublic';
import { useState } from 'react';
export type MenuNavigationElement = LienNavigation & {
  actif: boolean;
  enfants?: MenuNavigationElement[];
};

const Separateur = ({ theme }: { theme: Theme }) => {
  const couleurSelonTheme = {
    light: 'black',
    dark: 'white',
  };

  return (
    <div
      style={{
        height: '1px',
        backgroundColor: couleurSelonTheme[theme],
        width: '100%',
      }}
    ></div>
  );
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
          style={{
            padding: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
          }}
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
                    <div style={{ padding: '1.5rem 1.5rem 1.5rem 40px' }}>
                      {enfant.nom}
                    </div>
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
                    <div style={{ padding: '1.5rem 1.5rem 1.5rem 40px' }}>
                      {enfant.nom}
                    </div>
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
          <div
            style={{
              padding: '1.5rem',
            }}
          >
            {element.nom}
          </div>
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
  return (
    <aside className="mode-fonce" style={{ width: '256px', minWidth: '256px' }}>
      <TypographieH6
        style={{ color: 'white', padding: '1.5rem 1.5rem 0 1.5rem' }}
      >
        Mon espace Aidant
      </TypographieH6>
      <Separateur theme="dark" />
      <div>
        <MenuNavigation
          elements={[
            // { nom: 'Tableau de bord', route: '/tableau-de-bord', actif: true },
            {
              nom: 'Mes diagnostics',
              route: '/diagnostics',
              actif: true,
              enfants: [
                //{ nom: 'Mes demandes', route: '/mes-demandes', actif: false },
                //{ nom: 'Mes diagnostics', route: '/diagnostics', actif: true },
                //{ nom: 'Mes tests', route: '/mes-tests', actif: false },
              ],
            },
          ]}
        />
      </div>
      <Separateur theme="dark" />
      <div>
        <MenuNavigation
          elements={[{ nom: 'Mon compte', route: '/profil', actif: true }]}
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
      <main
        style={{ minHeight: '100vh' }}
        role="main"
        className="tableau-de-bord"
      >
        <BarreNavigationLaterale />
        <Outlet />
      </main>

      <FooterEspaceAidant />
    </div>
  );
};
