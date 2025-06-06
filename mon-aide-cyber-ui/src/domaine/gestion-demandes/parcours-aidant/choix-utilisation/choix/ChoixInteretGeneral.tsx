import { Choix } from './Choix.tsx';
import { TypographieH5 } from '../../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import illustrationInteretGeneralMAC from '../../../../../../public/images/illustration-interet-general-mac.svg';

const ChoixInteretGeneral = ({
  actif,
  surChoix,
}: {
  actif: boolean;
  surChoix: () => void;
}) => {
  return (
    <Choix
      className="carte-choix-utilisation formulaire-colonne-droite"
      name="choix-utilisation-service"
      surSelection={surChoix}
      actif={actif}
    >
      <img
        src={illustrationInteretGeneralMAC}
        alt="Illustration d’une personne oeuvrant pour l’intérêt général."
      />
      <div>
        <TypographieH5>
          Je souhaite utiliser l’outil de diagnostic de l’ANSSI et être
          référencé Aidant cyber
        </TypographieH5>
      </div>
      <div className="checklist">
        <div className="item">
          <div className="vert">
            <i className="fr-icon-check-line"></i>
          </div>
          <div>Je suis référencé Aidant cyber</div>
        </div>
        <div className="item">
          <div className="rouge">
            <i className="fr-icon-close-line"></i>
          </div>
          <div>Je ne peux pas utiliser MonAideCyber à des fins lucratives</div>
        </div>
      </div>
      <div className="mac-callout mac-callout-information">
        <i className="fr-icon-user-fill" />
        <div>
          <p>Accessible :</p>
          <ul>
            <li>aux agents publics</li>
            <li>
              aux salariés ou adhérents d'un relais associatif ou qui souhaitent
              le devenir
            </li>
          </ul>
        </div>
      </div>
    </Choix>
  );
};
export default ChoixInteretGeneral;
