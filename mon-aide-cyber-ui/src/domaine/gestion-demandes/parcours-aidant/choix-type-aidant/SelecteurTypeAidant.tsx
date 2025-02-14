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
        <p className="m-0">{libelle}</p>
      </div>
      {contenuZoneDepliee}
    </label>
  );
};
