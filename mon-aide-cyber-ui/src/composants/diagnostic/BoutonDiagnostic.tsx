type ProprietesBoutonDiagnostic = {
  visible: boolean;
  style: string;
  onClick: () => void;
  titre: string;
};
export const BoutonDiagnostic = (proprietes: ProprietesBoutonDiagnostic) => (
  <div className={`fr-pr-2w ${proprietes.visible ? `visible` : `invisible`}`}>
    <button
      className={`fr-btn bouton-mac ${proprietes.style}`}
      onClick={proprietes.onClick}
    >
      {proprietes.titre}
    </button>
  </div>
);
