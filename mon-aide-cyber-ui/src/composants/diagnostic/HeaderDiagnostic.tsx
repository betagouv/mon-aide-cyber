import { ReactElement } from 'react';

type ProprietesHeaderDiagnostic = {
  actions: ReactElement;
};
export const HeaderDiagnostic = ({ actions }: ProprietesHeaderDiagnostic) => {
  return (
    <header role="banner" className="fr-header diagnostic-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top"></div>
              <div className="fr-header__service">
                <img
                  className="fr-responsive-img logo-mac-diagnostic"
                  src="/images/logo_mac.svg"
                  alt="ANSSI"
                />
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <div className="header-restitution-actions">{actions}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
