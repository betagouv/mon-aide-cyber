import illustrationCadreProfessionnelMAC from '../../../../../../public/images/illustration-cadre-professionnel-mac.svg';
import { TypographieH5 } from '../../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import { Choix } from './Choix.tsx';

const ChoixActiviteProfessionnelle = ({
  actif,
  surChoix,
}: {
  actif: boolean;
  surChoix: () => void;
}) => {
  return (
    <Choix
      className="carte-choix-utilisation "
      name="choix-utilisation-service"
      surSelection={surChoix}
      actif={actif}
    >
      <img
        src={illustrationCadreProfessionnelMAC}
        alt="Illustration d’une personne travaillant dans le cadre professionnel."
      />

      <div>
        <TypographieH5>
          Je souhaite utiliser librement l’outil de diagnostic de l’ANSSI
        </TypographieH5>
      </div>
      <div className="checklist">
        <div className="item">
          <div className="vert">
            <i className="fr-icon-check-line"></i>
          </div>
          <div>Je peux m’appuyer sur MonAideCyber à des fins lucratives</div>
        </div>
        <div className="item">
          <div className="rouge">
            <i className="fr-icon-close-line"></i>
          </div>
          <div>Je ne suis pas référencé en tant qu’”Aidant cyber”</div>
        </div>
      </div>
      <div className="mac-callout mac-callout-information">
        <i className="fr-icon-user-fill" />
        <div>Accessible à tous</div>
      </div>
    </Choix>
  );
};
export default ChoixActiviteProfessionnelle;
