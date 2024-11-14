import { SeConnecter } from '../../domaine/authentification/SeConnecter.tsx';
import { PropsWithChildren, ReactElement } from 'react';
import { liensNavigation } from './LayoutPublic.tsx';
import { ComposantMenuUtilisateur } from '../utilisateur/ComposantMenuUtilisateur.tsx';
import { useUtilisateur } from '../../fournisseurs/hooks.ts';
import { NavigationPublique } from './header/NavigationPublique.tsx';

export type HeaderProprietes = PropsWithChildren<{
  lienMAC: ReactElement;
  enteteSimple?: boolean;
}>;

export const Header = ({ lienMAC, enteteSimple }: HeaderProprietes) => {
  const { utilisateur } = useUtilisateur();

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
            {!enteteSimple ? (
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  {utilisateur ? (
                    <ComposantMenuUtilisateur utilisateur={utilisateur} />
                  ) : (
                    <SeConnecter />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {!enteteSimple ? (
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
      ) : null}
    </header>
  );
};
