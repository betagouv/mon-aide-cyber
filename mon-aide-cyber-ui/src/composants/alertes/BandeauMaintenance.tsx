export const BandeauMaintenance = (props: { creneauDeMaintenance: string }) => (
  <div className="bandeau-maintenance">
    <div className="fr-container">
      MonAideCyber sera en maintenance <b>{props.creneauDeMaintenance}</b>. La
      plate-forme sera indisponible durant ce créneau.
    </div>
  </div>
);
