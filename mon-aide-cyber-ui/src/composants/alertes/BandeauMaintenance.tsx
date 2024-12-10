import { useState } from 'react';

export const BandeauMaintenance = (props: { creneauDeMaintenance: string }) => {
  const [bandeauEstAffiche, afficheOuMasqueBandeau] = useState(true);

  if (!bandeauEstAffiche) return null;

  return (
    <div className="bandeau-maintenance">
      <div className="fr-container">
        <div className="bandeau-maintenance-contenu">
          <p>
            MonAideCyber sera en maintenance <b>{props.creneauDeMaintenance}</b>
            . La plate-forme sera indisponible durant ce créneau.
          </p>

          <span
            onClick={() => afficheOuMasqueBandeau((precedent) => !precedent)}
            className="fr-icon-close-line"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </div>
  );
};
