import { SeConnecter } from '../../domaine/authentification/SeConnecter.tsx';
import { PropsWithChildren, ReactElement } from 'react';
import { LienNavigation } from './LayoutPublic.tsx';
import { ComposantMenuUtilisateur } from '../utilisateur/ComposantMenuUtilisateur.tsx';
import { useUtilisateur } from '../../fournisseurs/hooks.ts';
import { BandeauMaintenance } from '../alertes/BandeauMaintenance.tsx';
import { BandeauDePromotionMSC } from '../alertes/BandeauDePromotionMSC.tsx';
import { NavigationPublique } from './header/NavigationPublique.tsx';

export type HeaderProprietes = PropsWithChildren<{
  lienMAC: ReactElement;
  afficheNavigation?: boolean;
  enteteSimple?: boolean;
}>;

export const Header = ({
  lienMAC,
  afficheNavigation = true,
  enteteSimple,
}: HeaderProprietes) => {
  const { utilisateur } = useUtilisateur();

  const liensNavigation: LienNavigation[] = [
    {
      route: '/',
      nom: 'Accueil',
    },
    {
      route: '/beneficier-du-dispositif/annuaire',
      nom: 'Les Aidants cyber',
      clef: 770,
      enfants: [
        {
          route: '/beneficier-du-dispositif/annuaire',
          nom: 'Annuaire des Aidants cyber',
        },
        {
          route: '/relais-associatifs',
          nom: 'Relais associatifs',
        },
        {
          route: '/guide-des-aidants-cyber',
          nom: 'Guide des Aidants cyber',
        },
      ],
    },
    {
      route: '/promouvoir-diagnostic-cyber',
      nom: 'Promouvoir',
      clef: 776,
      enfants: [
        {
          route: '/promouvoir-diagnostic-cyber',
          nom: 'Promouvoir le diagnostic cyber',
        },
        {
          route: '/promouvoir-communaute-aidants-cyber',
          nom: 'Promouvoir les Aidants cyber',
        },
      ],
    },
  ];

  const maintenanceEstPrevue: string = import.meta.env[
    'VITE_MAINTENANCE_CRENEAU_PREVU'
  ];

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
                {afficheNavigation ? (
                  <div className="fr-header__navbar icone-se-connecter-mobile">
                    <lab-anssi-bouton-suite-cyber-navigation sourceUtm="MonAideCyber"></lab-anssi-bouton-suite-cyber-navigation>
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
                ) : null}
              </div>
              <div className="fr-header__service fr-col-md-5">{lienMAC}</div>
            </div>
            {!enteteSimple ? (
              <div className="fr-header__tools boutons-sans-fond visible-desktop">
                <div className="flex justify-end items-center">
                  <div className="flex justify-center items-center">
                    <lab-anssi-bouton-suite-cyber-navigation sourceUtm="MonAideCyber"></lab-anssi-bouton-suite-cyber-navigation>
                    {utilisateur ? (
                      <ComposantMenuUtilisateur utilisateur={utilisateur} />
                    ) : (
                      <SeConnecter />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {maintenanceEstPrevue && (
        <BandeauMaintenance creneauDeMaintenance={maintenanceEstPrevue} />
      )}

      <BandeauDePromotionMSC />

      {!enteteSimple && afficheNavigation ? (
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
            <div className="fr-header__menu-links">
              {utilisateur ? (
                <ComposantMenuUtilisateur utilisateur={utilisateur} />
              ) : (
                <SeConnecter />
              )}
            </div>
            <NavigationPublique liensNavigation={liensNavigation} />
          </div>
        </div>
      ) : null}
    </header>
  );
};
