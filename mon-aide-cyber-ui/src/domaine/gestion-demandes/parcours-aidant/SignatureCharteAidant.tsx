import { CharteAidant } from '../../../vues/CharteAidant.tsx';
import { useEffect, useState } from 'react';
import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { Input } from '../../../composants/atomes/Input/Input.tsx';
import Button from '../../../composants/atomes/Button/Button.tsx';

export const activeValidationCharteAidant = () => {
  const observateurDIntersection = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const checkboxSignatureCharte = document.getElementById(`charte-aidant`);
      if (!checkboxSignatureCharte) {
        return;
      }

      if (entry.isIntersecting) {
        checkboxSignatureCharte.removeAttribute('disabled');
      }
    });
  });

  const boutonRetourHautDePage = document.getElementById(
    'telechargement-charte'
  );
  observateurDIntersection.observe(boutonRetourHautDePage!);

  return () => observateurDIntersection.unobserve(boutonRetourHautDePage!);
};

export const SignatureCharteAidant = ({
  precedent,
  signeCharteAidant,
}: {
  precedent: () => void;
  signeCharteAidant: () => void;
}) => {
  const [charteSignee, setCharteSignee] = useState(false);
  useEffect(() => activeValidationCharteAidant(), []);

  return (
    <div className="fr-container fr-grid-row fr-grid-row--center zone-signature-charte-aidant">
      <div className="fr-col-12 section">
        <TypographieH3>
          Vous souhaitez utiliser l’outil de diagnostic de l’ANSSI et être
          référencé Aidant cyber.
        </TypographieH3>
        <p>Veuillez consulter et accepter la Charte de l’Aidant cyber.</p>
        <div className="champs-obligatoire">
          <span className="asterisque">*</span>
          <span> Champ obligatoire</span>
        </div>
        <br />
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
            onChange={() => setCharteSignee((prev) => !prev)}
            checked={charteSignee}
          />
          <label className="fr-label" htmlFor="charte-aidant">
            <p className="m-0">
              <span className="asterisque">*</span>
              En cochant la case, je m’engage sur l’honneur à respecter la
              charte de l’Aidant cyber
            </p>
          </label>
        </div>
        <br />
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
            disabled={!charteSignee}
            variant="primary"
            type="button"
            onClick={() => {
              signeCharteAidant();
            }}
          >
            <span>Suivant</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
