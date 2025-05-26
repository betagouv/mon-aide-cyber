import { TypographieH4 } from '../typographie/TypographieH4/TypographieH4';
import tornadeSvg from '../../../../public/images/illustration-tornade.svg';

const TuileActionKitDeCommunication = () => (
  <div className="tuile tuile-grande">
    <div className="illustration">
      <img src={tornadeSvg} alt="Divers medium de communication" />
    </div>
    <div className="corps">
      <TypographieH4>Notre kit de communication</TypographieH4>
      <p>
        Vous souhaitez communiquer autour du dispositif MonAideCyber ? {` `}
        <b>Téléchargez les ressources</b> mises à disposition dans notre kit de
        communication !
      </p>
      <a href="/promouvoir-diagnostic-cyber">
        <button type="button" className="fr-btn bouton-mac bouton-mac-primaire">
          En savoir plus
        </button>
      </a>
    </div>
  </div>
);

export default TuileActionKitDeCommunication;
