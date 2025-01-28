import { useEffect, useState } from 'react';
import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { CharteAidant } from '../../../../vues/CharteAidant.tsx';
import { Input } from '../../../../composants/atomes/Input/Input.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { ChampValidationCGUs } from '../../../../composants/formulaires/ChampValidationCGUs.tsx';
import { activeValidationCharteAidant } from '../SignatureCharteAidant.tsx';

export const ValidationCharteEtCGU = ({
  precedent,
  surValidation,
}: {
  precedent: () => void;
  surValidation: () => void;
}) => {
  const [cguValidees, setCguValidees] = useState(false);
  const [charteValidee, setCharteValidee] = useState(false);
  useEffect(() => activeValidationCharteAidant(), []);

  return (
    <div className="fr-container fr-grid-row fr-grid-row--center zone-signature-charte-aidant">
      <div className="fr-col-12 section">
        <TypographieH3>
          Vous souhaitez utiliser l’outil de diagnostic de l’ANSSI et être
          référencé Aidant cyber.
        </TypographieH3>
        <p>
          Veuillez consulter et accepter la Charte de l’Aidant MonAideCyber.
        </p>
        <div className="zone-charte-defilable">
          <CharteAidant />
        </div>
        <br />
        <div className="fr-checkbox-group mac-radio-group">
          <Input
            disabled={true}
            type="checkbox"
            id="charte-aidant"
            name="charte-aidant"
            onChange={() => setCharteValidee((prev) => !prev)}
            checked={charteValidee}
          />
          <label className="fr-label" htmlFor="charte-aidant">
            En cochant la case, je m’engage sur l’honneur à respecter la charte
            de l’Aidant MonAideCyber
          </label>
        </div>
        <ChampValidationCGUs
          sontValidees={cguValidees}
          surCguCliquees={() => setCguValidees((prev) => !prev)}
        />
        <div className="validation alignee-droite">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              precedent();
            }}
          >
            <span>Précédent</span>
          </Button>
          <Button
            disabled={!charteValidee || !cguValidees}
            variant="primary"
            type="button"
            onClick={() => {
              surValidation();
            }}
          >
            <span>Suivant</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
