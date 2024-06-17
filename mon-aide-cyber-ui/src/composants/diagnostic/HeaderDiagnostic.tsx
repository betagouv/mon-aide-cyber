import { useCallback, useState } from 'react';

type ProprietesHeaderDiagnostic = {
  quitter: { accederALaRestitution: () => void };
};
export const HeaderDiagnostic = (propietes: ProprietesHeaderDiagnostic) => {
  const [lienCopie, setLienCopie] = useState(<></>);

  const fermeAlerte = useCallback(() => {
    setLienCopie(<></>);
  }, []);

  const copierLienDiagnostic = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setLienCopie(() => (
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--right">
          <div
            className="fr-alert fr-alert--success fr-mb-1w fr-col-4"
            role="alert"
          >
            <h3 className="fr-alert__title">Lien copié avec succès</h3>
            <p>Le lien du diagnostic a été copié dans votre presse-papier</p>
            <button
              className="fr-btn--close fr-btn"
              title="Masquer le message"
              onClick={fermeAlerte}
            >
              Masquer le message
            </button>
          </div>
        </div>
      </div>
    ));
  }, [fermeAlerte]);

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
                <ul className="fr-btns-group">
                  <li>
                    <button
                      className="bouton-mac bouton-mac-primaire"
                      title="Accéder à la restitution"
                      onClick={propietes.quitter.accederALaRestitution}
                    >
                      Accéder à la restitution
                    </button>
                  </li>
                  <li>
                    <button
                      className="bouton-icone-mac bouton-mac-secondaire fr-share__link fr-share__link--copy"
                      title="Copier le lien du diagnostic"
                      onClick={copierLienDiagnostic}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {lienCopie}
    </header>
  );
};
