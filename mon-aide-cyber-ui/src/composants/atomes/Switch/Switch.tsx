import './switch.scss';

type ProprietesSwitch = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Switch = ({ label, ...proprietesRestantes }: ProprietesSwitch) => {
  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div className="mac-switch">
        <input {...proprietesRestantes} type="checkbox" role="switch" />
        <span className="mac-switch-slider"></span>
      </div>
      <label>{label}</label>
    </div>
  );
};

// consentementAnnuaire

/*
<div className="fr-toggle">
      <input
        type="checkbox"
        className="fr-toggle__input"
        aria-describedby="toggle-4633-messages"
        id="toggle-4633"
      />
      <label className="fr-toggle__label" htmlFor="toggle-4633">
        Je souhaite que mon nom apparaisse sur l’annuaire des aidants
      </label>
      <div
        className="fr-messages-group"
        id="toggle-4633-messages"
        aria-live="polite"
      ></div>
    </div>
*/
