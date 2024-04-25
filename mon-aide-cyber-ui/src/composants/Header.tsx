import { SeConnecter } from './authentification/SeConnecter.tsx';
import { useAuthentification } from '../fournisseurs/hooks.ts';
import { ReactElement, useEffect, useState } from 'react';
import { ComposantMenuUtilisateur } from './utilisateur/ComposantMenuUtilisateur.tsx';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';

export const Header = ({ lienMAC }: { lienMAC: ReactElement }) => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | undefined>(
    undefined,
  );
  const authentification = useAuthentification();

  useEffect(() => {
    if (!utilisateur) {
      setUtilisateur(authentification.utilisateur);
    }
  }, [authentification, utilisateur]);

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
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
                    src="/images/logo_anssi.png"
                    alt="ANSSI"
                  />
                </div>
                <div className="fr-header__navbar icone-se-connecter-mobile">
                  {utilisateur ? (
                    <ComposantMenuUtilisateur utilisateur={utilisateur} />
                  ) : (
                    <button className="fr-btn fr-btn--lg fr-icon-account-circle-line">
                      <SeConnecter />
                    </button>
                  )}
                </div>
              </div>
              <div className="fr-header__service fr-col-md-5">{lienMAC}</div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                {utilisateur ? (
                  <ComposantMenuUtilisateur utilisateur={utilisateur} />
                ) : (
                  <SeConnecter />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
