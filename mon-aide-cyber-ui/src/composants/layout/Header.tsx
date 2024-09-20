import { SeConnecter } from '../authentification/SeConnecter.tsx';
import { PropsWithChildren, ReactElement, useEffect, useReducer } from 'react';
import { ComposantMenuUtilisateur } from '../utilisateur/ComposantMenuUtilisateur.tsx';
import { liensNavigation } from './LayoutPublic.tsx';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useNavigationMAC, useUtilisateur } from '../../fournisseurs/hooks.ts';
import { macAPI } from '../../fournisseurs/api/macAPI.ts';
import { ReponseUtilisateur } from '../../domaine/authentification/Authentification.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { ReponseHATEOAS } from '../../domaine/Lien.ts';
import {
  initialiseReducteurUtilisateurAuthentifie,
  reducteurUtilisateurAuthentifie,
  utilisateurCharge,
  utilisateurNonAuthentifie,
} from '../authentification/reducteurUtilisateurAuthentifie.ts';

export type HeaderProprietes = PropsWithChildren<{
  lienMAC: ReactElement;
  enteteSimple?: boolean;
}>;

export const Header = ({ lienMAC, enteteSimple }: HeaderProprietes) => {
  const location = useLocation();
  const { utilisateur, setUtilisateur } = useUtilisateur();
  const navigationMAC = useNavigationMAC();
  const [etatUtilisateurAuthentifie, envoie] = useReducer(
    reducteurUtilisateurAuthentifie,
    initialiseReducteurUtilisateurAuthentifie()
  );

  const estCheminCourant = (cheminATester: string) =>
    !!matchPath(location.pathname, cheminATester);

  useEffect(() => {
    if (etatUtilisateurAuthentifie.enAttenteDeChargement) {
      macAPI
        .execute<ReponseUtilisateur, ReponseUtilisateur>(
          constructeurParametresAPI()
            .url('/api/utilisateur')
            .methode('GET')
            .construis(),
          (json) => json
        )
        .then((utilisateur) => {
          envoie(utilisateurCharge());
          setUtilisateur({
            nomPrenom: utilisateur.nomPrenom,
          });
          const moteurDeLiens = new MoteurDeLiens(utilisateur.liens);

          navigationMAC.ajouteEtat(moteurDeLiens.extrais());
        })
        .catch((erreur) => {
          navigationMAC.setEtat(
            new MoteurDeLiens((erreur as ReponseHATEOAS).liens).extrais()
          );
          envoie(utilisateurNonAuthentifie());
        });
    }
  }, [navigationMAC, etatUtilisateurAuthentifie.enAttenteDeChargement]);

  const accesRapide = enteteSimple ? (
    ''
  ) : (
    <div className="fr-header__tools">
      <div className="fr-header__tools-links">
        {utilisateur ? (
          <ComposantMenuUtilisateur utilisateur={utilisateur} />
        ) : (
          <SeConnecter />
        )}
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
        <nav
          className="barre-navigation"
          id="navigation-493"
          role="navigation"
          aria-label="Menu principal"
        >
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
        </nav>
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
