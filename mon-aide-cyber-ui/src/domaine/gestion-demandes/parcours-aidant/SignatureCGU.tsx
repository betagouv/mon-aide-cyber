import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { Input } from '../../../composants/atomes/Input/Input.tsx';
import { useState } from 'react';
import illustrationCadreProfessionnel from '../../../../public/images/illustration-cadre-professionnel.svg';

export const SignatureCGU = () => {
  const [cguSignees, setCguSignees] = useState(false);

  return (
    <div className="fr-container fr-grid-row fr-grid-row--center zone-signature-cgu">
      <div className="fr-col-12 section">
        <div>
          <TypographieH3>
            Vous souhaitez utiliser le dispositif dans le cadre de votre
            activité professionnelle
          </TypographieH3>
          <img
            src={illustrationCadreProfessionnel}
            alt="Illustration d’une personne travaillant dans le cadre professionnel."
          />
          <p>Vous êtes :</p>
          <ul>
            <li>
              Un professionnel, un prestataire ou un salarié d’une entreprise
              privée ou d’une organisation à fins de prospection ou
              d’accompagnement payant,
            </li>
            <li>Un assureur, une banque,</li>
            <li>
              Un étudiant, un retraité ou un particulier, hors adhérent d’une
              entité morale à but non lucratif
            </li>
          </ul>
          <p>
            À tout moment, il vous est possible de nous indiquer que vous
            préférez œuvrer pour l’intérêt général et être référencé Aidant
            cyber. Pour cela, contacter l’équipe via :{' '}
            <a href="mailto:monaidecyber@ssi.gouv.fr">
              monaidecyber@ssi.gouv.fr
            </a>
            <br />
            Pour accéder à votre tableau de bord, veuillez accepter les
            nouvelles conditions d’utilisation du service.
          </p>
        </div>
        <div className="fr-checkbox-group mac-radio-group">
          <Input
            type="checkbox"
            id="charte-aidant"
            name="charte-aidant"
            onChange={() => setCguSignees((prev) => !prev)}
            checked={cguSignees}
          />
          <label className="fr-label" htmlFor="charte-aidant">
            J'accepte les conditions générales d'utilisation de MonAideCyber
          </label>
        </div>
      </div>
    </div>
  );
};
