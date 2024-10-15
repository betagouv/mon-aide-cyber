import { SeConnecter } from '../authentification/SeConnecter.tsx';
import { PropsWithChildren, ReactElement, useCallback, useEffect } from 'react';
import { LienNavigation, liensNavigation } from './LayoutPublic.tsx';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../../domaine/Lien.ts';
import { useContexteNavigation } from '../../hooks/useContexteNavigation.ts';

export type HeaderProprietes = PropsWithChildren<{
  lienMAC: ReactElement;
  enteteSimple?: boolean;
}>;

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

const NavigationPublique = ({
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
      </ul>
    </nav>
  );
};

export const Header = ({ lienMAC, enteteSimple }: HeaderProprietes) => {
  const navigationMAC = useNavigationMAC();
  const contexteNavigation = useContexteNavigation();

  useEffect(() => {
    contexteNavigation
      .recupereContexteNavigation({ contexte: '' })
      .then((reponse) => {
        const rep = reponse as ReponseHATEOAS;
        if (rep.liens['afficher-tableau-de-bord']) {
          navigationMAC.navigue(
            new MoteurDeLiens(rep.liens),
            'afficher-tableau-de-bord'
          );
        }
      });
  }, []);

  const accesRapide = enteteSimple ? (
    ''
  ) : (
    <div className="fr-header__tools">
      <div className="fr-header__tools-links">
        <SeConnecter />
      </div>
    </div>
  );

  const navigation = enteteSimple ? (
    ''
  ) : (
    <div
      className="fr-header__menu fr-modal"
      id="modal-491"
      aria-labelledby="button-492"
    >
      <div className="fr-container">
        <button
          className="fr-btn--close fr-btn bouton-mac bouton-mac-secondaire"
          aria-controls="modal-491"
          title="Fermer"
        >
          Fermer
        </button>
        <div className="fr-header__menu-links"></div>
        <NavigationPublique liensNavigation={liensNavigation} />
      </div>
    </div>
  );

  return (
    <header role="banner" className="fr-header public mac-sticky">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    {' '}
                    République <br />
                    Française
                  </p>
                </div>
                <div className="fr-header__operator">
                  <img
                    style={{ maxWidth: '3.5rem' }}
                    className="fr-responsive-img"
                    src="/images/logo_anssi.svg"
                    alt="ANSSI"
                  />
                </div>
                <div className="fr-header__navbar icone-se-connecter-mobile">
                  <button
                    className="fr-btn--menu fr-btn"
                    data-fr-opened="false"
                    aria-controls="modal-491"
                    id="button-492"
                    title="Menu"
                  >
                    Menu
                  </button>
                </div>
              </div>
              <div className="fr-header__service fr-col-md-5">{lienMAC}</div>
            </div>
            {accesRapide}
          </div>
        </div>
      </div>
      {navigation}
    </header>
  );
};
