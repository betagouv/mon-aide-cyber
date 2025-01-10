import { ReactElement } from 'react';

type ProprietesSelecteurTypeAidant = {
  libelle: string;
  contenuZoneDepliee?: ReactElement;
  surChoix: () => void;
  coche: boolean;
};

export const SelecteurTypeAidant = ({
  libelle,
  surChoix,
  contenuZoneDepliee,
  coche,
}: ProprietesSelecteurTypeAidant) => {
  return (
    <label className="selecteur-type-aidant">
      <div className="zone-radiobutton">
        <div>
          <input
            name="choix-type-aidant"
            type="radio"
            onChange={surChoix}
            checked={coche}
          />
        </div>
        <p>{libelle}</p>
      </div>
      {contenuZoneDepliee ? (
        <div className="selecteur-type-aidant-saisie-entite">
          {contenuZoneDepliee}
        </div>
      ) : null}
    </label>
  );
};
