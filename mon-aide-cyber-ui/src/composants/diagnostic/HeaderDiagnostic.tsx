type ProprietesHeaderDiagnostic = {
  terminer: { active: boolean; termineDiagnostic: () => void };
  copier: { copier: () => void };
};
export const HeaderDiagnostic = (propietes: ProprietesHeaderDiagnostic) => (
  <header role="banner" className="fr-header">
    <div className="fr-header__body">
      <div className="fr-container">
        <div className="fr-header__body-row">
          <div className="fr-header__brand fr-enlarge-link">
            <div className="fr-header__brand-top"></div>
            <div className="fr-header__service">
              <img
                className="fr-responsive-img"
                src="/images/logo_mac.svg"
                alt="ANSSI"
              />
            </div>
          </div>
          <div className="fr-header__tools">
            <div className="fr-header__tools-links">
              <ul className="fr-btns-group">
                <li className="fr-pr-2w">
                  <button
                    className="bouton-mac bouton-mac-primaire"
                    title="Terminer Diagnostic"
                    disabled={propietes.terminer.active}
                    onClick={propietes.terminer.termineDiagnostic}
                  >
                    Terminer Diagnostic
                  </button>
                </li>
                <li>
                  <button
                    className="bouton-icone-mac bouton-mac-secondaire fr-share__link fr-share__link--copy"
                    title="Copier le lien du diagnostic"
                    onClick={propietes.copier.copier}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);
