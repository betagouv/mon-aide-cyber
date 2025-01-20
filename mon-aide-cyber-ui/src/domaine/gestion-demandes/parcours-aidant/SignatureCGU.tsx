import { useState } from 'react';
import Button from '../../../composants/atomes/Button/Button.tsx';
import { TypographieH5 } from '../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import illustrationCadreProfessionnelMAC from '../../../../public/images/illustration-cadre-professionnel-mac.svg';
import { ChampValidationCGUs } from '../../../composants/formulaires/ChampValidationCGUs.tsx';
import { URL_CRISP_MAC } from '../../../infrastructure/donnees/LiensExternes.ts';

export const SignatureCGU = ({
  valideCGUs,
  precedent,
}: {
  valideCGUs: () => void;
  precedent: () => void;
}) => {
  const [cguSignees, setCguSignees] = useState(false);

  return (
    <div className="fr-container fr-grid-row fr-grid-row--center">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        <div>
          <TypographieH5>
            Vous souhaitez utiliser librement l’outil de diagnostic de l’ANSSI.
          </TypographieH5>
          <div className="texte-centre">
            <img
              src={illustrationCadreProfessionnelMAC}
              alt="Illustration d’une personne travaillant dans le cadre professionnel."
            />
          </div>
          <p>
            Nous sommes ravis de vous compter parmi nos utilisateurs ! <br />
            Vous pouvez dès à présent accéder à la plateforme MonAideCyber et
            réaliser librement des diagnostics. <br />
            Nous vous invitons à consulter{' '}
            <a href={URL_CRISP_MAC} target="_blank" rel="noreferrer">
              notre FAQ
            </a>{' '}
            pour plus d&apos;informations.
          </p>
        </div>
        <ChampValidationCGUs
          sontValidees={cguSignees}
          surCguCliquees={() => setCguSignees((prev) => !prev)}
        />
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
            disabled={!cguSignees}
            variant="primary"
            type="button"
            onClick={() => {
              valideCGUs();
            }}
          >
            <span>Suivant</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
